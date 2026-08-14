import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: Logger,
  ) {}

  async create(createProductDto: CreateProductDto) {
    try {
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
        `Product created successfully: ${product.id}`,
        ProductService.name,
      );

      return product;
    } catch (error) {
      this.logger.error(
        ` Failed to create product into database`,
        error,
        ProductService.name,
      );
      throw new InternalServerErrorException('Failed to create product');
    }
  }

  private generateSlug(name: string): string {
    return name.toLowerCase().replace(/\s+/g, '-');
  }
}
