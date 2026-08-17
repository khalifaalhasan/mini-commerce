import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from "@nestjs/common";
import { CategoryService } from "./category.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { UpdateCategoryDto } from "./dto/update-category.dto";
import { AllowAnonymous } from "@thallesp/nestjs-better-auth";

@Controller("category")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoryService.create(createCategoryDto);
  }

  @Patch("/:id")
  async update(
    @Param("id") id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.categoryService.update(id, updateCategoryDto);
  }

  @AllowAnonymous()
  @Get()
  async findAll() {
    return await this.categoryService.findAll();
  }

  @AllowAnonymous()
  @Get("/:slug")
  async findBySlug(@Param("slug") slug: string) {
    return await this.categoryService.findBySlug(slug);
  }

  @Delete("/:id")
  async remove(@Param("id") id: string) {
    return await this.categoryService.softDelete(id);
  }
}
