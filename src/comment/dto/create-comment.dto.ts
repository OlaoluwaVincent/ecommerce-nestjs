import { IsString, IsNotEmpty, IsNumber } from "class-validator";

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  readonly comment: string;

  @IsNumber()
  @IsNotEmpty()
  readonly rating: number;
}
