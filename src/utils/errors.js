class AppError extends Error {
    constructor(message, code, statusCode) {
        super(message);
        this.code = code;
        this.statusCode = statusCode;
    }
}

class NotFoundError extends AppError {
    constructor(message) {
        super(message, 'NotFound', 404);
    }
}

class ValidationError extends AppError {
    constructor(message) {
        super(message, 'ValidationError', 400);
    }
}

module.exports = {
    AppError,
    NotFoundError,
    ValidationError
};