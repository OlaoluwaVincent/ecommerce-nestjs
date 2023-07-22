import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  UseGuards,
  Req,
} from "@nestjs/common";
import { AccountService } from "./account.service";
import { CreateAccountDto } from "./dto/create-account.dto";
import { UpdateAccountDto } from "./dto/update-account.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { Request, Response } from "express";

@UseGuards(JwtAuthGuard)
@Controller("account")
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  create(
    @Body() createAccountDto: CreateAccountDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const response = this.accountService.create(createAccountDto, req, res);
    return response;
  }

  @Get("userAccount/:userId")
  findUserAccount(
    @Param("userId") userId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.accountService.getUserAccount(userId, req, res);
  }

  @Get(":id")
  findOne(@Param("id") id: string, @Req() req: Request, @Res() res: Response) {
    return this.accountService.findOne(id, req, res);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateAccountDto: UpdateAccountDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.accountService.update(id, updateAccountDto, req, res);
  }

  @Delete(":id")
  remove(@Param("id") id: string, @Req() req: Request, @Res() res: Response) {
    return this.accountService.remove(id, req, res);
  }
}
