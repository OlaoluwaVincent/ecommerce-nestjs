import {
  Injectable,
  HttpStatus,
  BadRequestException,
  ForbiddenException,
} from "@nestjs/common";
import { Response } from "express";
import { LoginDto, SignUpDto } from "./authDto";
import { PrismaService } from "prisma/prisma.service";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { jwtSecret } from "src/constants";

@Injectable()
export class AuthService {
  constructor(private userDB: PrismaService, private jwt: JwtService) {}

  // ? CREATE NEW USER //
  async createUser(dto: SignUpDto, res: Response) {
    const { email, password, firstName, lastName, phoneNumber, state, role } =
      dto;

    const foundUser = await this.userDB.user.findUnique({
      where: { email },
    });
    if (foundUser) {
      throw new BadRequestException(`${email} already exist please login`);
    }

    const hashedPassword = await this.hashPassword(password);

    const newUser = await this.userDB.user.create({
      data: {
        hashedPassword,
        email: email.toLowerCase(),
        firstName,
        lastName,
        phoneNumber,
        state,
        role: role == "seller" ? "SELLER" : "BUYER",
      },
    });

    if (!newUser) {
      throw new BadRequestException("Something went wrong");
    }
    // todo: assign token to user
    const token = await this.signToken({
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
    });
    // todo: check availability of token
    if (!token) {
      throw new ForbiddenException("Unauthorized");
    }
    // todo: Add token to cookie
    res.cookie("token", token, { httpOnly: true });
    delete newUser.hashedPassword;

    res
      .status(HttpStatus.CREATED)
      .json({ status: HttpStatus.CREATED, token, user: newUser });
  }

  // ? LOGIN A USER //
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
    // todo: assign token to user
    const token = await this.signToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });
    // todo: check availability of token
    if (!token) {
      throw new ForbiddenException("Unauthorized");
    }
    // todo: Add token to cookie
    res.cookie("token", token, { httpOnly: true });

    delete user.hashedPassword;

    res.status(HttpStatus.OK).json({ status: HttpStatus.OK, token, user });
  }

  // ? LOGOUT //
  logout(res: Response) {
    res.clearCookie("token");
    return res.status(HttpStatus.OK).json({ message: "Logout Successfully" });
  }

  // ? HELPERS //
  async hashPassword(password: string) {
    const salt = 10;
    return await bcrypt.hash(password, salt);
  }

  async comparePassword(password: string, hashedPassword: string) {
    return await bcrypt.compare(password, hashedPassword);
  }

  async signToken(args: { id: string; email: string; role: string }) {
    const payload = args;
    return this.jwt.signAsync(payload, { secret: jwtSecret });
  }
}
