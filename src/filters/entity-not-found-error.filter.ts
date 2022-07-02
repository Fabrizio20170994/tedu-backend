import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { EntityNotFoundError } from 'typeorm';

@Catch(EntityNotFoundError)
export class EntityNotFoundErrorFilter implements ExceptionFilter {
  catch(exception: EntityNotFoundError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const errorCode = HttpStatus.NOT_FOUND;
    return response.status(errorCode).json({
      statusCode: errorCode,
      path: request.url,
      timestamp: new Date().toLocaleString(),
      error: 'Not Found',
      message: 'No se pudo encontrar la entidad',
      specificError: exception.message,
    });
  }
}
