/**
 * Error Handler Middleware
 * Single place that catches ALL errors and formats responses
 */
const { AppError } = require("../errors/AppError");

/**
 * Central error handler - catches all errors and sends formatted response
 */
function errorHandler(err, req, res, next) {
    // Handle malformed JSON from express.json()
    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        // All three checks are requied to
        return res.status(400).json({
            status: "error",
            message: "Malformed JSON in request body",
        });
    }

    // Handle our custom AppError types
    if (err instanceof AppError) {
        const response = {
            status: err.status,
            message: err.message,
        };

        // Include validation errors array if present
        if (err.errors && err.errors.length > 0) {
            response.errors = err.errors;
        }

        return res.status(err.statusCode).json(response);
    }

    // Handle unexpected errors (programming bugs) or MongoDb serice errors(should not be revealed to client)
    console.error("Unexpected error:", err);
    return res.status(500).json({
        status: "error",
        message: "Internal server error",
    });
}

module.exports = errorHandler;
