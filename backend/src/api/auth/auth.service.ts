import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { LoginDto, RegisterDto } from './dto/create-auth.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  // LOGIC REGISTER //
  async register(dto: RegisterDto) {
    // 1. Cek apakah user sudah ada
    const UserExists = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (UserExists) throw new ConflictException('Email sudah terdaftar');

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    const newUser = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
        name: dto.name,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
    return {
      message: 'User Berhasil Register!',
      data: newUser,
      statusCode: 201,
    };
  }

  // LOGIC LOGIN //
  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });
    if (!user) throw new UnauthorizedException('Username tidak ditemukan');

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Password salah');

    const payload = { sub: user.id, email: user.email };
    const token = await this.jwtService.signAsync(payload);
    return {
      message: 'User Berhasil Login!',
      statusCode: 200,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
        token: token,
      },
    };
  }
}
