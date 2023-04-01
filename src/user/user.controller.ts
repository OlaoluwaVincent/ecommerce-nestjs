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

@UseGuards(JwtAuthGuard)
@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async findAll(@Req() request: Request, @Res() res: Response) {
    return this.userService.findAll(request, res);
  }

  @Get(":id")
  findOne(
    @Param("id") id: string,
    @Req() request: Request,
    @Res() res: Response,
  ) {
    return this.userService.findOne(id, request, res);
  }

  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() request: Request,
    @Res() res: Response,
  ) {
    return this.userService.update(id, updateUserDto, request, res);
  }

  @Delete(":id")
  remove(
    @Param("id") id: string,
    @Req() request: Request,
    @Res() res: Response,
  ) {
    return this.userService.remove(id, request, res);
  }
}
