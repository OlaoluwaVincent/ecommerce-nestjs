import { PartialType } from "@nestjs/mapped-types";
import { Category, CreateProductDto, ImageSides } from "./create-product.dto";

import {
  IsNumber,
  IsPositive,
  IsString,
  IsArray,
  IsOptional,
  IsBoolean,
} from "class-validator";
import { Type } from "class-transformer";

export class UpdateProductDto extends PartialType(CreateProductDto) {
  @IsOptional()
  @IsString()
  readonly title?: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsOptional()
  @IsNumber()
  readonly price?: number;

  @IsOptional()
  @IsNumber()
  readonly quantity?: number;

  @IsOptional()
  readonly images?: ImageSides;

  @IsOptional()
  @IsArray()
  readonly categories?: Category[];

  @IsOptional()
  @IsArray()
  @Type(() => String)
  readonly details?: string[];

  @IsOptional()
  @IsNumber()
  @IsPositive()
  readonly discount?: number;

  @IsOptional()
  @IsBoolean()
  readonly available?: boolean;
}
