import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class QueryFailedErrorFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const errorCode = HttpStatus.BAD_REQUEST;
    return response.status(errorCode).json({
      statusCode: errorCode,
      path: request.url,
      timestamp: new Date().toLocaleString(),
      error: 'Bad Request',
      message: 'Tipos de parámetros incorrectos en la petición',
      specificError: exception.message,
    });
  }
}
