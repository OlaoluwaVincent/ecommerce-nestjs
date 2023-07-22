import { Module } from "@nestjs/common";
import { AccountService } from "./account.service";
import { AccountController } from "./account.controller";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";

@Module({
  imports: [JwtModule, PassportModule],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
