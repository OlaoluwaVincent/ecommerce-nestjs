import { PartialType } from "@nestjs/mapped-types";
import { Category, CreateProductDto } from "./create-product.dto";

import {
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
  readonly productName?: string;

  @IsOptional()
  @IsString()
  readonly price?: string;

  @IsOptional()
  @IsString()
  readonly quantity?: string;

  @IsOptional()
  @IsString()
  readonly minOrderQuantity?: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsOptional()
  @IsArray()
  @Type(() => String)
  readonly categories?: Category[];

  @IsOptional()
  @IsString()
  @IsPositive()
  readonly discount?: string;

  @IsOptional()
  @IsBoolean()
  readonly available?: boolean;
}
