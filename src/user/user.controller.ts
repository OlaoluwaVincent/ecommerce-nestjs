import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
} from "@nestjs/common";
import { UserService } from "./user.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { Request, Response } from "express";

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Req() request: Request, @Res() res: Response) {
    const token: string = request.cookies.token;
    return this.userService.findAll(token, res);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id")
  findOne(
    @Param("id") id: string,
    @Req() request: Request,
    @Res() res: Response,
  ) {
    const token: string = request.cookies.token;
    return this.userService.findOne(id, token, res);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() request: Request,
    @Res() res: Response,
  ) {
    const token: string = request.cookies.token;
    return this.userService.update(id, updateUserDto, token, res);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(":id")
  remove(
    @Param("id") id: string,
    @Req() request: Request,
    @Res() res: Response,
  ) {
    const token: string = request.cookies.token;
    return this.userService.remove(id, token, res);
  }
}
