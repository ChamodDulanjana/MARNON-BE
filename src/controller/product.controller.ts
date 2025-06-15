import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Post, Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
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
import { FilterProductDTO } from 'src/dto/filterProduct.dto';
import { PaginationDTO } from '../dto/pagination.dto';

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
  @Patch(':id')
  async updateProduct(@Param('id') id: number, @Body() productDTO: ProductDTO, @Req() req: Request ): Promise<ResponseDTO> {
    try {
      const userName = CommonUtil.extractUsernameFromToken(req, this.jwtService);

      this.LOGGER.log(`Received request to update product ${productDTO.name}`);
      return await this.productService.updateProduct(id, productDTO, userName);
    } catch (error) {
      this.LOGGER.error(`Failed to update product: ${error.message}`);
      throw error;
    }
  }

  @Get(':id')
  async getProductById(@Param('id') id: number): Promise<ResponseDTO> {
    try {
      this.LOGGER.log(`Received request to get product by ID ${id}`);
      return await this.productService.getById(id);
    } catch (error) {
      this.LOGGER.error(`Failed to get product by ID: ${error.message}`);
      throw error;
    }
  }

  @Get('all/products')
  async getAllProducts(): Promise<ResponseDTO> {
    try {
      this.LOGGER.log('Received request to get all products');
      return await this.productService.getAllProducts();
    } catch (error) {
      this.LOGGER.error(`Failed to get all products: ${error.message}`);
      throw error;
    }
  }

  @Get('all/products/:category')
  async getAlProductsByCategory(@Param('category') category: string): Promise<ResponseDTO> {
    try {
      this.LOGGER.log('Received request to get all mens products');
      return await this.productService.getProductsByCategory(category);
    } catch (error) {
      this.LOGGER.error(`Failed to get all mens products: ${error.message}`);
      throw error;
    }
  }

  @Post('all/filter-products')
  async getFilteredProducts(@Body() filterProductDTO: FilterProductDTO): Promise<ResponseDTO> { 
    try {
      this.LOGGER.log('Received request to get filtered products');
      return await this.productService.getFilteredProducts(filterProductDTO);
    } catch (error) {
      this.LOGGER.error(`Failed to get filtered products: ${error.message}`);
      throw error;
    } 
  }

  @Get('all/categoryAndCount')
  async getProductsByCategoryAndCount(
    @Query('category') category: string,
    @Query('count') count: number
  ): Promise<ResponseDTO> {
    try {
      this.LOGGER.log(`Received request to get products by category ${category} and count ${count}`);
      return await this.productService.getProductsByCategoryAndCount(category, count);
    } catch (error) {
      this.LOGGER.error(`Failed to get products by category and count: ${error.message}`);
      throw error;
    }
  }

  @UseGuards(AuthGuard, RolesGuard) // Apply both JWT and Role Guards
  @Roles(RoleEnum.ADMIN) // Only ADMIN can access
  @Post('all/admin/popular-products')
  async getPopularProductsForAdmin(@Body() paginationDTO: PaginationDTO): Promise<ResponseDTO> {
    try {
      this.LOGGER.log('Received request to get popular products for admin');
      return await this.productService.getPopularProductsForAdmin(paginationDTO);
    } catch (error) {
      this.LOGGER.error(`Failed to get popular products for admin: ${error.message}`);
      throw error;
    }
  }

  @UseGuards(AuthGuard, RolesGuard) // Apply both JWT and Role Guards
  @Roles(RoleEnum.ADMIN) // Only ADMIN can access
  @Get('all/product-sales/:id')
  async getSalesByProductId(@Param('id') id: number): Promise<number> {
    try {
      this.LOGGER.log(`Received request to get sales by product ID ${id}`);
      return await this.productService.getSalesByProductId(id);
    } catch (error) {
      this.LOGGER.error(`Failed to get sales by product ID: ${error.message}`);
      throw error;
    }
  }
}