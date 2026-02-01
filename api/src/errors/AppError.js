/**
 * Custom Application Error Classes
 * Centralized error definitions for consistent error handling
 */

class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = "error";
        this.isOperational = true; // Distinguishes expected errors from programming bugs

        Error.captureStackTrace(this, this.constructor);
    }
}

class ValidationError extends AppError {
    constructor(message, errors = []) {
        super(message, 400);
        this.errors = errors;
    }
}

class ServiceUnavailableError extends AppError {
    constructor(message = "Service temporarily unavailable") {
        super(message, 503);
    }
}

class BadRequestError extends AppError {
    constructor(message = "Bad request") {
        super(message, 400);
    }
}

class InternalError extends AppError {
    constructor(message = "Internal server error") {
        super(message, 500);
    }
}

class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized") {
        super(message, 401);
    }
}

class NotFoundError extends AppError {
    constructor(message = "Not found") {
        super(message, 404);
    }
}

module.exports = {
    AppError,
    ValidationError,
    ServiceUnavailableError,
    BadRequestError,
    InternalError,
    UnauthorizedError,
    NotFoundError,
};
