import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    const result = await this.productService.create(createProductDto);

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
    const products = await this.productService.findAll();
    if (!products) {
      return {
        data: null,
        message: 'Produk tidak ditemukan',
        success: false,
        statusCode: 404,
      };
    }
    return {
      data: products,
      message: 'Produk berhasil ditemukan',
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
