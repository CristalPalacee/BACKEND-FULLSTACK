import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { ProductModule } from './api/product/product.module';
import { OrderModule } from './api/order/order.module';
import { AuthModule } from './api/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { PaymentModule } from './payment/payment.module';
import { CategoryModule } from './api/category/category.module';
import { UsersModule } from './user/user.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Agar bisa dipakai di semua module tanpa import ulang
    }),

    //  Import Module lainnya //
    UsersModule,
    PrismaModule,
    ProductModule,
    OrderModule,
    AuthModule,
    PaymentModule,
    CategoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
