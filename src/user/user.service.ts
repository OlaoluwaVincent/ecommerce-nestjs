import {
  Injectable,
  UnauthorizedException,
  HttpStatus,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import { UpdateUserDto } from "./dto/update-user.dto";
import { PrismaService } from "prisma/prisma.service";
import { Response, Request } from "express";
import { User } from "@prisma/client";
import { AuthService } from "src/auth/auth.service";

@Injectable()
export class UserService {
  constructor(
    private userDb: PrismaService,
    private authService: AuthService,
  ) {}

  // ? THIS IS ONLY FOR ADMINS TO GET ALL USERS.

  async findAll(request: Request, res: Response) {
    // Todo: Sign the token
    const { userId: id } = request.user;

    this.InvalidTokenResponse(id);

    /** // Todo: Check for the user role
     * ? If role is admin, return all users
     */

    const user = await this.userDb.user.findUnique({
      where: { id },
    });

    if (user && user.role === "ADMIN") {
      const users = await this.userDb.user.findMany({
        select: {
          hashedPassword: false,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
          userName: true,
          product: true,
        },
      });

      res
        .status(HttpStatus.OK)
        .json({ successful: true, length: users.length, users });
    } else {
      throw new UnauthorizedException("Not an Admin");
    }
  }

  // ? THIS IS USED TO GET A USER DETAIL

  async findOne(id: string, request: Request, res: Response) {
    // Todo: Sign the token
    const { userId } = request.user ? request.user : null;

    this.InvalidTokenResponse(userId);

    // Todo: Validate the token to see if it is a valid user.
    const validUser = await this.userDb.user.findUnique({
      where: { id: userId },
    });

    if (!validUser) {
      throw new ForbiddenException("Unauthorized");
    }

    // ? If it is the logged in user return all details else return some details
    let user: User;
    // if (validUser.id !== id) {
    //   throw
    // }

    if (validUser.id === id) {
      user = await this.userDb.user.findUnique({ where: { id } });
      delete user.hashedPassword;
    } else {
      // ? GET the requested user
      user = await this.userDb.user.findUnique({
        where: { id },
      });
      if (!user) {
        throw new BadRequestException("Invalid Request");
      }
      delete user.hashedPassword;
      delete user.createdAt;
      delete user.updatedAt;
      delete user.role;
      delete user.hashedPassword;
    }

    if (!user) {
      throw new BadRequestException("Bad Request, user does not exist");
    }

    res.status(HttpStatus.OK).json({ successful: true, user });
  }

  // ? This is speicific for a user

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    request: Request,
    res: Response,
  ) {
    const { userId } = request.user;
    const { email, firstName, lastName, password, userName } = updateUserDto;

    this.InvalidTokenResponse(userId);

    const user = await this.userDb.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException("No user found");
    }

    // Todo: Update password, match existing passwords, sign new password and save to db

    const updatedUser = await this.userDb.user.update({
      where: { id },
      data: {
        email: email || user.email,
        firstName: firstName || user.firstName,
        lastName: lastName || user.lastName,
        userName: userName || user.userName,
      },
    });
    if (!updatedUser) {
      throw new BadRequestException("Update unsuccessful");
    }
    res.status(HttpStatus.CREATED).json({ successful: true, updatedUser });
  }

  // ? This is to delete a user account

  async remove(id: string, request: Request, res: Response) {
    const { userId } = request.user;
    this.InvalidTokenResponse(userId);
    if (id !== userId) {
      throw new BadRequestException(
        "Cannot be completed, you do not own this account",
      );
    }

    const deletedUser = await this.userDb.user.delete({
      where: { id: userId },
    });
    if (!deletedUser) {
      throw new BadRequestException("Failed to Delete user, try again later");
    }
    this.authService.logout(res);
  }

  // ? HELPER FUNCTIONS
  InvalidTokenResponse(tokenId: string) {
    if (!tokenId) {
      throw new ForbiddenException("Unauthorized");
    }
  }
}
