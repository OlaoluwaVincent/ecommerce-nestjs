import { Injectable } from "@nestjs/common";
import { CreateCommentDto } from "./dto/create-comment.dto";

@Injectable()
export class CommentService {
  create(createCommentDto: CreateCommentDto) {
    return "This action adds a new comment";
  }

  findAll() {
    return `This action returns all comment`;
  }

  remove(id: number) {
    return `This action removes a #${id} comment`;
  }
}
