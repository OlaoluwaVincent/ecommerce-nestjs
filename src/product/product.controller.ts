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
  UseInterceptors,
  UploadedFiles,
} from "@nestjs/common";
import { ProductService } from "./product.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";
import { Request, Response } from "express";
import { FilesInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { join } from "path";
import { tmpdir } from "os";

const storage = diskStorage({
  destination: join(tmpdir(), "uploads"),
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}-${file.originalname}`);
  },
});
@Controller("product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor("images", 4, {
      storage,
    }),
  )
  async create(
    @Body() createProductDto: CreateProductDto,
    @UploadedFiles() images: Array<Express.Multer.File>,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.productService.create(createProductDto, req, res, images);
  }

  // ? Open to the public
  @Get()
  findAll(@Res() res: Response) {
    return this.productService.findAll(res);
  }

  // ? Open to the public
  @Get(":id")
  findOne(@Param("id") id: string, @Res() res: Response) {
    return this.productService.findOne(id, res);
  }

  // ? Open to the public
  @Get("user/:userId")
  findAllUserProducts(@Param("userId") userId: string, @Res() res: Response) {
    return this.productService.findUserProducts(userId, res);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor("images", 4, {
      storage,
    }),
  )
  async update(
    @Param("id") id: string,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFiles() images: Array<Express.Multer.File>,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.productService.update(id, updateProductDto, req, res, images);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard)
  remove(@Param("id") id: string, @Req() req: Request, @Res() res: Response) {
    return this.productService.remove(id, req, res);
  }
}
