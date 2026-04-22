import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as midtransClient from 'midtrans-client';
interface MidtransPayload {
  transaction_details: {
    order_id: string;
    gross_amount: number;
  };
  customer_details?: {
    email?: string;
    first_name?: string;
    last_name?: string;
    phone?: string;
  };
  // Kamu bisa tambah field lain seperti item_details jika perlu
}

interface MidtransNotificationResponse {
  order_id: string;
  transaction_status: string;
  fraud_status: string;
  payment_type?: string;
  status_code?: string;
  gross_amount?: string;
}

@Injectable()
export class PaymentService {
  private snap: midtransClient.Snap;
  constructor(private readonly configService: ConfigService) {
    this.snap = new midtransClient.Snap({
      isProduction:
        this.configService.get<boolean>('MIDTRANS_IS_PRODUCTION') || false,
      serverKey: this.configService.get<string>('MIDTRANS_SERVER_KEY') || '',
      clientKey: this.configService.get<string>('MIDTRANS_CLIENT_KEY') || '',
    });
  }
  async createTransaction(orderId: string, amount: number, email: string) {
    const payload: MidtransPayload = {
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
      customer_details: {
        email: email,
      },
    };

    try {
      const transaction = await this.snap.createTransaction(payload);
      return transaction;
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Unknown error';
      throw new Error(`Midtrans Notification Error: ${msg}`);
    }
  }

  handleNotification(payload: any): MidtransNotificationResponse {
    // Midtrans langsung kirim data via HTTP POST ke webhook URL kita
    // Tidak perlu panggil API lagi, langsung proses payload-nya
    const {
      order_id,
      transaction_status,
      fraud_status,
      payment_type,
      status_code,
      gross_amount,
    } = payload as MidtransNotificationResponse;

    return {
      order_id,
      transaction_status,
      fraud_status,
      payment_type,
      status_code,
      gross_amount,
    };
  }
}
