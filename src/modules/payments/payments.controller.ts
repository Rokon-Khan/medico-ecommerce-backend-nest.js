import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
  ParseUUIDPipe,
  Query,
  HttpCode,
  HttpStatus,
  Ip,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';

import { PaymentsService } from './payments.service';

import { JwtOrApiKeyGuard } from 'src/auth/guards/jwt-or-api-key.guard';
import { PermissionsGuard } from 'src/auth/guards/permissions.guard';
import { RequirePermissions } from 'src/auth/decorators/permissions.decorator';
import { Permission } from 'src/auth/enums/permission-type.enum';
import { CreatePaymentDto, PaymentResponseDto } from './dto/create-payment.dto';
import { GetPaymentDto } from './dto/get-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@ApiTags('Payments')
@ApiBearerAuth()
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  /* ════════════════════════════════════════════════
     AUTHENTICATED ENDPOINTS
  ════════════════════════════════════════════════ */

  /**
   * Initiate a payment.
   * For SSLCOMMERZ method: returns a redirect URL.
   * For COD/other methods: creates a pending payment record.
   */
  @Post()
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @RequirePermissions(Permission.PAYMENT_CREATE)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create / initiate a payment' })
  @ApiResponse({
    status: 201,
    description: 'Payment created or gateway URL returned',
  })
  create(@Req() req: Request, @Body() dto: CreatePaymentDto) {
    return this.paymentsService.create(req, dto);
  }

  /**
   * List payments (admin sees all; customers see their own)
   */
  @Get()
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @RequirePermissions(Permission.PAYMENT_READ)
  @ApiOperation({ summary: 'List payments' })
  @ApiResponse({ status: 200, type: [PaymentResponseDto] })
  findAll(@Req() req: Request, @Query() query: GetPaymentDto) {
    return this.paymentsService.findAll(req, query);
  }

  /**
   * Get a single payment (owner or admin)
   */
  @Get(':id')
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @RequirePermissions(Permission.PAYMENT_READ)
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiOperation({ summary: 'Get payment by ID' })
  findOne(@Req() req: Request, @Param('id', ParseUUIDPipe) id: string) {
    return this.paymentsService.findOne(req, id);
  }

  /**
   * Admin: update payment status / metadata
   */
  @Patch(':id')
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @RequirePermissions(Permission.PAYMENT_UPDATE)
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiOperation({ summary: 'Update payment (admin only)' })
  update(
    @Req() req: Request,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdatePaymentDto,
  ) {
    return this.paymentsService.update(req, id, dto);
  }

  /**
   * Admin: delete payment record
   */
  @Delete(':id')
  @UseGuards(JwtOrApiKeyGuard, PermissionsGuard)
  @RequirePermissions(Permission.PAYMENT_DELETE)
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiOperation({ summary: 'Delete payment (admin only)' })
  remove(@Req() req: Request, @Param('id', ParseUUIDPipe) id: string) {
    return this.paymentsService.remove(req, id);
  }

  /* ════════════════════════════════════════════════
     SSLCommerz PUBLIC CALLBACKS
     These are called by SSLCommerz / the user's browser — NO auth guard.
     Security is enforced via IPN signature verification inside the service.
  ════════════════════════════════════════════════ */

  /**
   * IPN — Server-to-server callback from SSLCommerz.
   * This is the authoritative payment confirmation endpoint.
   */
  @Post('sslcommerz/ipn')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'SSLCommerz IPN callback (server-to-server)' })
  async sslIpn(@Req() req: Request, @Ip() ip: string) {
    // req.body is urlencoded from SSLCommerz
    await this.paymentsService.handleIpn(req.body, ip);
    return { status: 'OK' }; // SSLCommerz expects a 200 OK
  }

  /**
   * Success redirect — user's browser is redirected here after payment.
   */
  @Post('sslcommerz/success')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'SSLCommerz success redirect' })
  async sslSuccess(
    @Req() req: Request,
    @Res() res: Response,
    @Ip() ip: string,
  ) {
    const result = await this.paymentsService.handleSuccess(req.body, ip);
    return res.redirect(result.redirect_url);
  }

  /**
   * Fail redirect — user's browser is redirected here on payment failure.
   */
  @Post('sslcommerz/fail')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'SSLCommerz fail redirect' })
  async sslFail(@Req() req: Request, @Res() res: Response, @Ip() ip: string) {
    const result = await this.paymentsService.handleFail(req.body, ip);
    return res.redirect(result.redirect_url);
  }

  /**
   * Cancel redirect — user's browser is redirected here on payment cancellation.
   */
  @Post('sslcommerz/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'SSLCommerz cancel redirect' })
  async sslCancel(@Req() req: Request, @Res() res: Response, @Ip() ip: string) {
    const result = await this.paymentsService.handleCancel(req.body, ip);
    return res.redirect(result.redirect_url);
  }
}
