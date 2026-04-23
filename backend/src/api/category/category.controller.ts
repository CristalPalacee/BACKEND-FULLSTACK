import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { JwtUser } from 'src/common/decorator/get-user.decorator';
import { RolesGuard } from 'src/common/guards/oles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  // =========================
  // PUBLIC
  // =========================

  @Get()
  async findAll() {
    const data = await this.categoryService.findAll();

    return {
      success: true,
      message: 'Berhasil mengambil daftar kategori',
      data,
    };
  }

  @Get(':slug')
  async findOneBySlug(@Param('slug') slug: string) {
    const data = await this.categoryService.findOneBySlug(slug);

    return {
      success: true,
      message: 'Berhasil mengambil detail kategori',
      data,
    };
  }

  @Get(':slug/products')
  async findProductsBySlug(
    @Param('slug') slug: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('q') q?: string,
  ) {
    const data = await this.categoryService.findProductsBySlug(slug, {
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 12,
      q,
    });

    return {
      success: true,
      message: 'Berhasil mengambil produk berdasarkan kategori',
      data,
    };
  }

  // =========================
  // ADMIN
  // =========================

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post()
  async create(@Body() dto: CreateCategoryDto, _user: JwtUser) {
    const data = await this.categoryService.create(dto);

    return {
      success: true,
      message: 'Kategori berhasil ditambahkan',
      data,
    };
  }
}
