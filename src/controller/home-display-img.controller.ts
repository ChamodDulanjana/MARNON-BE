import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { HomeDisplayImgService } from '../service/home_display_img.service';
import { HomeDisplayImgDTO } from '../dto/home-display-img.dto';
import { CommonUtil } from '../util/common-util';
import { ResponseDTO } from '../dto/req&resp/response.dto';
import { ValidationException } from '../common/exception/validation.exception';
import { AuthGuard } from '../common/guards/auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { RoleEnum } from '../common/enums/role.enum';
import { Request } from 'express';

@Controller('home-display-img')
export class HomeDisplayImgController {
  private readonly LOGGER = new Logger(HomeDisplayImgController.name);

  constructor(
    private readonly homeDisplayImgService: HomeDisplayImgService,
  ) {}

  @UseGuards(AuthGuard, RolesGuard) // Apply both JWT and Role Guards
  @Roles(RoleEnum.ADMIN) // Only ADMIN can access
  @UsePipes(new ValidationPipe({
      // Validate incoming data
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        return new ValidationException(
          errors.map((err) => {
            return err.constraints
              ? Object.values(err.constraints).join(', ')
              : 'Invalid value';
          }),
        );
      },
    }),)
  @Post()
  async createOrUpdateHomeDisplayImg(@Body() homeDisplayImgDTO: HomeDisplayImgDTO,
                                     @Req() req: Request): Promise<ResponseDTO> {
    try {
      const { userName } = CommonUtil.extractPayloadFromToken(req);

      this.LOGGER.log(`Received request to create or update home display image for type: ${homeDisplayImgDTO.type}`);
      return await this.homeDisplayImgService.createOrUpdateHomeDisplayImg(homeDisplayImgDTO, userName);
    } catch (error) {
      this.LOGGER.error(`Failed to create or update home display image: ${error.message}`);
      throw error;
    }
  }

  @Get(':type')
  async getHomeDisplayImgByType(@Param('type') type: string): Promise<ResponseDTO> {
    try {
      this.LOGGER.log(`Received request to get home display image for type: ${type}`);
      return await this.homeDisplayImgService.getHomeDisplayImgByType(type);
    } catch (error) {
      this.LOGGER.error(`Failed to get home display image by type: ${error.message}`);
      throw error;
    }
  }
}