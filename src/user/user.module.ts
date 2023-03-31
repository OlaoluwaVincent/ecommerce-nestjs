import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserController } from "./user.controller";
import { JwtStrategy } from "src/auth/jwt.strategy";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [JwtModule, PassportModule, AuthModule],
  controllers: [UserController],
  providers: [UserService, JwtStrategy],
})
export class UserModule {}
