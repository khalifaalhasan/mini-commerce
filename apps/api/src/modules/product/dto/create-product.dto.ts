import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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
  @ApiProperty({ example: 'Sepatu Sneakers Premium' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'cuid_category_id_here' })
  @IsString()
  @IsNotEmpty()
  @Matches(CUID_REGEX, { message: 'categoryId must be a valid CUID' })
  categoryId!: string;

  @ApiProperty({ example: 'Sepatu sneakers berkualitas tinggi.' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiProperty({ example: 450000, description: 'Harga dalam Rupiah' })
  @IsNumber()
  @IsPositive()
  price!: number;

  @ApiProperty({ example: 100, minimum: 0 })
  @IsNumber()
  @Min(0)
  stock!: number;

  @ApiPropertyOptional({ example: 'SKU-SNEAKERS-001' })
  @IsString()
  @IsOptional()
  sku?: string;

  @ApiPropertyOptional({ example: ['https://example.com/img1.jpg'], type: [String] })
  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  images?: string[];
}
