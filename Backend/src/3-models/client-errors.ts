import { StatusCode } from './enums';

// Base class for any client error:
abstract class ClientError {
  public message: string;
  public status: number;

  public constructor(message: string, status: number) {
    this.message = message;
    this.status = status;
  }
}

// Route not found error:
export class RouteNotFoundError extends ClientError {
  public constructor(route: string) {
    super(`Route ${route} not found.`, StatusCode.NotFound);
  }
}

// Resource not found error:
export class ResourceNotFoundError extends ClientError {
  public constructor(_id: string) {
    super(`_id ${_id} not exist.`, StatusCode.NotFound);
  }
}

export class ConflictError extends ClientError {
  public constructor(message: string) {
    super(message, StatusCode.Conflict);
  }
}

// Validation error:
export class ValidationError extends ClientError {
  public constructor(message: string) {
    super(message, StatusCode.BadRequest);
  }
}

// Unauthorized error:
export class UnauthorizedError extends ClientError {
  public constructor(message: string) {
    super(message, StatusCode.Unauthorized);
  }
}