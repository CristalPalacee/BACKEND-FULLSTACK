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
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

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

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Req()
    req: RequestWithUser,
    @Body() createProductDto: CreateProductDto,
  ) {
    const result = await this.productService.create(
      createProductDto,
      req.user.userId,
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

  @Get()
  async findAll() {
    const product = await this.productService.findAll();
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
  @UseGuards(AuthGuard('jwt'))
  @Get('my-product') // Endpoint: GET /product/my-products
  async getMyProducts(@Req() req: RequestWithUser) {
    // userId diambil dari token yang sudah divalidasi oleh JwtStrategy
    const userId = req.user.userId;

    const product = await this.productService.findMyProducts(userId);

    return {
      data: product,
      message: 'Berhasil mengambil daftar produk Anda',
      success: true,
      statusCode: 200,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return await this.productService.update(id, updateProductDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.productService.remove(id);
  }
}
