import { Type } from "class-transformer";
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
} from "class-validator";

export interface ImageSides {
  front: string | null;
  back: string | null;
  left_side: string | null;
  right_side: string | null;
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

  @IsNotEmpty()
  readonly images: ImageSides;

  @IsArray()
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
