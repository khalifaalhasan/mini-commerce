import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class CreateCategoryDto {
  @ApiProperty({ example: 'Elektronik', description: 'Nama kategori produk' })
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  name!: string;

  @ApiPropertyOptional({ example: 'Kategori untuk produk elektronik dan gadget.' })
  @IsString()
  @IsOptional()
  description?: string;
}
