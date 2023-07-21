import {
  Injectable,
  HttpStatus,
  ForbiddenException,
  BadRequestException,
} from "@nestjs/common";
import { UpdateUserDto } from "./dto/update-user.dto";
import { PrismaService } from "prisma/prisma.service";
import { Response, Request } from "express";
import { AuthService } from "src/auth/auth.service";

@Injectable()
export class UserService {
  constructor(
    private userDb: PrismaService,
    private authService: AuthService,
  ) {}

  // ? THIS IS USED TO GET A USER DETAIL
  async findOne(id: string, request: Request, res: Response) {
    // Todo: Sign the token
    const { userId } = request.user ? request.user : null;

    this.InvalidTokenResponse(userId);

    const user = await this.userDb.user.findUnique({ where: { id } });

    delete user.hashedPassword;
    delete user.createdAt;
    delete user.updatedAt;

    if (!user) {
      throw new BadRequestException("Bad Request, user does not exist");
    }

    res.status(HttpStatus.OK).json({ status: HttpStatus.OK, user });
  }

  // ? This is speicific for a user

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    request: Request,
    res: Response,
  ) {
    const { userId } = request.user;
    const { email, firstName, lastName, phoneNumber, state } = updateUserDto;

    this.InvalidTokenResponse(userId);

    const user = await this.userDb.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException("No user found");
    }

    const updatedUser = await this.userDb.user.update({
      where: { id },
      data: {
        email: email || user.email,
        firstName: firstName || user.firstName,
        lastName: lastName || user.lastName,
        state: state || user.state,
        phoneNumber: phoneNumber || user.phoneNumber,
      },
    });

    if (!updatedUser) {
      throw new BadRequestException({
        status: HttpStatus.NOT_MODIFIED,
        message: "Not Modified",
      });
    }

    delete user.hashedPassword;

    res
      .status(HttpStatus.CREATED)
      .json({ status: HttpStatus.CREATED, user: updatedUser });
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
