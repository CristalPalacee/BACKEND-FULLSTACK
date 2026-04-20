import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  imports: [
    PrismaModule,
    PassportModule,
    // 2. Daftarkan JwtModule di sini
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'SECRET_KEY_KAMU',
      signOptions: { expiresIn: '1d' }, // Token berlaku 1 hari
    }),
  ],
})
export class AuthModule {}
