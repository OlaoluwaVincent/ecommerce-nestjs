import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
} from "@nestjs/common";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { JwtService } from "@nestjs/jwt";
import { jwtSecret } from "src/constants";

@Injectable()
export class ProductService {
  constructor(private jwtService: JwtService) {}

  create(createProductDto: CreateProductDto) {
    return "This action adds a new product";
  }

  findAll() {
    return `This action returns all product`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }

  async signToken(token: string) {
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtSecret,
        algorithms: ["HS256"],
      });
      if (payload.id) {
        return payload.id;
      }
      return null;
    } catch (err) {
      throw new UnauthorizedException(err.message);
    }
  }

  InvalidTokenResponse(tokenId: string) {
    if (!tokenId) {
      throw new ForbiddenException("Unauthorized");
    }
  }
}
