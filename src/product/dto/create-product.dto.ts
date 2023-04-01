import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsArray,
  ValidateNested,
  IsOptional,
  IsBoolean,
} from "class-validator";
import { Type } from "class-transformer";

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly price: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => String)
  readonly images: string[];

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  readonly quantity: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => String)
  readonly categories: string[];

  @IsOptional()
  @IsNumber()
  @IsPositive()
  readonly discount?: number;

  @IsOptional()
  @IsString()
  readonly details?: string;

  @IsOptional()
  @IsBoolean()
  readonly available?: boolean;
}
