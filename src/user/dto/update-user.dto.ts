import {
  IsNotEmpty,
  IsEmail,
  IsString,
  Length,
  IsOptional,
} from "class-validator";
export class UpdateUserDto {
  @IsEmail()
  public email?: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  @Length(6, 20, { message: "Password must be between 6 and 20 characters" })
  public password?: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  public userName?: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  public firstName?: string;

  @IsNotEmpty()
  @IsString()
  @IsOptional()
  public lastName?: string;

  // @IsNotEmpty()
  // @IsString()
  // public token?: string;
}
