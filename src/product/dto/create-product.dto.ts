import { Type } from "class-transformer";
import {
  IsNotEmpty,
  IsPositive,
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  IsDefined,
} from "class-validator";

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
  readonly productName: string;

  @IsNotEmpty()
  @IsString()
  readonly price: string;

  @IsNotEmpty()
  @IsString()
  readonly quantity: string;

  @IsNotEmpty()
  @IsString()
  readonly minOrderQuantity: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsArray()
  @Type(() => String)
  @IsOptional()
  readonly categories?: Category[];

  @IsOptional()
  @IsString()
  @IsPositive()
  readonly discount?: string;

  @IsOptional()
  @IsBoolean()
  readonly available?: boolean;
}
