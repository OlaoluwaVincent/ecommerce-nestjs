import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  readonly comment: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly rating: string;
}
