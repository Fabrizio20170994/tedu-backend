import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { EntityNotFoundError } from "typeorm";

@Catch(EntityNotFoundError)
export class EntityNotFoundExceptionFilter implements ExceptionFilter{
    catch(exception: EntityNotFoundError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        return response.status(404).json(
            { 
                statusCode: 404, 
                path: request.url,
                timestamp: new Date().toLocaleString(),
                error: 'Not Found', 
                message: "No se pudo encontrar la entidad",
                specificError: exception.message
            }
        );
    }
}