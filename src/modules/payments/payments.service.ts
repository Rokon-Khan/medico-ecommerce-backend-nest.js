import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
  Logger,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { DataSource, DeepPartial, Repository } from 'typeorm';
import { Request } from 'express';
import { v4 as uuidv4 } from 'uuid';

import {
  Payment,
  PaymentMethod,
  PaymentStatus,
} from './entities/payment.entity';

import { Role } from 'src/auth/enums/role-type.enum';
import { Order } from '../orders/entities/order.entity';
import { SSLCommerzService } from './Sslcommerz.service';
import {
  CreatePaymentDto,
  SSLCommerzInitResponseDto,
  UpdatePaymentDto,
} from './dto/create-payment.dto';
import { GetPaymentDto } from './dto/get-payment.dto';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly dataSource: DataSource,
    private readonly configService: ConfigService,
    private readonly sslCommerzService: SSLCommerzService,

    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,

    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
  ) {}

  /* ════════════════════════════════════════════════
     CREATE / INITIATE PAYMENT
  ════════════════════════════════════════════════ */

  async create(
    req: Request,
    dto: CreatePaymentDto,
  ): Promise<Payment | SSLCommerzInitResponseDto> {
    const user = req.user;
    if (!user) throw new ForbiddenException('Authentication required');

    // 1. Load and validate the order
    const order = await this.orderRepo.findOne({
      where: { id: dto.order_id },
      relations: ['user'],
    });

    if (!order) throw new NotFoundException('Order not found');

    const isAdmin = user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN;
    const isOwner = order.user_id === String(user.sub);

    if (!isAdmin && !isOwner) {
      throw new ForbiddenException("You cannot pay for someone else's order");
    }

    // 2. Prevent double-payment
    const existingPaid = await this.paymentRepo.findOne({
      where: { order_id: dto.order_id, status: PaymentStatus.PAID },
    });
    if (existingPaid) {
      throw new ConflictException('This order has already been paid');
    }

    // 3. Validate amount matches order total (prevents amount tampering)
    const orderTotal = Number(order.total_amount);
    if (Math.abs(Number(dto.amount) - orderTotal) > 0.01) {
      throw new BadRequestException(
        `Payment amount ${dto.amount} does not match order total ${orderTotal}`,
      );
    }

    if (dto.method === PaymentMethod.SSLCOMMERZ) {
      return this.initiateSSLCommerz(req, dto, order);
    }

    // 4. COD or other non-gateway methods
    return this.createDirectPayment(dto);
  }

  /* ──────────────────────────────────────────────
     SSLCommerz Flow
  ────────────────────────────────────────────── */

  private async initiateSSLCommerz(
    req: Request,
    dto: CreatePaymentDto,
    order: any,
  ): Promise<SSLCommerzInitResponseDto> {
    const tran_id = uuidv4(); // unique per transaction
    const baseUrl = this.configService.getOrThrow<string>('APP_BASE_URL');

    // Store a PENDING payment record first
    const payment = await this.paymentRepo.save(
      this.paymentRepo.create({
        order: { id: dto.order_id },
        method: PaymentMethod.SSLCOMMERZ,
        amount: dto.amount,
        status: PaymentStatus.PENDING,
        transaction_id: tran_id,
      }),
    );

    // Build SSLCommerz payload
    const sslPayload = {
      total_amount: dto.amount,
      currency: 'BDT',
      tran_id,
      success_url: `${baseUrl}/payments/sslcommerz/success`,
      fail_url: `${baseUrl}/payments/sslcommerz/fail`,
      cancel_url: `${baseUrl}/payments/sslcommerz/cancel`,
      ipn_url: `${baseUrl}/payments/sslcommerz/ipn`,
      product_name: `Medicine Order #${order.order_number ?? order.id}`,
      product_category: 'Medicine',
      product_profile: 'non-physical-goods',
      cus_name: order.user?.name ?? 'Customer',
      cus_email: order.user?.email ?? 'noemail@example.com',
      cus_phone: order.user?.phone ?? '01700000000',
      cus_add1: order.shipping_address?.line1 ?? 'N/A',
      cus_city: order.shipping_address?.city ?? 'Dhaka',
      cus_country: 'Bangladesh',
      shipping_method: 'NO',
      ship_name: order.user?.name ?? 'Customer',
      ship_add1: order.shipping_address?.line1 ?? 'N/A',
      ship_city: order.shipping_address?.city ?? 'Dhaka',
      ship_country: 'Bangladesh',
    };

    const gatewayResponse =
      await this.sslCommerzService.initiatePayment(sslPayload);

    // Persist the session key for later validation
    await this.paymentRepo.update(payment.id, {
      session_key: gatewayResponse.sessionkey,
      gateway_response: JSON.stringify(gatewayResponse),
    });

    return {
      payment_url: gatewayResponse.GatewayPageURL!,
      payment_id: payment.id,
      tran_id,
    };
  }

  /* ──────────────────────────────────────────────
     Direct payment (COD)
  ────────────────────────────────────────────── */

  private async createDirectPayment(dto: CreatePaymentDto): Promise<Payment> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const repo = queryRunner.manager.getRepository(Payment);

      const payment = repo.create({
        order_id: dto.order_id,
        method: dto.method as unknown as PaymentMethod,
        transaction_id: dto.transaction_id ?? undefined,
        amount: dto.amount,
        status: PaymentStatus.PENDING,
        // omit paid_at entirely — it's nullable in DB, no need to set it
      } as unknown as DeepPartial<Payment>);

      const saved = await repo.save(payment);
      await queryRunner.commitTransaction();
      return saved;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Direct payment creation failed', error);
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  /* ════════════════════════════════════════════════
     SSLCommerz CALLBACKS
  ════════════════════════════════════════════════ */

  /**
   * IPN (Instant Payment Notification) — server-to-server, most reliable.
   * SSLCommerz calls this endpoint directly after payment.
   */
  async handleIpn(
    payload: Record<string, string>,
    clientIp: string,
  ): Promise<void> {
    // 1. Verify IPN signature first — reject forged callbacks immediately
    const isValid = this.sslCommerzService.verifyIpnSignature(payload);
    if (!isValid) {
      this.logger.warn(`Invalid IPN signature from IP: ${clientIp}`);
      throw new BadRequestException('Invalid IPN signature');
    }

    const tran_id = payload['tran_id'];
    const val_id = payload['val_id'];
    const status = payload['status'];

    if (!tran_id) throw new BadRequestException('Missing tran_id');

    const payment = await this.paymentRepo.findOne({
      where: { transaction_id: tran_id },
    });

    if (!payment) {
      this.logger.warn(`IPN received for unknown transaction: ${tran_id}`);
      return; // Return 200 to SSLCommerz so it stops retrying
    }

    // Idempotency: don't reprocess already-completed payments
    if (payment.status === PaymentStatus.PAID) {
      this.logger.log(`Duplicate IPN for tran_id: ${tran_id}`);
      return;
    }

    if (status === 'VALID' || status === 'VALIDATED') {
      // 2. Re-validate with SSLCommerz API to confirm legitimacy
      const validation = await this.sslCommerzService.validatePayment(val_id);

      if (validation.status === 'VALID' || validation.status === 'VALIDATED') {
        // 3. Verify amount matches (prevent partial-payment fraud)
        const gatewayAmount = parseFloat(validation.amount);
        const expectedAmount = Number(payment.amount);
        if (Math.abs(gatewayAmount - expectedAmount) > 0.01) {
          this.logger.error(
            `Amount mismatch! Expected ${expectedAmount}, got ${gatewayAmount} for tran_id ${tran_id}`,
          );
          await this.markPaymentFailed(
            payment.id,
            'Amount mismatch detected',
            clientIp,
            payload,
          );
          return;
        }

        await this.markPaymentSuccess(payment.id, val_id, clientIp, payload);
        this.logger.log(`Payment confirmed via IPN for tran_id: ${tran_id}`);
      } else {
        await this.markPaymentFailed(
          payment.id,
          `Validation returned: ${validation.status}`,
          clientIp,
          payload,
        );
      }
    } else if (status === 'FAILED') {
      await this.markPaymentFailed(
        payment.id,
        payload['error'] ?? 'Gateway reported failure',
        clientIp,
        payload,
      );
    } else if (status === 'CANCELLED') {
      await this.paymentRepo.update(payment.id, {
        status: PaymentStatus.CANCELLED,
        gateway_response: JSON.stringify(payload),
        callback_ip: clientIp,
      });
    }
  }

  /**
   * Success redirect — user is redirected here by browser after payment.
   * NOTE: Do NOT rely on this alone; always use IPN for confirmation.
   */
  async handleSuccess(
    payload: Record<string, string>,
    clientIp: string,
  ): Promise<{ redirect_url: string }> {
    const isValid = this.sslCommerzService.verifyIpnSignature(payload);
    if (!isValid) throw new BadRequestException('Invalid signature');

    const frontendUrl = this.configService.getOrThrow<string>('FRONTEND_URL');
    const tran_id = payload['tran_id'];
    const val_id = payload['val_id'];

    const payment = await this.paymentRepo.findOne({
      where: { transaction_id: tran_id },
    });

    if (!payment || payment.status === PaymentStatus.PAID) {
      return {
        redirect_url: `${frontendUrl}/orders/success?tran_id=${tran_id}`,
      };
    }

    // Validate with SSLCommerz
    const validation = await this.sslCommerzService.validatePayment(val_id);
    if (validation.status === 'VALID' || validation.status === 'VALIDATED') {
      await this.markPaymentSuccess(payment.id, val_id, clientIp, payload);
    }

    return { redirect_url: `${frontendUrl}/orders/success?tran_id=${tran_id}` };
  }

  async handleFail(
    payload: Record<string, string>,
    clientIp: string,
  ): Promise<{ redirect_url: string }> {
    const frontendUrl = this.configService.getOrThrow<string>('FRONTEND_URL');
    const tran_id = payload['tran_id'];

    if (tran_id) {
      const payment = await this.paymentRepo.findOne({
        where: { transaction_id: tran_id },
      });
      if (payment && payment.status === PaymentStatus.PENDING) {
        await this.markPaymentFailed(
          payment.id,
          payload['error'] ?? 'User redirected to fail URL',
          clientIp,
          payload,
        );
      }
    }

    return { redirect_url: `${frontendUrl}/orders/failed?tran_id=${tran_id}` };
  }

  async handleCancel(
    payload: Record<string, string>,
    clientIp: string,
  ): Promise<{ redirect_url: string }> {
    const frontendUrl = this.configService.getOrThrow<string>('FRONTEND_URL');
    const tran_id = payload['tran_id'];

    if (tran_id) {
      await this.paymentRepo.update(
        { transaction_id: tran_id },
        {
          status: PaymentStatus.CANCELLED,
          gateway_response: JSON.stringify(payload),
          callback_ip: clientIp,
        },
      );
    }

    return {
      redirect_url: `${frontendUrl}/orders/cancelled?tran_id=${tran_id}`,
    };
  }

  /* ════════════════════════════════════════════════
     READ
  ════════════════════════════════════════════════ */

  async findAll(req: Request, query: GetPaymentDto): Promise<Payment[]> {
    const user = req.user;
    if (!user) throw new ForbiddenException('Authentication required');

    const isAdmin = user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN;

    const qb = this.paymentRepo
      .createQueryBuilder('p')
      .leftJoinAndSelect('p.order', 'order')
      .orderBy('p.created_at', 'DESC');

    // Non-admins only see their own payments
    if (!isAdmin) {
      qb.andWhere('order.user_id = :userId', { userId: String(user.sub) });
    }

    if (query.order_id)
      qb.andWhere('p.order_id = :order_id', { order_id: query.order_id });
    if (query.method)
      qb.andWhere('p.method = :method', { method: query.method });
    if (query.status)
      qb.andWhere('p.status = :status', { status: query.status });
    if (query.transaction_id) {
      qb.andWhere('p.transaction_id = :tid', { tid: query.transaction_id });
    }

    return qb.getMany();
  }

  async findOne(req: Request, id: string): Promise<Payment> {
    const user = req.user;
    if (!user) throw new ForbiddenException('Authentication required');

    const payment = await this.paymentRepo.findOne({
      where: { id },
      relations: ['order'],
    });

    if (!payment) throw new NotFoundException('Payment not found');

    const isAdmin = user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN;
    const isOwner = payment.order.user_id === String(user.sub);

    if (!isAdmin && !isOwner) throw new ForbiddenException('Access denied');

    return payment;
  }

  /* ════════════════════════════════════════════════
     UPDATE / DELETE (Admin only)
  ════════════════════════════════════════════════ */

  async update(
    req: Request,
    id: string,
    dto: UpdatePaymentDto,
  ): Promise<Payment> {
    this.assertAdmin(req.user);

    const payment = await this.paymentRepo.findOne({ where: { id } });
    if (!payment) throw new NotFoundException('Payment not found');

    Object.assign(payment, dto);
    if (dto.status === PaymentStatus.PAID && !payment.paid_at) {
      payment.paid_at = new Date();
    }

    return this.paymentRepo.save(payment);
  }

  async remove(req: Request, id: string): Promise<{ deleted: true }> {
    this.assertAdmin(req.user);

    const payment = await this.paymentRepo.findOne({ where: { id } });
    if (!payment) throw new NotFoundException('Payment not found');

    await this.paymentRepo.remove(payment);
    return { deleted: true };
  }

  /* ════════════════════════════════════════════════
     PRIVATE HELPERS
  ════════════════════════════════════════════════ */

  private async markPaymentSuccess(
    paymentId: string,
    valId: string,
    clientIp: string,
    rawPayload: Record<string, string>,
  ): Promise<void> {
    await this.paymentRepo.update(paymentId, {
      status: PaymentStatus.PAID,
      val_id: valId,
      paid_at: new Date(),
      gateway_response: JSON.stringify(rawPayload),
      callback_ip: clientIp,
    });
  }

  private async markPaymentFailed(
    paymentId: string,
    reason: string,
    clientIp: string,
    rawPayload: Record<string, string>,
  ): Promise<void> {
    await this.paymentRepo.update(paymentId, {
      status: PaymentStatus.FAILED,
      failure_reason: reason,
      gateway_response: JSON.stringify(rawPayload),
      callback_ip: clientIp,
    });
  }

  private assertAdmin(user: any): void {
    if (!user) throw new ForbiddenException('Authentication required');
    const isAdmin = user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN;
    if (!isAdmin) throw new ForbiddenException('Admin access required');
  }
}
