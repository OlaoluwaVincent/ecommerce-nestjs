/* eslint-disable prettier/prettier */
import { Length, IsNotEmpty, IsEmail, IsString } from "class-validator";

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  public email: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 20, { message: "Password must be between 6 and 20 characters" })
  public password: string;
}
export class SignUpDto {
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

  @IsNotEmpty()
  @IsString()
  public state: string;

  @IsNotEmpty()
  @IsString()
  public phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  public role: string;
}
