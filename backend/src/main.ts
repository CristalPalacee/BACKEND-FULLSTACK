import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import 'dotenv/config';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()

    .setTitle('BACKEND WEB PENJUALAN AKUN')
    .setDescription('Dokumentasi API untuk backend JB Akun')
    .setVersion('1.0')
    .addTag('Order', 'Semua API untuk mengelola pesanan pelanggan') // Opsional: Tambahkan tag untuk pengelompokan
    .addTag('Product', 'Manajemen stok dan kategori produk')
    .addTag('Authentication', 'Login Dan Register')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, document);
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();
