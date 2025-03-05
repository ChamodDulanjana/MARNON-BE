import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException, BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { ValidationException } from '../exception/validation.exception';
import { QueryFailedError } from 'typeorm';
import { ResponseDTO } from '../../dto/req&resp/response.dto';
import { NotFoundException } from '../exception/notFound.exception';
import { AlreadyExistException } from '../exception/alreadyExist.exception';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status = 500;
    let message = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    }

    //validation exception
    if (exception instanceof ValidationException) {
      status = 400;
      message = `Validation error: ${exception.message}`;
    }

    // Handle database errors
    if (exception instanceof QueryFailedError) {
      status = 400;
      message = `Database error: ${exception.message}`;
    }

    // Handle not found errors
    if (exception instanceof NotFoundException) {
      status = 404;
      message = `Not Found: ${exception.message}`;
    }

    // Handle already exists errors
    if (exception instanceof AlreadyExistException) {
      status = 409;
      message = `Already exists: ${exception.message}`;
    }

    // Handle BadRequest errors properly
    if (exception instanceof BadRequestException) {
      status = 400;
      message = ` Exception: ${exception.message}`;
    }

    // Handle generic errors properly
    if (exception instanceof Error) {
      message = exception.message;
    }

    const errorResponse = new ResponseDTO(status, message);

    response.status(status).json(errorResponse);
  }
}
