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
import { SizeService } from '../service/size.service';
import { SizeDTO } from '../dto/size.dto';
import { ResponseDTO } from '../dto/req&resp/response.dto';
import { CommonUtil } from '../util/common-util';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleEnum } from '../common/enums/role.enum';
import { ValidationException } from '../common/exception/validation.exception';

@Controller('size')
export class SizeController{
  private readonly LOGGER = new Logger(SizeController.name);

  constructor(
    private readonly sizeService: SizeService,
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
  async createSize(@Body() sizeDTO: SizeDTO, @Req() req: Request): Promise<ResponseDTO> {
    try {
      const userName = CommonUtil.extractUsernameFromToken(req, this.jwtService);

      this.LOGGER.log(`Received request to create size ${sizeDTO.size}`);
      return await this.sizeService.createSize(sizeDTO, userName);
    } catch (error) {
      this.LOGGER.error(`Failed to create size: ${error.message}`);
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
  async updateSize(@Param('id') id: number, @Body() sizeDTO: SizeDTO, @Req() req: Request): Promise<ResponseDTO> {
    try {
      const userName = CommonUtil.extractUsernameFromToken(req, this.jwtService);

      this.LOGGER.log(`Received request to update size ${sizeDTO.size}`);
      return await this.sizeService.updateSize(id, sizeDTO, userName);
    } catch (error) {
      this.LOGGER.error(`Failed to update size: ${error.message}`);
      throw error;
    }
  }

  @UseGuards(AuthGuard, RolesGuard) // Apply both JWT and Role Guards
  @Roles(RoleEnum.ADMIN) // Only ADMIN can access
  @Get('all/sizes')
  async getAllSizes(): Promise<ResponseDTO> {
    try {
      this.LOGGER.log(`Received request to get all sizes`);
      return await this.sizeService.getAllSizes();
    } catch (error) {
      this.LOGGER.error(`Failed to get all sizes: ${error.message}`);
      throw error;
    }
  }

  @UseGuards(AuthGuard, RolesGuard) // Apply both JWT and Role Guards
  @Roles(RoleEnum.ADMIN) // Only ADMIN can access
  @Get('all/active-sizes')
  async getAllActiveSizes(): Promise<ResponseDTO> {
    try {
      this.LOGGER.log(`Received request to get all active sizes`);
      return await this.sizeService.getAllActiveSizes();
    } catch (error) {
      this.LOGGER.error(`Failed to get all active sizes: ${error.message}`);
      throw error;
    }
  }

  @UseGuards(AuthGuard, RolesGuard) // Apply both JWT and Role Guards
  @Roles(RoleEnum.ADMIN) // Only ADMIN can access
  @Get(':id')
  async getSizeById(@Param('id') id: number): Promise<ResponseDTO> {
    try {
      this.LOGGER.log(`Received request to get size with id ${id}`);
      return await this.sizeService.getById(id);
    } catch (error) {
      this.LOGGER.error(`Failed to get size: ${error.message}`);
      throw error;
    }
  }
}