import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { Prisma } from 'generated/prisma/client';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  // =========================
  // GET ALL CATEGORY (PUBLIC)
  // =========================
  async findAll() {
    return this.prisma.category.findMany({
      orderBy: {
        name: 'asc',
      },
    });
  }

  // =========================
  // GET SINGLE CATEGORY BY SLUG
  // =========================
  async findOneBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
    });

    if (!category) {
      throw new NotFoundException('Kategori tidak ditemukan');
    }

    return category;
  }

  // =========================
  // CREATE CATEGORY (ADMIN)
  // =========================
  async create(dto: CreateCategoryDto) {
    const existing = await this.prisma.category.findFirst({
      where: {
        OR: [{ name: dto.name }, { slug: dto.slug }],
      },
    });

    if (existing) {
      throw new ConflictException('Kategori sudah ada');
    }

    return this.prisma.category.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
      },
    });
  }

  // =========================
  // GET PRODUCTS BY CATEGORY SLUG (PUBLIC)
  // =========================
  async findProductsBySlug(
    slug: string,
    params?: {
      page?: number;
      limit?: number;
      q?: string;
    },
  ) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
    });

    if (!category) {
      throw new NotFoundException('Kategori tidak ditemukan');
    }

    const page = params?.page ?? 1;
    const limit = Math.min(params?.limit ?? 12, 50);
    const skip = (page - 1) * limit;

    const where: Prisma.ProductWhereInput = {
      categoryId: category.id,
      status: 'PUBLISHED',
      stock: { gt: 0 },

      ...(params?.q
        ? {
            OR: [
              { name: { contains: params.q } },
              { gameTitle: { contains: params.q } },
              { description: { contains: params.q } },
            ],
          }
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
      category,
      items,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
