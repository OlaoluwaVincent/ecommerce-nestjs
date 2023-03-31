import { IsNotEmpty, IsEmail, IsString, Length } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 20, { message: "Password must be between 6 and 20 characters" })
  public password: string;

  @IsNotEmpty()
  @IsString()
  public userName: string;

  @IsNotEmpty()
  @IsString()
  public firstName: string;

  @IsNotEmpty()
  @IsString()
  public lastName: string;
}
