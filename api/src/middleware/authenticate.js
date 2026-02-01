/**
 * Authentication Middleware
 * Validates API key before allowing access to protected routes
 */
const { UnauthorizedError, InternalError } = require("../errors/AppError");

/**
 * Middleware to authenticate requests via API key
 */
function authenticate(req, res, next) {
    const apiKey = req.headers["x-api-key"];
    const validApiKey = process.env.API_KEY;

    // Check if API key is configured
    if (!validApiKey) {
        console.warn("Warning: API_KEY not configured in environment");
        throw new InternalError("An error occurred during validating request");
    }

    // Validate API key
    if (!apiKey) {
        throw new UnauthorizedError("API key is required");
    }

    if (apiKey !== validApiKey) {
        throw new UnauthorizedError("Invalid API key");
    }

    // Authentication passed
    next();
}

module.exports = authenticate;
