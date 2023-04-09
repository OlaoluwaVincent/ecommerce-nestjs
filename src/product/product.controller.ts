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
import { v2 as cloudinary } from "cloudinary";
import { diskStorage } from "multer";
@Controller("product")
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createProductDto: CreateProductDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.productService.create(createProductDto, req, res);
  }

  // TODO: Upload file to cloudinary
  @Post("upload")
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FilesInterceptor("images", 4, {
      storage: diskStorage({
        destination: "./uploads",
      }),
    }),
  )
  async upload(
    @Req() req: Request,
    @UploadedFiles() images: Array<Express.Multer.File>,
    @Res() res: Response,
  ) {
    const { userId } = req.user;
    // Check if images array is defined
    if (images) {
      // Upload images to Cloudinary
      const uploadedImages = await Promise.all(
        images.map((file) =>
          cloudinary.uploader.upload(file.path, {
            folder: userId,
          }),
        ),
      );
      const secureUrls = uploadedImages.map((image) => image.secure_url);
      // Return the secure URLs in the response
      res.json({ secureUrls });
    } else {
      // Return error response
      res.status(400).json({ error: "No images were provided." });
    }
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
  async update(
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

  // Utils
  async uploadImages(files: Array<Express.Multer.File>, folder: string) {
    const uploadedImages = await Promise.all(
      files.map((file) =>
        cloudinary.uploader.upload(file.path, {
          folder,
        }),
      ),
    );

    return uploadedImages.map((image) => image.secure_url);
  }
}
