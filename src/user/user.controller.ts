import { Controller, Get, Post, Body, Res } from "@nestjs/common";
import { UserService } from "./user.service";
import { LoginDto, SignUpDto } from "./userDto";

@Controller("api/user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post("login")
  async login(@Body() dto: LoginDto, @Res() res) {
    return this.userService.login(dto, res);
  }

  @Post("create-user")
  async createUser(@Body() dto: SignUpDto, @Res() res) {
    return this.userService.createUser(dto, res);
  }
}
