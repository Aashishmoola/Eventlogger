/**
 * Environment Configuration
 * Handles environment variables and application-level settings
 */
module.exports = {
    PORT: process.env.API_PORT || 3000,
    RABBITMQ_URL: process.env.RABBITMQ_URL || "amqp://localhost:5672",
    MONGODB_URL:
        process.env.MONGODB_URL || "mongodb://localhost:27017/eventlogger",
    QUEUE_NAME: process.env.QUEUE_NAME || "events",
};
