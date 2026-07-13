import { HttpException, HttpStatus } from "@nestjs/common";

/**
 * Every thrown error in this service should be an AppException so the response body
 * always matches the { error: { code, message, details } } shape fixed in
 * api/openapi.yaml's Error schema and docs/PROJECT_CONTEXT.md §8.
 */
export class AppException extends HttpException {
  constructor(
    status: HttpStatus,
    public readonly code: string,
    message: string,
    public readonly details?: Record<string, unknown>,
  ) {
    super({ code, message, details }, status);
  }

  static notFound(code: string, message: string) {
    return new AppException(HttpStatus.NOT_FOUND, code, message);
  }

  static forbidden(message = "You do not have access to this resource.") {
    return new AppException(HttpStatus.FORBIDDEN, "FORBIDDEN", message);
  }

  static unauthenticated(message = "Missing or invalid access token.") {
    return new AppException(HttpStatus.UNAUTHORIZED, "UNAUTHENTICATED", message);
  }

  static validation(message: string, details?: Record<string, unknown>) {
    return new AppException(HttpStatus.UNPROCESSABLE_ENTITY, "VALIDATION_ERROR", message, details);
  }

  static conflict(code: string, message: string) {
    return new AppException(HttpStatus.CONFLICT, code, message);
  }
}
