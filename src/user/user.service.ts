import {
  Injectable,
  HttpStatus,
  ForbiddenException,
  NotFoundException,
  NotImplementedException,
  UnauthorizedException,
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
    const userId = request.user?.userId;

    this.InvalidTokenResponse(userId);

    try {
      const user = await this.userDb.user.findUnique({ where: { id } });

      if (!user) {
        throw new NotFoundException("User not found");
      }

      const sanitizedUser = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        phoneNumber: user.phoneNumber,
        onBoardStatus: user.onBoardStatus,
        role: user.role,
        state: user.state,
        // Add any other necessary fields here
      };

      res.status(HttpStatus.OK).json({ successful: true, user: sanitizedUser });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ successful: false, error: error.message });
    }
  }

  async getAllBuyers(request: Request, res: Response) {
    const userId = request.user?.userId;
    this.InvalidTokenResponse(userId);

    try {
      const buyers = await this.userDb.user.findMany({
        where: { role: "BUYER" },
        select: { id: true },
      });

      res.status(HttpStatus.OK).json({ successful: true, buyers });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ successful: false, error: error.message });
    }
  }

  async getAllSellers(request: Request, res: Response) {
    const userId = request.user?.userId;
    this.InvalidTokenResponse(userId);

    try {
      const sellers = await this.userDb.user.findMany({
        where: { role: "SELLER" },
        select: { id: true },
      });

      res.status(HttpStatus.OK).json({ successful: true, sellers });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ successful: false, error: error.message });
    }
  }

  // ? Update a user
  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    request: Request,
    res: Response,
  ) {
    const { userId } = request.user;
    try {
      const user = await this.userDb.user.findUnique({ where: { id: userId } });

      if (!user) {
        throw new NotFoundException("User not found");
      }

      const updatedUser = await this.userDb.user.update({
        where: { id },
        data: {
          email: updateUserDto.email || user.email,
          firstName: updateUserDto.firstName || user.firstName,
          lastName: updateUserDto.lastName || user.lastName,
          state: updateUserDto.state || user.state,
          phoneNumber: updateUserDto.phoneNumber || user.phoneNumber,
        },
      });

      if (!updatedUser) {
        throw new NotImplementedException("No changes were made to the user");
      }

      const sanitizedUser = { ...updatedUser };
      delete sanitizedUser.hashedPassword;

      res
        .status(HttpStatus.OK)
        .json({ status: HttpStatus.OK, user: sanitizedUser });
    } catch (error) {}
  }

  // ? This is to delete a user account
  async remove(id: string, request: Request, res: Response) {
    const { userId } = request.user;

    this.InvalidTokenResponse(userId);

    try {
      if (id !== userId) {
        throw new UnauthorizedException(
          "You do not have permission to delete this account",
        );
      }

      const deletedUser = await this.userDb.user.delete({
        where: { id: userId },
      });

      if (!deletedUser) {
        throw new NotFoundException("Failed to delete user, user not found");
      }

      // Logout the user after successful deletion
      this.authService.logout(res);

      // Respond with a success message if needed
      res
        .status(HttpStatus.OK)
        .json({ status: HttpStatus.OK, message: "User deleted successfully" });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ successful: false, error: error.message });
    }
  }

  // ? HELPER FUNCTIONS
  InvalidTokenResponse(tokenId: string) {
    if (!tokenId) {
      throw new ForbiddenException("Unauthorized");
    }
  }
}
