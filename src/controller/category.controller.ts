import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoryService } from '../service/category.service';
import { ResponseDTO } from '../dto/req&resp/response.dto';
import { CategoryDTO } from '../dto/category.dto';
import { CommonUtil } from '../util/common-util';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleEnum } from '../common/enums/role.enum';
import { ValidationException } from '../common/exception/validation.exception';

@Controller('category')
export class CategoryController{
  private readonly LOGGER = new Logger(CategoryController.name);

  constructor(
    private readonly categoryService: CategoryService,
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
  async createCategory(@Body() categoryDTO: CategoryDTO, @Req() req: Request): Promise<ResponseDTO>{
    try {
      const userName = CommonUtil.extractUsernameFromToken(req, this.jwtService);

      this.LOGGER.log(`Received request to create category ${categoryDTO.name}`);
      return await this.categoryService.createCategory(categoryDTO, userName);
    } catch (error) {
      this.LOGGER.error(`Failed to create category: ${error.message}`);
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
  async updateCategory(@Param('id') id: number,
                       @Body() categoryDTO: CategoryDTO,
                       @Req() req: Request): Promise<ResponseDTO>{
    try {
      const userName = CommonUtil.extractUsernameFromToken(req, this.jwtService);

      this.LOGGER.log(`Received request to update category ${categoryDTO.name}`);
      return await this.categoryService.updateCategory(id, categoryDTO, userName);
    } catch (error) {
      this.LOGGER.error(`Failed to update category: ${error.message}`);
      throw error;
    }
  }

  @UseGuards(AuthGuard, RolesGuard) // Apply both JWT and Role Guards
  @Roles(RoleEnum.ADMIN) // Only ADMIN can access
  @Get('all/categories')
  async getAllCategories(): Promise<ResponseDTO> {
    try {
      this.LOGGER.log(`Received request to get all categories`);
      return await this.categoryService.getAllCategories();
    } catch (error) {
      this.LOGGER.error(`Failed to get all categories: ${error.message}`);
      throw error;
    }
  }

  @UseGuards(AuthGuard, RolesGuard) // Apply both JWT and Role Guards
  @Roles(RoleEnum.ADMIN) // Only ADMIN can access
  @Get(':id')
  async getById(@Param('id') id: number): Promise<ResponseDTO> {
    try {
      this.LOGGER.log(`Received request to get category by id ${id}`);
      return await this.categoryService.getById(id);
    } catch (error) {
      this.LOGGER.error(`Failed to get category by id: ${error.message}`);
      throw error;
    }
  }

  @UseGuards(AuthGuard, RolesGuard) // Apply both JWT and Role Guards
  @Roles(RoleEnum.ADMIN) // Only ADMIN can access
  @Get('all/active-categories')
  async getAllActiveCategories(): Promise<ResponseDTO> {
    try {
      this.LOGGER.log(`Received request to get all active categories`);
      return await this.categoryService.getAllActiveCategories();
    } catch (error) {
      this.LOGGER.error(`Failed to get all active categories: ${error.message}`);
      throw error;
    }
  }
}