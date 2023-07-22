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

@Injectable()
export class ProductService {
  constructor(private productDb: PrismaService) {}

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
      throw new ForbiddenException("Only sellers can upload a product");
    }

    try {
      const photoUrls = await this.uploadImagesToCloud(user.userId, images);
      if (!photoUrls || photoUrls.length === 0) {
        throw new BadRequestException("Please provide at least one image");
      }

      const createdProduct = await this.productDb.product.create({
        data: {
          ...createProductDto,
          categories: createProductDto.categories || [],
          price: Number(createProductDto.price),
          quantity: Number(createProductDto.quantity),
          minOrderQuantity: Number(createProductDto.minOrderQuantity),
          discount: Number(createProductDto.discount || 0),
          owner: {
            connect: { id: user.userId },
          },
        },
      });

      const createdPhoto = await this.productDb.productPhoto.create({
        data: {
          url: photoUrls,
          owner: {
            connect: { id: createdProduct.id },
          },
        },
      });

      await this.productDb.user.update({
        where: { id: user.userId },
        data: {
          onBoardStatus: "ACCOUNTS",
        },
      });

      res.status(HttpStatus.CREATED).json({
        successful: true,
        product: { ...createdProduct, productImages: createdPhoto.url },
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ successful: false, error: error.message });
    }
  }

  // ? Find All products
  async findAll(res: Response) {
    try {
      const products = await this.productDb.product.findMany();

      res
        .status(HttpStatus.OK)
        .json({ successful: true, length: products.length, products });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ successful: false, error: error.message });
    }
  }

  // ? Find all Product belonging to a user
  async findUserProducts(userId: string, res: Response) {
    try {
      const products = await this.productDb.product.findMany({
        where: { ownerId: userId },
        select: { id: true },
      });

      if (!products) {
        throw new NotFoundException("User has no product");
      }

      res
        .status(HttpStatus.OK)
        .json({ successful: true, length: products.length, products });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ successful: false, error: error.message });
    }
  }

  // ? Find One product
  async findOne(id: string, res: Response) {
    try {
      const productDb = this.productDb;

      const product = await productDb.product.findUnique({ where: { id } });
      if (!product) {
        throw new NotFoundException("Product does not exist");
      }

      const productImages = await productDb.productPhoto.findUnique({
        where: { productId: product.id },
      });

      const sanitizedProduct = { ...product, productImages: productImages.url };

      res
        .status(HttpStatus.OK)
        .json({ status: HttpStatus.OK, product: sanitizedProduct });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ successful: false, error: error.message });
    }
  }

  // ? Update Product
  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    req: Request,
    res: Response,
    images: Array<Express.Multer.File>,
  ) {
    try {
      const { userId } = req.user;
      this.InvalidTokenResponse(userId);

      const productDb = this.productDb;
      const product = await productDb.product.findUnique({
        where: { id },
      });

      if (!product) {
        throw new NotFoundException("This resource does not exist");
      }

      if (product.ownerId !== userId) {
        throw new UnauthorizedException("You do not own this resource");
      }

      const updatedProduct = await productDb.product.update({
        where: { id },
        data: {
          ...updateProductDto,
          price: updateProductDto.price
            ? Number(updateProductDto.price)
            : product.price,
          quantity: updateProductDto.quantity
            ? Number(updateProductDto.quantity)
            : product.quantity,
          minOrderQuantity: updateProductDto.minOrderQuantity
            ? Number(updateProductDto.minOrderQuantity)
            : product.minOrderQuantity,
          discount: updateProductDto.discount
            ? Number(updateProductDto.discount)
            : product.discount,
        },
      });

      if (!updatedProduct) {
        throw new BadRequestException("Product was not updated");
      }

      if (images && images.length > 0) {
        const photoUrls = await this.uploadImagesToCloud(userId, images);
        if (photoUrls || photoUrls.length >= 1) {
          await productDb.productPhoto.update({
            where: { productId: updatedProduct.id },
            data: {
              url: photoUrls,
              owner: {
                connect: { id: updatedProduct.id },
              },
            },
          });
        }
      }

      res.status(HttpStatus.OK).json({
        success: true,
        message: "Product Updated successfully",
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ successful: false, error: error.message });
    }
  }

  // ? Remove Product
  async remove(id: string, req: Request, res: Response) {
    try {
      const { userId, role } = req.user;
      this.InvalidTokenResponse(userId);

      const productDb = this.productDb;
      const product = await productDb.product.findUnique({
        where: { id },
        select: { ownerId: true },
      });

      if (!product) {
        throw new NotFoundException("This resource does not exist");
      }

      if (product.ownerId !== userId || role !== "ADMIN") {
        throw new UnauthorizedException("You do not own this resource");
      }

      const deletedProduct = await productDb.product.delete({
        where: { id },
      });

      if (!deletedProduct) {
        throw new BadRequestException("Product was not deleted");
      }

      res.status(HttpStatus.OK).json({
        status: HttpStatus.OK,
        message: "Product deleted successfully",
      });
    } catch (error) {
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ successful: false, error: error.message });
    }
  }

  async uploadImagesToCloud(
    userId: string,
    images: Array<Express.Multer.File>,
  ) {
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
