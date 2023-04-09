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
@Injectable()
export class ProductService {
  constructor(private Database: PrismaService) {}

  // ? Create a product
  async create(
    createProductDto: CreateProductDto,
    req: Request,
    res: Response,
  ) {
    const user = req.user;
    this.InvalidTokenResponse(user.userId);
    if (user.role !== "SELLER") {
      throw new ForbiddenException("Forbidden");
    }

    const createdProduct = await this.Database.product.create({
      data: {
        ...createProductDto,
        owner: {
          connect: { id: user.userId },
        },
      },
    });
    if (!createdProduct) {
      throw new BadRequestException("Something went wrong, try again later");
    }

    res.status(HttpStatus.CREATED).json({
      successful: true,
      createdProduct,
    });
  }

  // ? Find All products
  async findAll(res: Response) {
    const products = await this.Database.product.findMany();
    res
      .status(HttpStatus.OK)
      .json({ successful: true, length: products.length, products });
  }

  // ? Find One product
  async findOne(id: string, req: Request, res: Response) {
    const product = await this.Database.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException("Product does not exists");
    }
    res.status(HttpStatus.OK).json({ successful: true, product });
  }

  // ? Update Product
  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    req: Request,
    res: Response,
  ) {
    const { userId } = req.user;
    this.InvalidTokenResponse(userId);
    const owner = await this.Database.product.findUnique({
      where: { id },
      select: { ownerId: true },
    });
    if (!owner) {
      throw new NotFoundException("This resource does not exist");
    }

    if (owner.ownerId !== userId) {
      throw new UnauthorizedException("You do not own this resource");
    }
    const updatedProduct = await this.Database.product.update({
      where: { id },
      data: {
        ...updateProductDto,
      },
    });
    if (!updatedProduct) {
      throw new BadRequestException("Something went wrong, try again later");
    }
    res.status(HttpStatus.OK).json({
      success: true,
      updatedProduct: {
        ...updatedProduct,
      },
    });
  }

  // ? Remove Product
  async remove(id: string, req: Request, res: Response) {
    const { userId } = req.user;
    this.InvalidTokenResponse(userId);

    const owner = await this.Database.product.findUnique({
      where: { id },
      select: { ownerId: true },
    });
    if (!owner) {
      throw new NotFoundException("This resource does not exist");
    }

    if (owner.ownerId !== userId) {
      throw new UnauthorizedException("You do not own this resource");
    }
    const deletedProduct = await this.Database.product.delete({
      where: { id },
    });
    if (!deletedProduct) {
      throw new BadRequestException("Something went wrong, try again later");
    }
    res
      .status(HttpStatus.OK)
      .json({ successful: true, message: "Resource deleted successfully." });
  }

  // ? Utilities
  // ? Validate the token
  InvalidTokenResponse(tokenId: string) {
    if (!tokenId) {
      throw new ForbiddenException("Unauthorized");
    }
  }
}
