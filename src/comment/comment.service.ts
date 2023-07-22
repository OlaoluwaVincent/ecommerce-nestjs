import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
  HttpStatus,
  NotFoundException,
} from "@nestjs/common";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { Request, Response } from "express";
import { PrismaService } from "prisma/prisma.service";

@Injectable()
export class CommentService {
  constructor(private DataBase: PrismaService) {}
  async create(
    createCommentDto: CreateCommentDto,
    req: Request,
    res: Response,
    productId: string,
  ) {
    const { userId } = req.user;
    this.InvalidTokenResponse(userId);

    // Find the product
    const product = await this.DataBase.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product ${productId} not found`);
    }

    // add the comment and relate it to the product
    const comment = await this.DataBase.comment.create({
      data: {
        comment: createCommentDto.comment,
        rating: createCommentDto.rating
          ? Number(createCommentDto.rating)
          : null,
        owner: {
          connect: { id: userId },
        },
        product: {
          connect: { id: productId },
        },
      },
    });

    if (!comment) {
      throw new BadRequestException(`Comment not created`);
    }

    res.status(HttpStatus.CREATED).json({ success: true, comment });
  }

  async findAll(res: Response, productId: string) {
    const product = await this.DataBase.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      throw new NotFoundException(`Product ${productId} not found`);
    }

    const comment = await this.DataBase.comment.findMany();

    res.status(HttpStatus.OK).json({ success: true, comment });
  }

  async remove(
    productId: string,
    commentId: string,
    req: Request,
    res: Response,
  ) {
    const { userId, role } = req.user;
    this.InvalidTokenResponse(userId);

    if (role !== "ADMIN") {
      throw new UnauthorizedException(
        `You are not allowed to remove this comment`,
      );
    }

    // find the comment
    const comment = await this.DataBase.comment.findUnique({
      where: { id: commentId },
    });
    if (!comment) {
      throw new NotFoundException(`comment ${commentId} not found`);
    }

    const deletedComment = await this.DataBase.comment.delete({
      where: { id: commentId },
    });

    if (!deletedComment) {
      throw new BadRequestException("Error deleting Comment");
    }
    res
      .status(HttpStatus.OK)
      .json({ success: true, message: "Comment deleted successfully" });
  }

  // ? Utilities
  // ? Validate the token
  InvalidTokenResponse(tokenId: string) {
    if (!tokenId) {
      throw new ForbiddenException("Unauthorized");
    }
  }
}
