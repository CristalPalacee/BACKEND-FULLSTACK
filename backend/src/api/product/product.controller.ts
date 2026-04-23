import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Headers,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags } from '@nestjs/swagger';
import { QueryProductDto } from './dto/query-product.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/oles.guard';
import { CurrentUser, JwtUser } from 'src/common/decorator/get-user.decorator';
import { Role } from 'generated/prisma/enums';
import { Roles } from 'src/common/decorator/roles.decorator';

interface RequestWithUser extends Request {
  user: {
    userId: string;
    email: string;
  };
}
@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // =========================
  // PUBLIC
  // =========================

  @Get()
  async findPublic(@Query() query: QueryProductDto) {
    const data = await this.productService.findPublic(query);

    return {
      success: true,
      message: 'Berhasil mengambil daftar produk publik',
      data,
    };
  }

  @Get(':slug')
  async findPublicBySlug(@Param('slug') slug: string) {
    const data = await this.productService.findPublicBySlug(slug);

    return {
      success: true,
      message: 'Berhasil mengambil detail produk',
      data,
    };
  }

  // =========================
  // SELLER / ADMIN
  // =========================
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post()
  async create(
    @Req()
    req: RequestWithUser,
    @Body() createProductDto: CreateProductDto,
    @CurrentUser() user: JwtUser,
  ) {
    const result = await this.productService.create(
      createProductDto,
      user.sub,
      user.role as Role,
    );

    if (!result) {
      return {
        data: null,
        message: 'Produk gagal ditambahkan',
        success: false,
        statusCode: 400,
      };
    }

    return {
      data: result,
      message: 'Produk berhasil ditambahkan',
      success: true,
      statusCode: 201,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SELLER', 'ADMIN')
  @Get('seller/me')
  async findMine(@CurrentUser() user: JwtUser) {
    const product = await this.productService.findMine(
      user.sub,
      user.role as Role,
    );
    if (!product) {
      return {
        data: null,
        message: 'Produk tidak ditemukan',
        success: false,
        statusCode: 404,
      };
    }
    return {
      data: product,
      message: 'Produk berhasil ditemukan',
      success: true,
      statusCode: 200,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SELLER', 'ADMIN')
  @Get('seller/me/:id') // Endpoint: GET /product/my-products
  async findMineById(@Param('id') id: string, @CurrentUser() user: JwtUser) {
    // userId diambil dari token yang sudah divalidasi oleh JwtStrategy

    const product = await this.productService.findMineById(
      id,
      user.sub,
      user.role as Role,
    );

    return {
      data: product,
      message: 'Berhasil mengambil daftar produk Anda',
      success: true,
      statusCode: 200,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SELLER', 'ADMIN')
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
    @CurrentUser() user: JwtUser,
  ) {
    const data = await this.productService.update(
      id,
      dto,
      user.sub,
      user.role as Role,
    );

    return {
      success: true,
      message: 'Produk berhasil diperbarui',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SELLER', 'ADMIN')
  @Patch(':id/publish')
  async publish(@Param('id') id: string, @CurrentUser() user: JwtUser) {
    const data = await this.productService.publish(
      id,
      user.sub,
      user.role as Role,
    );

    return {
      success: true,
      message: 'Produk berhasil dipublish',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SELLER', 'ADMIN')
  @Patch(':id/archive')
  async archive(@Param('id') id: string, @CurrentUser() user: JwtUser) {
    const data = await this.productService.archive(
      id,
      user.sub,
      user.role as Role,
    );

    return {
      success: true,
      message: 'Produk berhasil diarsipkan',
      data,
    };
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SELLER', 'ADMIN')
  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: JwtUser) {
    const data = await this.productService.remove(
      id,
      user.sub,
      user.role as Role,
    );

    return {
      success: true,
      message: 'Produk berhasil dihapus',
      data,
    };
  }
}
