import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsArray,
  IsOptional,
  IsPositive,
  Min,
  Matches,
} from 'class-validator';

const CUID_REGEX = /^c[a-zA-Z0-9_-]{24,}$/;

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(CUID_REGEX, { message: 'categoryId must be a valid CUID' })
  categoryId!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsNumber()
  @IsPositive()
  price!: number;

  @IsNumber()
  @Min(0)
  stock!: number;

  @IsString()
  @IsOptional()
  sku?: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  images?: string[];
}
