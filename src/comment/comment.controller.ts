import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
} from "@nestjs/common";
import { CommentService } from "./comment.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { Request, Response } from "express";

@Controller("product/:productId/comment")
export class CommentController {
  constructor(private readonly commentService: CommentService) {}
  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createCommentDto: CreateCommentDto,
    @Param("productId") productId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.commentService.create(createCommentDto, req, res, productId);
  }

  @Get()
  findAll(
    @Param("productId") productId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.commentService.findAll(res, productId);
  }

  @Delete(":commentId")
  @UseGuards(JwtAuthGuard)
  remove(
    @Param("productId") productId: string,
    @Param("commentId") commentId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.commentService.remove(productId, commentId, req, res);
  }
}
