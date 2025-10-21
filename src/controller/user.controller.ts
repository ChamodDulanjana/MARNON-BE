import {
  Body,
  Controller,
  Get,
  Header,
  Logger,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from '../service/user.service';
import { AuthGuard } from '../common/guards/auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleEnum } from '../common/enums/role.enum';
import { RolesGuard } from '../common/guards/roles.guard';
import { ResponseDTO } from '../dto/req&resp/response.dto';
import { UserDTO } from '../dto/user.dto';
import { ValidationException } from '../common/exception/validation.exception';
import { UserUpdateDTO } from '../dto/user-update.dto';
import { Request } from 'express';
import { CommonUtil } from '../util/common-util';
import { PaginationDTO } from '../dto/pagination.dto';

@Controller('user')
export class UserController {
  private readonly LOGGER = new Logger(UserController.name);

  constructor(
    private readonly userService: UserService,
  ) {
  }

  @UseGuards(AuthGuard) // Apply both JWT and Role Guards
  @Get(':id')
  async getUserById(@Param('id') id: number): Promise<ResponseDTO> {
    try {
      this.LOGGER.log(`Received request to get user with id ${id}`);
      return await this.userService.getUserById(id);
    } catch (error) {
      this.LOGGER.error(`Failed to get user: ${error.message}`);
      throw error;
    }
  }

  @UseGuards(AuthGuard) // Apply JWT Guards
  @Get('by-email/:email')
  async getUserByEmail(@Param('email') email: string): Promise<ResponseDTO> {
    try {
      this.LOGGER.log(`Received request to get user with email ${email}`);
      return await this.userService.getUserByEmail(email);
    } catch (error) {
      this.LOGGER.error(`Failed to get user by email: ${error.message}`);
      throw error;
    }
  }

  @UseGuards(AuthGuard, RolesGuard) // Apply both JWT and Role Guards
  @Roles(RoleEnum.ADMIN) // Only ADMIN can access
  @Get('all/users')
  async getAllUsers(): Promise<ResponseDTO> {
    try {
      this.LOGGER.log(`Received request to get all users`);
      return await this.userService.getAllUsers();
    } catch (error) {
      this.LOGGER.error(`Failed to get all users: ${error.message}`);
      throw error;
    }
  }

  @UseGuards(AuthGuard, RolesGuard) // Apply both JWT and Role Guards
  @Roles(RoleEnum.ADMIN) // Only ADMIN can access
  @Get('all/active-users')
  async getAllActiveUsers(): Promise<ResponseDTO> {
    try {
      this.LOGGER.log(`Received request to get all active users`);
      return await this.userService.getAllActiveUsers();
    } catch (error) {
      this.LOGGER.error(`Failed to get all active users: ${error.message}`);
      throw error;
    }
  }

  @UseGuards(AuthGuard) // Apply JWT Guards
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
  @Patch('regular/:id')
  async updateByRegularUser(@Param('id') id: number,
                            @Body() userDTO: UserUpdateDTO,
                            @Req() req: Request): Promise<ResponseDTO> {
    try {
      const { userName } = CommonUtil.extractPayloadFromToken(req);

      this.LOGGER.log(`Received request to update user with id ${id}`);
      return await this.userService.updateByRegularUser(id, userDTO, userName);
    } catch (error) {
      this.LOGGER.error(`Failed to update user: ${error.message}`);
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
  @Patch('admin/:id')
  async updateByAdminUser(@Param('id') id: number, @Body() userDTO: UserUpdateDTO, @Req() req: Request): Promise<ResponseDTO> {
    try {
      const { userName } = CommonUtil.extractPayloadFromToken(req);

      this.LOGGER.log(`Received request to update user with id ${id}`);
      return await this.userService.updateByAdminUser(id, userDTO, userName);
    } catch (error) {
      this.LOGGER.error(`Failed to update user: ${error.message}`);
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
  @Post('createByAdmin')
  async createByAdminUser(@Body() userDTO: UserDTO, @Req() req: Request): Promise<ResponseDTO> {
    try {
      const { userName } = CommonUtil.extractPayloadFromToken(req);

      this.LOGGER.log(`Received request to create user`);
      return await this.userService.createByAdminUser(userDTO, userName);
    } catch (error) {
      this.LOGGER.error(`Failed to create user: ${error.message}`);
      throw error;
    }
  }

  @UseGuards(AuthGuard, RolesGuard) // Apply both JWT and Role Guards
  @Roles(RoleEnum.ADMIN) // Only ADMIN can access
  @Get('all/customers/count')
  async getAllCustomersCount(): Promise<ResponseDTO> {
    try {
      this.LOGGER.log(`Received request to get all customers count`);
      return await this.userService.getAllCustomersCount();
    } catch (error) {
      this.LOGGER.error(`Failed to get all customers count: ${error.message}`);
      throw error;
    }
  }

  @UseGuards(AuthGuard, RolesGuard) // Apply both JWT and Role Guards
  @Roles(RoleEnum.ADMIN) // Only ADMIN can access
  @Post('search/by/pagination')
  async searchUserByPagination(@Query('searchTerm') searchTerm: string,
                                   @Query('status') status: 'active' | 'inactive' | 'all',
                                   @Body() paginationDTO: PaginationDTO, ): Promise<ResponseDTO> {
    try {
      this.LOGGER.log(`Received request to search users by pagination`);
      return await this.userService.searchUserByPagination(searchTerm, status, paginationDTO);
    } catch (error) {
      this.LOGGER.error(`Failed to search users by pagination: ${error.message}`);
      throw error;
    }
  }
}