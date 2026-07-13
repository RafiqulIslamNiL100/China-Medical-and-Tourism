import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from "@nestjs/common";
import { Response } from "express";

/**
 * Normalizes every error response — including validation pipe failures and unhandled
 * exceptions — into the { error: { code, message, details } } shape, so API consumers
 * (including apps/web) only ever need to handle one error format.
 */
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger("HttpException");

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const body = exception.getResponse();

      if (typeof body === "object" && body !== null && "code" in body) {
        // Already an AppException-shaped payload.
        response.status(status).json({ error: body });
        return;
      }

      // A framework-thrown HttpException (e.g. ValidationPipe's 400s).
      const message = typeof body === "string" ? body : (body as { message?: string | string[] }).message;
      response.status(status).json({
        error: {
          code: status === HttpStatus.BAD_REQUEST ? "VALIDATION_ERROR" : "HTTP_ERROR",
          message: Array.isArray(message) ? message.join("; ") : (message ?? exception.message),
        },
      });
      return;
    }

    this.logger.error(exception instanceof Error ? exception.stack : exception);
    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      error: { code: "INTERNAL_ERROR", message: "An unexpected error occurred." },
    });
  }
}
