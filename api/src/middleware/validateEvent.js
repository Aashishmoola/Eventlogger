/**
 * Event Validation Middleware
 * Runs between request and controller to validate input
 */
const { ValidationError } = require("../errors/AppError");

/**
 * Middleware to validate event structure in request body
 * Throws ValidationError if invalid - caught by errorHandler
 */
function validateEvent(req, res, next) {
    const errors = [];
    const body = req.body;

    console.log("validateEvent called, body:", req.body);

    if (!body || Object.keys(body).length === 0) {
        // !body only checks if body is null/undefined
        errors.push("body is empty");
    } else {
        if (!body.source || typeof body.source !== "string") {
            errors.push("source is required and must be a string");
        }
        if (!body.type || typeof body.type !== "string") {
            errors.push("type is required and must be a string");
        }
        if (
            !body.payload ||
            typeof body.payload !== "object" ||
            Array.isArray(body.payload)
        ) {
            errors.push("payload is required and must be an object");
        }
        if (!body.timestamp || typeof body.timestamp !== "string") {
            errors.push("timestamp is required and must be a string");
        }
    }

    if (errors.length > 0) {
        throw new ValidationError("Invalid event structure", errors);
    }

    // Validation passed, proceed to controller
    next();
}

module.exports = validateEvent;
