/**
 * Consumer Service Entry Point
 * Event Logger - Consumes events from queue and stores them in MongoDB
 */
const rabbitmq = require("./services/rabbitmq");
const mongodb = require("./services/mongodb");
const { processMessage } = require("./controllers/eventProcessor");

// Main function
async function start() {
    try {
        // Connect to both services
        await mongodb.connect();
        const channel = await rabbitmq.connect();

        console.log("Consumer started. Waiting for messages...");

        // Start consuming messages, delegate to controller
        rabbitmq.startConsuming(channel, processMessage);
    } catch (error) {
        console.error("Failed to start consumer:", error.message);
        process.exit(1);
    }
}

start();
