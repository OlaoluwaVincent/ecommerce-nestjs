import {
  Injectable,
  HttpStatus,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";
import { Response } from "express";
import { LoginDto, SignUpDto } from "./authDto";
import { PrismaService } from "prisma/prisma.service";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
  constructor(private userDB: PrismaService) {}

  async login(dto: LoginDto, res: Response) {
    const { email, password } = dto;

    //? Check for the user
    const user = await this.userDB.user.findUnique({ where: { email } });
    if (!user) {
      throw new BadRequestException("Wrong email or password");
    }

    const hashedPassword = await this.comparePassword(
      password,
      user.hashedPassword,
    );

    // ? Check for the hashedPassword
    if (!hashedPassword) {
      throw new ForbiddenException("Wrong email or password");
    }

    delete user.hashedPassword;

    res.status(HttpStatus.OK).json({ user });
  }

  async createUser(dto: SignUpDto, res: Response) {
    const { password, email, userName, firstName, lastName } = dto;

    const foundUser = await this.userDB.user.findUnique({
      where: { email },
    });
    if (foundUser) {
      console.log("yes");
      throw new BadRequestException(`${email} already exist please login`);
    }

    const hashedPassword = await this.hashPassword(password);

    const newUser = await this.userDB.user.create({
      data: {
        hashedPassword,
        email: email.toLowerCase(),
        userName,
        firstName,
        lastName,
      },
    });

    if (!newUser) {
      throw new BadRequestException("Something went wrong");
    }

    res.status(HttpStatus.CREATED).json(newUser);
  }

  async hashPassword(password: string) {
    const salt = 10;
    return await bcrypt.hash(password, salt);
  }

  async comparePassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }
}
