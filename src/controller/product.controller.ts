import { Body, Controller, Logger, Post, Req, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductService } from '../service/product.service';
import { JwtService } from '@nestjs/jwt';
import { ProductDTO } from '../dto/product.dto';
import { CommonUtil } from '../util/common-util';
import { ResponseDTO } from '../dto/req&resp/response.dto';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleEnum } from '../common/enums/role.enum';
import { ValidationException } from '../common/exception/validation.exception';

@Controller('product')
export class ProductController{
  private readonly LOGGER = new Logger(ProductController.name);

  constructor(
    private readonly productService: ProductService,
    private readonly jwtService: JwtService,
  ) {
  }

  @UseGuards(AuthGuard, RolesGuard) // Apply both JWT and Role Guards
  @Roles(RoleEnum.ADMIN) // Only ADMIN can access
  @UsePipes(new ValidationPipe({ // Validate incoming data
    whitelist: true,
    forbidNonWhitelisted: true,
    exceptionFactory: (errors) => {
      return new ValidationException(errors.map((err) => {
        return err.constraints
          ? Object.values(err.constraints).join(', ')
          : 'Invalid value';
      }));
    },
  }))
  @Post()
  async createProduct(@Body() productDTO: ProductDTO, @Req() req: Request ): Promise<ResponseDTO> {
    try {
      const userName = CommonUtil.extractUsernameFromToken(req, this.jwtService);

      this.LOGGER.log(`Received request to create product ${productDTO.name}`);
      return await this.productService.createProduct(productDTO, userName);
    } catch (error) {
      this.LOGGER.error(`Failed to create product: ${error.message}`);
      throw error;
    }
  }
}