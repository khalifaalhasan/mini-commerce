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
import { AllowAnonymous, Roles } from "@thallesp/nestjs-better-auth";
import { UserRole } from "../../common/enum/user-role.enum";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";

@ApiTags('Category')
@Controller("category")
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new category (ADMIN)' })
  @ApiResponse({ status: 201, description: 'Category created successfully' })
  @Roles([UserRole.ADMIN])
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    return await this.categoryService.create(createCategoryDto);
  }

  @Patch("/:id")
  @ApiOperation({ summary: 'Update category (ADMIN)' })
  @Roles([UserRole.ADMIN])
  async update(
    @Param("id") id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.categoryService.update(id, updateCategoryDto);
  }

  @AllowAnonymous()
  @Get()
  @ApiOperation({ summary: 'Get all categories (PUBLIC)' })
  async findAll() {
    return await this.categoryService.findAll();
  }

  @AllowAnonymous()
  @Get("/:slug")
  @ApiOperation({ summary: 'Get category by slug (PUBLIC)' })
  async findBySlug(@Param("slug") slug: string) {
    return await this.categoryService.findBySlug(slug);
  }

  @Delete("/:id")
  @ApiOperation({ summary: 'Soft delete category (ADMIN)' })
  @Roles([UserRole.ADMIN])
  async remove(@Param("id") id: string) {
    return await this.categoryService.softDelete(id);
  }
}
