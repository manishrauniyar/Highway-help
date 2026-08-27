// A small typed error so controllers can `throw new ApiError(404, '...')`
// and a single error-handling middleware can turn it into the right
// HTTP response, instead of every controller writing its own try/catch.
export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}
