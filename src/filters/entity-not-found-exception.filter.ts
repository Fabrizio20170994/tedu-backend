import { ArgumentsHost, Catch, ExceptionFilter } from "@nestjs/common";
import { EntityNotFoundError } from "typeorm";

@Catch(EntityNotFoundError)
export class EntityNotFoundExceptionFilter implements ExceptionFilter{
    catch(exception: EntityNotFoundError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        return response.status(404).json(
            { 
                statusCode: 404, 
                error: 'Not Found', 
                message: "No se pudo encontrar el curso",
                specificError: exception.message
            }
        );
    }
}