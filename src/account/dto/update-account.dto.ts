import { PartialType } from "@nestjs/mapped-types";
import { CreateAccountDto } from "./create-account.dto";
import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class UpdateAccountDto extends PartialType(CreateAccountDto) {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  accountName?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  accountNumber?: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  bankName?: string;
}
