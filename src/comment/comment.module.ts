import { Module } from "@nestjs/common";
import { CommentService } from "./comment.service";
import { CommentController } from "./comment.controller";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "src/auth/jwt.strategy";

@Module({
  imports: [JwtModule, PassportModule],
  controllers: [CommentController],
  providers: [CommentService, JwtStrategy],
})
export class CommentModule {}
