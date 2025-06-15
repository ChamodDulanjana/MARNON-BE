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

    // Handle HttpExceptions (like BadRequestException, etc.)
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null) {
        const err = exceptionResponse as any;
        message = err.message || exception.message;
      } else {
        message = exception.message;
      }
    }

    // Custom validation exception
    else if (exception instanceof ValidationException) {
      status = 400;
      message = `${exception.message}`;
    }

    // TypeORM error
    else if (exception instanceof QueryFailedError) {
      status = 400;
      message = `Database error: ${exception.message}`;
    }

    // Not found
    else if (exception instanceof NotFoundException) {
      status = 404;
      message = `${exception.message}`;
    }

    // Already exists
    else if (exception instanceof AlreadyExistException) {
      status = 409;
      message = `${exception.message}`;
    }

    // Fallback generic Error
    else if (exception instanceof Error) {
      status = 400;
      message = `${exception.message}`;
    }

    const errorResponse = new ResponseDTO(status, message);
    response.status(status).json(errorResponse);
  }
}
