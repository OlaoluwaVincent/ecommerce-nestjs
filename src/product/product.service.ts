import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  BadRequestException,
  HttpStatus,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "prisma/prisma.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Request, Response } from "express";
import { v2 as cloudinary } from "cloudinary";
import { ProductPhoto } from "@prisma/client";

@Injectable()
export class ProductService {
  constructor(private Database: PrismaService) {}

  // ? Create a product
  async create(
    createProductDto: CreateProductDto,
    req: Request,
    res: Response,
    images: Array<Express.Multer.File>,
  ) {
    const user = req.user;
    this.InvalidTokenResponse(user.userId);
    if (user.role !== "SELLER") {
      throw new ForbiddenException(
        "Forbidden, only Sellers can upload a product",
      );
    }

    const photoUrls = await this.uploadImagesToCloud(user.userId, images);
    if (!photoUrls) {
      throw new BadRequestException("Please Provide Images");
    }

    const createdProduct = await this.Database.product.create({
      data: {
        ...createProductDto,
        categories: createProductDto.categories
          ? createProductDto.categories
          : [],
        price: Number(createProductDto.price),
        quantity: Number(createProductDto.quantity),
        minOrderQuantity: Number(createProductDto.minOrderQuantity),
        discount: createProductDto.discount
          ? Number(createProductDto.discount)
          : 0,
        owner: {
          connect: { id: user.userId },
        },
      },
    });
    if (!createdProduct) {
      throw new BadRequestException("Something went wrong, try again later");
    }

    const createdPhoto = await this.Database.productPhoto.create({
      data: {
        url: photoUrls,
        owner: {
          connect: { id: createdProduct.id },
        },
      },
    });

    res.status(HttpStatus.CREATED).json({
      successful: true,
      product: {
        product: { ...createdProduct, productImages: createdPhoto.url },
      },
    });
  }

  // ? Find All products
  async findAll(res: Response) {
    const products = await this.Database.product.findMany();
    res
      .status(HttpStatus.OK)
      .json({ status: HttpStatus.OK, length: products.length, products });
  }

  // ? Find One product
  async findOne(id: string, req: Request, res: Response) {
    const product = await this.Database.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException("Product does not exists");
    }
    const productImages = await this.Database.productPhoto.findUnique({
      where: { productId: product.id },
    });
    res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      product: { ...product, productImages: productImages.url },
    });
  }

  // ? Update Product
  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    req: Request,
    res: Response,
    images: Array<Express.Multer.File>,
  ) {
    const { userId } = req.user;
    this.InvalidTokenResponse(userId);

    const product = await this.Database.product.findUnique({
      where: { id },
      select: { ownerId: true },
    });
    if (!product) {
      throw new NotFoundException("This resource does not exist");
    }

    if (product.ownerId !== userId) {
      throw new UnauthorizedException("You do not own this resource");
    }

    const updatedProduct = await this.Database.product.update({
      where: { id },
      data: {
        ...updateProductDto,
        price: updateProductDto.price ? Number(updateProductDto.price) : null,
        quantity: updateProductDto.quantity
          ? Number(updateProductDto.quantity)
          : null,
        minOrderQuantity: updateProductDto.minOrderQuantity
          ? Number(updateProductDto.minOrderQuantity)
          : null,
        discount: updateProductDto.discount
          ? Number(updateProductDto.discount)
          : 0,
        owner: {
          connect: { id: userId },
        },
      },
    });
    if (!updatedProduct) {
      throw new BadRequestException("Something went wrong, try again later");
    }

    let createdPhoto: ProductPhoto;
    if (images) {
      const photoUrls = await this.uploadImagesToCloud(userId, images);
      if (!photoUrls) {
        throw new BadRequestException("Please Provide Images");
      }

      createdPhoto = await this.Database.productPhoto.create({
        data: {
          url: photoUrls,
          owner: {
            connect: { id: updatedProduct.id },
          },
        },
      });
    } else {
      createdPhoto = await this.Database.productPhoto.findUnique({
        where: { productId: id },
      });
    }

    res.status(HttpStatus.OK).json({
      success: true,
      updatedProduct: {
        ...updatedProduct,
        productImages: createdPhoto.url,
      },
    });
  }

  // ? Remove Product
  async remove(id: string, req: Request, res: Response) {
    const { userId } = req.user;
    this.InvalidTokenResponse(userId);

    const product = await this.Database.product.findUnique({
      where: { id },
      select: { ownerId: true },
    });
    if (!product) {
      throw new NotFoundException("This resource does not exist");
    }

    if (product.ownerId !== userId) {
      throw new UnauthorizedException("You do not own this resource");
    }
    const deletedProduct = await this.Database.product.delete({
      where: { id },
    });
    if (!deletedProduct) {
      throw new BadRequestException("Something went wrong, try again later");
    }
    res.status(HttpStatus.OK).json({
      status: HttpStatus.OK,
      message: "Resource deleted successfully",
    });
  }

  async uploadImagesToCloud(
    userId: string,
    images: Array<Express.Multer.File>,
  ) {
    if (images) {
      // Upload images to Cloudinary
      console.log(images);
      const uploadedImages = await Promise.all(
        images.map((file) =>
          cloudinary.uploader.upload(file.path, {
            folder: userId,
          }),
        ),
      );
      const secureUrls = uploadedImages.map((image) => image.secure_url);
      // Return the secure URLs in the response
      return secureUrls;
    } else {
      return null;
    }
  }
  // ? Utilities
  // ? Validate the token
  InvalidTokenResponse(tokenId: string) {
    if (!tokenId) {
      throw new ForbiddenException("Unauthorized");
    }
  }
}
