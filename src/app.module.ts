import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { PrismaModule } from "../prisma/prisma.module";
import { UserModule } from "./user/user.module";
import { ProductModule } from "./product/product.module";
import { v2 as cloudinary } from "cloudinary";
import { CLOUD_NAME, API_KEY, API_SECRET } from "./constants";
import { CommentModule } from "./comment/comment.module";
import { AppController } from "./app.controller";
@Module({
  imports: [AuthModule, PrismaModule, UserModule, ProductModule, CommentModule],
  controllers: [AppController],
})
export class AppModule {
  constructor() {
    cloudinary.config({
      cloud_name: CLOUD_NAME,
      api_key: API_KEY,
      api_secret: API_SECRET,
    });
  }
}
