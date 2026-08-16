import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Patch,
  Delete,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { FindAllProductsDto } from './dto/find-all-product.dto';
import { AllowAnonymous } from '@thallesp/nestjs-better-auth';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}


  // sementara buat testing
  @AllowAnonymous()
  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productService.create(createProductDto);
  }

  // update Product
  @Patch(`/:id`)
  async update(
    @Body() updateProductDto: UpdateProductDto,
    @Param('id') id: string,
  ) {
    return await this.productService.update(id, updateProductDto);
  }

  // soft delete Product
  @Delete(`/:id`)
  async softDelete(@Param('id') id: string) {
    return await this.productService.softDelete(id);
  }

  // get By Slug
  @AllowAnonymous()
  @Get(`/:slug`)
  async findBySlug(@Param('slug') slug: string) {
    return await this.productService.findBySlug(slug);
  }

  @AllowAnonymous()
  @Get(`/category/:categoryId`)
  async findByCategory(@Param('categoryId') categoryId: string) {
    return await this.productService.findByCategory(categoryId);
  }

  @AllowAnonymous()
  @Get()
  async findAll(@Query() query: FindAllProductsDto) {
    return await this.productService.findAll(query);
  }
}
