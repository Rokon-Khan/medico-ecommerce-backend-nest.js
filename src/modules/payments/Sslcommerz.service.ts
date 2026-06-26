import {
  Injectable,
  BadRequestException,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import * as crypto from 'crypto';

export interface SSLCommerzInitPayload {
  total_amount: number;
  currency: string;
  tran_id: string;
  success_url: string;
  fail_url: string;
  cancel_url: string;
  ipn_url: string;
  product_name: string;
  product_category: string;
  product_profile: string;
  cus_name: string;
  cus_email: string;
  cus_phone: string;
  cus_add1: string;
  cus_city: string;
  cus_country: string;
  shipping_method: string;
  ship_name: string;
  ship_add1: string;
  ship_city: string;
  ship_country: string;
}

export interface SSLCommerzResponse {
  status: string;
  failedreason?: string;
  sessionkey?: string;
  GatewayPageURL?: string;
  storeBanner?: string;
  storeLogo?: string;
  desc?: any[];
  is_direct_pay_enable?: string;
}

export interface SSLCommerzIPNPayload {
  val_id: string;
  amount: string;
  card_type: string;
  store_amount: string;
  card_no: string;
  bank_tran_id: string;
  status: string;
  tran_date: string;
  error: string;
  currency: string;
  card_issuer: string;
  card_brand: string;
  card_issuer_country: string;
  card_issuer_country_code: string;
  store_id: string;
  verify_sign: string;
  verify_sign_sha2: string;
  verify_key: string;
  currency_type: string;
  currency_amount: string;
  currency_rate: string;
  base_fair: string;
  value_a?: string;
  value_b?: string;
  value_c?: string;
  value_d?: string;
  tran_id: string;
  subscription_id?: string;
  risk_level?: string;
  risk_title?: string;
}

@Injectable()
export class SSLCommerzService {
  private readonly logger = new Logger(SSLCommerzService.name);
  private readonly storeId: string;
  private readonly storePassword: string;
  private readonly isTestMode: boolean;
  private readonly paymentUrl: string;
  private readonly validationUrl: string;

  constructor(private readonly configService: ConfigService) {
    this.storeId = this.configService.getOrThrow<string>('SSLC_STORE_ID');
    this.storePassword = this.configService.getOrThrow<string>(
      'SSLC_STORE_PASSWORD',
    );
    this.isTestMode =
      this.configService.get<string>('SSLC_TESTMODE') === 'true';
    this.paymentUrl = this.configService.getOrThrow<string>('SSLC_PAYMENT_URL');
    this.validationUrl = this.configService.getOrThrow<string>(
      'SSLC_VALIDATION_URL',
    );
  }

  /**
   * Initiates a payment session with SSLCommerz
   */
  async initiatePayment(
    payload: SSLCommerzInitPayload,
  ): Promise<SSLCommerzResponse> {
    try {
      const params = new URLSearchParams({
        store_id: this.storeId,
        store_passwd: this.storePassword,
        ...Object.fromEntries(
          Object.entries(payload).map(([k, v]) => [k, String(v)]),
        ),
      });

      const { data } = await axios.post<SSLCommerzResponse>(
        this.paymentUrl,
        params.toString(),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          timeout: 15_000,
        },
      );

      if (data.status !== 'SUCCESS') {
        this.logger.warn(`SSLCommerz initiation failed: ${data.failedreason}`);
        throw new BadRequestException(
          `Payment gateway error: ${data.failedreason ?? 'Unknown error'}`,
        );
      }

      return data;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;
      this.logger.error('SSLCommerz initiation error', error);
      throw new InternalServerErrorException('Payment gateway unreachable');
    }
  }

  /**
   * Validates IPN/redirect payload via SSLCommerz validation API
   */
  async validatePayment(valId: string): Promise<any> {
    try {
      const { data } = await axios.get(this.validationUrl, {
        params: {
          val_id: valId,
          store_id: this.storeId,
          store_passwd: this.storePassword,
          format: 'json',
        },
        timeout: 15_000,
      });

      return data;
    } catch (error) {
      this.logger.error('SSLCommerz validation error', error);
      throw new InternalServerErrorException('Payment validation failed');
    }
  }

  /**
   * Verify IPN signature to protect against forged callbacks
   * SSLCommerz signs with MD5(store_password + sorted key=value pairs)
   */
  verifyIpnSignature(payload: Record<string, string>): boolean {
    try {
      const receivedSign = payload['verify_sign'];
      const verifyKey = payload['verify_key'];

      if (!receivedSign || !verifyKey) return false;

      const keys = verifyKey.split(',');
      const sortedPairs = keys
        .sort()
        .map((k) => `${k}=${payload[k] ?? ''}`)
        .join('&');

      const rawString = `${this.storePassword}&${sortedPairs}`;
      const hash = crypto.createHash('md5').update(rawString).digest('hex');

      return hash === receivedSign;
    } catch {
      return false;
    }
  }

  get testMode(): boolean {
    return this.isTestMode;
  }
}
