import {
  Body,
  Controller,
  Get,
  Header,
  Logger,
  Param,
  Patch,
  Post,
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
import { CommonUtil } from '../util/common-util';
import { JwtService } from '@nestjs/jwt';
import { ValidationException } from '../common/exception/validation.exception';

@Controller('user')
export class UserController {
  private readonly LOGGER = new Logger(UserController.name);

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {
  }

  @UseGuards(AuthGuard, RolesGuard) // Apply both JWT and Role Guards
  @Roles(RoleEnum.ADMIN) // Only ADMIN can access
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
  @Patch('reguler/:id')
  async updateByRegularUser(@Param('id') id: number, @Body() userDTO: UserDTO, @Req() req: Request): Promise<ResponseDTO> {
    try {
      const userName = CommonUtil.extractUsernameFromToken(req, this.jwtService);

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
  async updateByAdminUser(@Param('id') id: number, @Body() userDTO: UserDTO, @Req() req: Request): Promise<ResponseDTO> {
    try {
      const userName = CommonUtil.extractUsernameFromToken(req, this.jwtService);

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
      const userName = CommonUtil.extractUsernameFromToken(req, this.jwtService);

      this.LOGGER.log(`Received request to create user`);
      return await this.userService.createByAdminUser(userDTO, userName);
    } catch (error) {
      this.LOGGER.error(`Failed to create user: ${error.message}`);
      throw error;
    }
  }
}