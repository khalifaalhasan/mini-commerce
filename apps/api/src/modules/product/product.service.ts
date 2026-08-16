import { Injectable, Logger } from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateProductDto } from "./dto/update-product.dto";
import { LogContext, LogEvent } from "@mini-commerce/logger";
import { FindAllProductsDto } from "./dto/find-all-product.dto";
import { Prisma } from "@mini-commerce/database";

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: Logger,
  ) {}

  // Create Product
  async create(createProductDto: CreateProductDto) {
    const product = await this.prisma.product.create({
      data: {
        name: createProductDto.name,
        price: createProductDto.price,
        stock: createProductDto.stock,
        description: createProductDto.description,
        categoryId: createProductDto.categoryId,
        images: createProductDto.images,
        sku: createProductDto.sku,
        slug: this.generateSlug(createProductDto.name),
      },
    });
    this.logger.log(
      {
        event: LogEvent.CREATE,
        productId: product.id,
      },
      LogContext.PRODUCT,
    );

    return product;
  }

  // Update Product
  async update(id: string, updateProductDto: UpdateProductDto) {
    const newSlug = updateProductDto.name
      ? this.generateSlug(updateProductDto.name)
      : undefined;

    const products = await this.prisma.product.update({
      where: { id },
      data: {
        name: updateProductDto.name,
        price: updateProductDto.price,
        stock: updateProductDto.stock,
        description: updateProductDto.description,
        categoryId: updateProductDto.categoryId,
        images: updateProductDto.images,
        sku: updateProductDto.sku,
        slug: newSlug,
      },
    });
    this.logger.log(
      {
        event: LogEvent.UPDATE,
        productId: products.id,
      },
      LogContext.PRODUCT,
    );
    return products;
  }

  //  Soft Delete
  async softDelete(id: string) {
    const products = await this.prisma.product.update({
      where: { id },
      data: { DeletedAt: new Date() },
    });
    this.logger.log(
      {
        event: LogEvent.DELETE,
        productId: products.id,
      },
      LogContext.PRODUCT,
    );
    return products;
  }

  async findAll(query: FindAllProductsDto) {
    const { page = 1, limit = 10, search, sortOrder = "desc" } = query;

    const skip = (page - 1) * limit;
    const take = limit;

    const where: Prisma.ProductWhereInput = search
      ? {
          name: {
            contains: search,
            mode: "insensitive",
          },
        }
      : {};

    const [products, total] = await this.prisma.$transaction([
      this.prisma.product.findMany({
        where,
        skip,
        take,
        orderBy: {
          createdAt: sortOrder,
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    this.logger.log(
      {
        event: LogEvent.FETCH,
        productCount: products.length,
        totalInDatabase: total,
        page,
      },
      LogContext.PRODUCT,
    );

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findBySlug(slug: string) {
    const products = await this.prisma.product.findUnique({
      where: { slug },
    });
    this.logger.log(
      {
        event: LogEvent.FETCH,
        productId: products?.id ?? "not_found",
      },
      LogContext.PRODUCT,
    );
    return products;
  }

  async findByCategory(categoryId: string) {
    const products = await this.prisma.product.findMany({
      where: { categoryId },
    });
    this.logger.log(
      {
        event: LogEvent.FETCH,
        productCount: products.length,
      },
      LogContext.PRODUCT,
    );
    return products;
  }

  private generateSlug(name: string): string {
    return name.toLowerCase().replace(/\s+/g, "-");
  }
}
