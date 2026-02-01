/**
 * Environment Configuration
 * Handles environment variables and application-level settings
 */
module.exports = {
    RABBITMQ_URL: process.env.RABBITMQ_URL || "amqp://localhost:5672",
    MONGODB_URL:
        process.env.MONGODB_URL || "mongodb://localhost:27017/eventlogger",
    MONGODB_DATABASE: process.env.MONGODB_DATABASE || "eventlogger",
    QUEUE_NAME: process.env.QUEUE_NAME || "events",
    MONGODB_DBNAME: process.env.MONGODB_DBNAME || "test",
};
