import { Body, Controller, Logger, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { RequestDTO } from '../dto/req&resp/request.dto';
import { ResponseDTO } from '../dto/req&resp/response.dto';
import { UserDTO } from '../dto/user.dto';
import { ValidationException } from '../common/exception/validation.exception';

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
      return new ValidationException(errors.map((err) => {
        return err.constraints
          ? Object.values(err.constraints).join(', ')
          : 'Invalid value';
      }));
    },
  }))
  async signIn(@Body() requestDTO: RequestDTO): Promise<ResponseDTO> {
    try {
      this.LOGGER.log(`Received request to login user ${requestDTO.email}`);
      return await this.authService.signIn(requestDTO);
    } catch (error) {
      this.LOGGER.error(`Failed to login user: ${error.message}`);
      throw error;
    }
  }

  @Post('signup')
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
  async signUp(@Body() userDTO: UserDTO): Promise<ResponseDTO> {
    try {
      this.LOGGER.log(`Received request to create user ${userDTO.email}`);
      return await this.authService.signUp(userDTO);
    } catch (error) {
      this.LOGGER.error(`Failed to create user: ${error.message}`);
      throw error;
    }
  }
}