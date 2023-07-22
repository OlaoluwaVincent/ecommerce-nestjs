import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateAccountDto } from "./dto/create-account.dto";
import { UpdateAccountDto } from "./dto/update-account.dto";
import { PrismaService } from "prisma/prisma.service";
import { Request, Response } from "express";

@Injectable()
export class AccountService {
  constructor(private db: PrismaService) {}

  async create(
    createAccountDto: CreateAccountDto,
    req: Request,
    res: Response,
  ) {
    const { userId } = req.user;
    this.InvalidTokenResponse(userId);

    try {
      const createdAccount = await this.db.account.create({
        data: {
          ...createAccountDto,
          owner: {
            connect: { id: userId },
          },
        },
      });

      await this.db.user.update({
        where: { id: userId },
        data: {
          onBoardStatus: "COMPLETED",
        },
      });

      res
        .status(HttpStatus.CREATED)
        .json({ successful: true, accountDetails: createdAccount });
    } catch (error) {
      // Handle specific database-related errors (e.g., unique constraint violation) here.
      // You can also check for error codes or specific error properties.
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ successful: false, message: error.message });
    }
  }

  async findOne(id: string, req: Request, res: Response) {
    const { userId } = req.user;
    this.InvalidTokenResponse(userId);

    try {
      const account = await this.db.account.findUnique({ where: { id } });

      if (!account) {
        throw new NotFoundException("Account details not found");
      }

      res
        .status(HttpStatus.OK)
        .json({ successful: true, accountDetails: account });
    } catch (error) {
      // Handle specific database-related errors (e.g., unique constraint violation) here.
      // You can also check for error codes or specific error properties.
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ successful: false, message: error.message });
    }
  }

  async getUserAccount(userId: string, req: Request, res: Response) {
    const { userId: loggedInUser } = req.user;
    this.InvalidTokenResponse(loggedInUser);

    try {
      const userAccount = await this.db.account.findUnique({
        where: { ownerId: userId },
      });

      if (!userAccount) {
        throw new NotFoundException("This user has no set up account");
      }

      res
        .status(HttpStatus.OK)
        .json({ successful: true, accountDetails: userAccount });
    } catch (error) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ successful: false, message: error.message });
    }
  }

  async update(
    id: string,
    updateAccountDto: UpdateAccountDto,
    req: Request,
    res: Response,
  ) {
    const { userId } = req.user;
    this.InvalidTokenResponse(userId);

    try {
      const accountToUpdate = await this.db.account.findUnique({
        where: { id },
      });
      if (!accountToUpdate) {
        throw new NotFoundException("Account not found");
      }

      const updatedAccount = await this.db.account.update({
        where: { id: accountToUpdate.id },
        data: {
          ...updateAccountDto,
        },
      });

      if (!updatedAccount) {
        throw new NotFoundException("Account not found");
      }

      res
        .status(HttpStatus.CREATED)
        .json({ successful: true, accountDetails: updatedAccount });
    } catch (error) {
      // Handle specific database-related errors (e.g., unique constraint violation) here.
      // You can also check for error codes or specific error properties.
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ successful: false, message: error.message });
    }
  }

  async remove(id: string, req: Request, res: Response) {
    const { userId } = req.user;
    this.InvalidTokenResponse(userId);
    try {
      const deletedAccount = await this.db.account.delete({ where: { id } });
      if (!deletedAccount) {
        throw new NotFoundException("Account not found nor deleted");
      }
      return res.status(HttpStatus.OK).json({
        successful: true,
        message: "Account details deleted Successfully",
      });
    } catch (error) {
      res
        .status(HttpStatus.BAD_REQUEST)
        .json({ successful: true, message: error.message });
    }
  }

  // ? HELPER FUNCTIONS
  InvalidTokenResponse(tokenId: string) {
    if (!tokenId) {
      throw new ForbiddenException("Unauthorized");
    }
  }
}
