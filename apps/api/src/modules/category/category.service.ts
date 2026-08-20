import { Injectable, Logger } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { LogContext, LogEvent } from "@mini-commerce/logger";
import { UpdateCategoryDto } from "./dto/update-category.dto";

@Injectable()
export class CategoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: Logger,
  ) {}

  // create category
  async create(createCategoryDto: CreateCategoryDto) {
    const category = await this.prisma.category.create({
      data: {
        name: createCategoryDto.name,
        description: createCategoryDto.description,
        slug: this.generateSlug(createCategoryDto.name),
      },
    });
    this.logger.log(
      {
        event: LogEvent.CREATE,
        categoryId: category.id,
      },
      LogContext.CATEGORY,
    );
    return category;
  }

  // update category
  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const newSlug = updateCategoryDto.name
      ? this.generateSlug(updateCategoryDto.name)
      : undefined;

    const category = await this.prisma.category.update({
      where: { id },
      data: {
        name: updateCategoryDto.name,
        description: updateCategoryDto.description,
        slug: newSlug,
      },
    });
    this.logger.log(
      {
        event: LogEvent.UPDATE,
        categoryId: category.id,
      },
      LogContext.CATEGORY,
    );
    return category;
  }

  // soft delete
  async softDelete(id: string) {
    const category = await this.prisma.category.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    this.logger.log(
      {
        event: LogEvent.DELETE,
        categoryId: category.id,
      },
      LogContext.CATEGORY,
    );
    return category;
  }

  async findAll() {
    const category = await this.prisma.category.findMany();
    this.logger.log(
      {
        event: LogEvent.FETCH,
      },
      LogContext.CATEGORY,
    );
    return category;
  }

  async findBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
    });
    this.logger.log(
      {
        event: LogEvent.FETCH,
        productId: category?.id ?? "not_found",
      },
      LogContext.CATEGORY,
    );
    return category;
  }

  private generateSlug(name: string): string {
    return name.toLowerCase().replace(/\s+/g, "-");
  }
}
