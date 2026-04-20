import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}
  async create(dto: CreateProductDto) {
    return await this.prisma.product.create({
      data: {
        name: dto.name,
        price: dto.price,
        stock: dto.stock,
        description: dto.description,
      },
    });
  }

  async findAll() {
    return await this.prisma.product.findMany();
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new Error('Produk dengan ID ${id} tidak ditemukan');
    }
    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    return await this.prisma.product.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    return await this.prisma.product.delete({ where: { id } });
  }
}
