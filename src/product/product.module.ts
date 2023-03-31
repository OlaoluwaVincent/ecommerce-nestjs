import { Module } from "@nestjs/common";
import { ProductService } from "./product.service";
import { ProductController } from "./product.controller";
import { JwtModule } from "@nestjs/jwt";
import { JwtStrategy } from "src/auth/jwt.strategy";
import { PassportModule } from "@nestjs/passport";

@Module({
  imports: [JwtModule, PassportModule],
  controllers: [ProductController],
  providers: [ProductService, JwtStrategy],
})
export class ProductModule {}
