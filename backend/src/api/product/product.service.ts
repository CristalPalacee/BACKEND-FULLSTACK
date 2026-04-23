import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Role } from 'generated/prisma/enums';
import { QueryProductDto } from './dto/query-product.dto';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateProductDto, sellerId: string, role: Role) {
    if (!['SELLER', 'ADMIN'].includes(role)) {
      throw new ForbiddenException(
        'Hanya seller atau admin yang dapat menambahkan produk',
      );
    }

    const existingSlug = await this.prisma.product.findUnique({
      where: { slug: dto.slug },
    });

    if (existingSlug) {
      throw new ConflictException('Slug sudah digunakan');
    }

    const category = await this.prisma.category.findUnique({
      where: { id: dto.categoryId },
    });

    if (!category) {
      throw new NotFoundException('Kategori tidak ditemukan');
    }

    return this.prisma.product.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        price: dto.price,
        stock: dto.stock,
        gameTitle: dto.gameTitle,
        accountLevel: dto.accountLevel,
        rank: dto.rank,
        serverRegion: dto.serverRegion,
        loginMethod: dto.loginMethod,
        thumbnailUrl: dto.thumbnailUrl,
        status: dto.status ?? 'DRAFT',
        isFeatured: dto.isFeatured ?? false,
        isPopular: dto.isPopular ?? false,
        publishedAt: dto.status === 'PUBLISHED' ? new Date() : null,
        sellerId,
        categoryId: dto.categoryId,
      },
      include: {
        category: true,
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async findPublic(query: QueryProductDto) {
    const page = query.page ?? 1;
    const limit = Math.min(query.limit ?? 12, 50);
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      status: 'PUBLISHED',
      stock: { gt: 0 },
      ...(query.q
        ? {
            OR: [
              { name: { contains: query.q } },
              { gameTitle: { contains: query.q } },
              { description: { contains: query.q } },
            ],
          }
        : {}),
      ...(query.categorySlug
        ? {
            category: {
              slug: query.categorySlug,
            },
          }
        : {}),
      ...(typeof query.featured === 'boolean'
        ? { isFeatured: query.featured }
        : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        include: {
          category: true,
          seller: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findPublicBySlug(slug: string) {
    const product = await this.prisma.product.findFirst({
      where: {
        slug,
        status: 'PUBLISHED',
      },
      include: {
        category: true,
        seller: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Produk tidak ditemukan');
    }

    return product;
  }

  async findMine(sellerId: string, role: Role) {
    if (!['SELLER', 'ADMIN'].includes(role)) {
      throw new ForbiddenException('Akses ditolak');
    }

    return this.prisma.product.findMany({
      where: { sellerId },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findMineById(id: string, sellerId: string, role: Role) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException('Produk tidak ditemukan');
    }

    if (role !== 'ADMIN' && product.sellerId !== sellerId) {
      throw new ForbiddenException('Produk ini bukan milik Anda');
    }

    return product;
  }

  async update(
    id: string,
    dto: UpdateProductDto,
    sellerId: string,
    role: Role,
  ) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Produk tidak ditemukan');
    }

    if (role !== 'ADMIN' && product.sellerId !== sellerId) {
      throw new ForbiddenException('Produk ini bukan milik Anda');
    }

    if (dto.slug && dto.slug !== product.slug) {
      const existingSlug = await this.prisma.product.findUnique({
        where: { slug: dto.slug },
      });

      if (existingSlug) {
        throw new ConflictException('Slug sudah digunakan');
      }
    }

    if (dto.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: dto.categoryId },
      });

      if (!category) {
        throw new NotFoundException('Kategori tidak ditemukan');
      }
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        ...dto,
        publishedAt:
          dto.status === 'PUBLISHED' && !product.publishedAt
            ? new Date()
            : dto.status && dto.status !== 'PUBLISHED'
              ? null
              : product.publishedAt,
      },
      include: {
        category: true,
      },
    });
  }

  async remove(id: string, sellerId: string, role: Role) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Produk tidak ditemukan');
    }

    if (role !== 'ADMIN' && product.sellerId !== sellerId) {
      throw new ForbiddenException('Produk ini bukan milik Anda');
    }

    return this.prisma.product.delete({
      where: { id },
    });
  }

  async publish(id: string, sellerId: string, role: Role) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Produk tidak ditemukan');
    }

    if (role !== 'ADMIN' && product.sellerId !== sellerId) {
      throw new ForbiddenException('Produk ini bukan milik Anda');
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
      },
    });
  }

  async archive(id: string, sellerId: string, role: Role) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException('Produk tidak ditemukan');
    }

    if (role !== 'ADMIN' && product.sellerId !== sellerId) {
      throw new ForbiddenException('Produk ini bukan milik Anda');
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        status: 'ARCHIVED',
      },
    });
  }
}
