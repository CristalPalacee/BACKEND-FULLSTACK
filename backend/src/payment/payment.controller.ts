import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { CurrentUser, JwtUser } from 'src/common/decorator/get-user.decorator';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(JwtAuthGuard)
  @Post('midtrans/token')
  async createToken(
    @Body() dto: CreatePaymentDto,
    @CurrentUser() user: JwtUser,
  ) {
    const data = await this.paymentService.createSnapTransaction(
      dto.orderId,
      user.sub,
    );

    return {
      success: true,
      message: 'Snap token berhasil dibuat',
      data,
    };
  }

  @HttpCode(200)
  @Post('midtrans/webhook')
  async webhook(@Body() body: any) {
    const data = await this.paymentService.handleNotification(body);

    return {
      success: true,
      message: 'Webhook diterima',
      data,
    };
  }
}
