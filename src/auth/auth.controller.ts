import { Controller, Get, Post, Body, Res } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginDto, SignUpDto } from "./authDto";

@Controller("auth")
export class AuthController {
  constructor(private readonly userService: AuthService) {}

  @Post("login")
  async login(@Body() dto: LoginDto, @Res() res) {
    return this.userService.login(dto, res);
  }

  @Post("create-user")
  async createUser(@Body() dto: SignUpDto, @Res() res) {
    return this.userService.createUser(dto, res);
  }

  @Get("sign-out")
  signOut(@Res() res) {
    return this.userService.logout(res);
  }
  @Post("create-user/retail")
  async retailCreateUser(@Body() dto: SignUpDto, @Res() res) {
    return this.userService.retailCreateUser(dto, res);
  }
}
