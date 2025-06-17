import { Body, Controller, Logger, Post, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { RequestDTO } from '../dto/req&resp/request.dto';
import { ResponseDTO } from '../dto/req&resp/response.dto';
import { UserDTO } from '../dto/user.dto';
import { ValidationException } from '../common/exception/validation.exception';
import { Response } from 'express';

@Controller('auth')
export class AuthController{
  private readonly LOGGER = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
  ) {
  }

  @Post('signin')
  @UsePipes(new ValidationPipe({ // Validate incoming data
    whitelist: true,
    forbidNonWhitelisted: true,
    exceptionFactory: (errors) => {
      return new ValidationException(
        errors[0].constraints ? Object.values(errors[0].constraints) : ['Invalid value']
      );
    },
  }))
  async signIn(@Body() requestDTO: RequestDTO, @Res({ passthrough: true }) res: Response): Promise<ResponseDTO> {
    try {
      this.LOGGER.log(`Received request to login user ${requestDTO.email}`);
      return await this.authService.signIn(requestDTO, res);
    } catch (error) {
      this.LOGGER.error(`Failed to login user: ${error.message}`);
      throw error; // Let the global exception filter handle it
    }
  }

  @Post('signup')
  @UsePipes(new ValidationPipe({ // Validate incoming data
    whitelist: true,
    forbidNonWhitelisted: true,
    exceptionFactory: (errors) => {
      return new ValidationException(
        errors[0].constraints ? Object.values(errors[0].constraints) : ['Invalid value']
      );
    },
  }))
  async signUp(@Body() userDTO: UserDTO): Promise<ResponseDTO> {
    try {
      this.LOGGER.log(`Received request to create user ${userDTO.email}`);
      return await this.authService.signUp(userDTO);
    } catch (error) {
      this.LOGGER.error(`Failed to create user: ${error.message}`);
      throw error; // Let the global exception filter handle it
    }
  }
}