import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { Request, Response } from "express";

@Controller("product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body() createProductDto: CreateProductDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.productService.create(createProductDto, req, res);
  }

  // ? Open to the public
  @Get()
  findAll(@Res() res: Response) {
    return this.productService.findAll(res);
  }

  // ? Open to the public
  @Get(":id")
  findOne(@Param("id") id: string, @Req() req: Request, @Res() res: Response) {
    return this.productService.findOne(id, req, res);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  update(
    @Param("id") id: string,
    @Body() updateProductDto: UpdateProductDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.productService.update(id, updateProductDto, req, res);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  remove(@Param("id") id: string, @Req() req: Request, @Res() res: Response) {
    return this.productService.remove(id, req, res);
  }
}
