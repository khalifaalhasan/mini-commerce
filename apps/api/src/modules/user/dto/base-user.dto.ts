import { IsOptional, IsString, IsUrl, MinLength } from "class-validator";

export class BaseUserDto {
  @IsString()
  @MinLength(3)
  name!: string;

  @IsUrl()
  @IsOptional()
  image?: string;
}
