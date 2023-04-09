import { Type } from "class-transformer";
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  ValidateNested,
  IsDefined,
} from "class-validator";
import { Express } from "express";

export class FileUploadDto {
  @IsDefined()
  @Type(() => String)
  filename: string;

  @IsDefined()
  @Type(() => String)
  mimetype: string;

  @IsDefined()
  @Type(() => Buffer)
  buffer: Buffer;
}

export type Category =
  | "Electronics"
  | "Fashion"
  | "Homes"
  | "Beauty"
  | "Sports"
  | "Health"
  | "Games"
  | "Food"
  | "Office"
  | "Others";

export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  @IsNumber()
  readonly price: number;

  @IsNotEmpty()
  @IsNumber()
  readonly quantity: number;

  @IsArray()
  images: string[];

  @IsArray()
  @Type(() => String)
  readonly categories: Category[];

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
