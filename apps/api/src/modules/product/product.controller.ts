import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Patch,
  Delete,
  Query,
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { FindAllProductsDto } from "./dto/find-all-product.dto";
import { AllowAnonymous, Roles } from "@thallesp/nestjs-better-auth";
import { UserRole } from "../../common/enum/user-role.enum";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";

@ApiTags('Product')
@Controller("product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product (ADMIN)' })
  @Roles([UserRole.ADMIN])
  @ApiBearerAuth()
  async create(@Body() createProductDto: CreateProductDto) {
    return await this.productService.create(createProductDto);
  }

  // update Product
  @Patch(`/:id`)
  @ApiOperation({ summary: 'Update product (ADMIN)' })
  @Roles([UserRole.ADMIN])
  @ApiBearerAuth()
  async update(
    @Body() updateProductDto: UpdateProductDto,
    @Param("id") id: string,
  ) {
    return await this.productService.update(id, updateProductDto);
  }

  // soft delete Product
  @Delete(`/:id`)
  @ApiOperation({ summary: 'Soft delete product (ADMIN)' })
  @Roles([UserRole.ADMIN])
  @ApiBearerAuth()
  async softDelete(@Param("id") id: string) {
    return await this.productService.softDelete(id);
  }

  // get By Slug
  @AllowAnonymous()
  @Get(`/:slug`)
  @ApiOperation({ summary: 'Get product by slug (PUBLIC)' })
  async findBySlug(@Param("slug") slug: string) {
    return await this.productService.findBySlug(slug);
  }

  @AllowAnonymous()
  @Get(`/category/:categoryId`)
  @ApiOperation({ summary: 'Get products by category ID (PUBLIC)' })
  async findByCategory(@Param("categoryId") categoryId: string) {
    return await this.productService.findByCategory(categoryId);
  }

  @AllowAnonymous()
  @Get()
  @ApiOperation({ summary: 'Get all products with pagination (PUBLIC)' })
  async findAll(@Query() query: FindAllProductsDto) {
    return await this.productService.findAll(query);
  }
}
