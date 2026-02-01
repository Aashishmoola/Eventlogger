/**
 * API Service Entry Point
 * Event Logger - Accepts events via REST API and queues them for async processing
 */
const express = require("express");
const { PORT } = require("./configs/env");
const eventsRouter = require("./routes/events");
const authenticate = require("./middleware/authenticate");
const errorHandler = require("./middleware/errorHandler");
const rabbitmq = require("./services/rabbitmq");
const mongodb = require("./services/mongodb");

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Authentication middleware (applies to all routes)
app.use(authenticate);

// Routes
app.use("/events", eventsRouter);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
async function start() {
    try {
        await rabbitmq.connect();
        await mongodb.connect();
        app.listen(PORT, () => {
            console.log(`API server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
}

start();
