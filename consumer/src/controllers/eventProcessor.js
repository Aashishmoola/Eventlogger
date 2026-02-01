/**
 * Event Processor Controller
 * Coordinates message processing - validates input, calls services, handles responses
 */
const mongodbService = require("../services/mongodb");
const { validateEvent } = require("../middleware/validateEvent");

/**
 * Process incoming message from the queue
 */
async function processMessage(msg, channel) {
    const content = msg.content.toString();

    try {
        // Parse JSON
        const event = JSON.parse(content);

        // Validate event structure
        const validation = validateEvent(event);
        if (!validation.valid) {
            console.error(`Invalid event structure: ${validation.error}`);
            // Don't requeue invalid messages
            channel.nack(msg, false, false);
            return;
        }

        // Store in MongoDB via service
        await mongodbService.storeEvent(event);

        console.log(`Event stored: ${event.eventId}`);

        // Acknowledge message
        channel.ack(msg);
    } catch (error) {
        if (error instanceof SyntaxError) {
            console.error("Failed to parse message as JSON:", content);
            // Don't requeue malformed JSON
            channel.nack(msg, false, false);
        } else if (error.code === 11000) {
            // Duplicate key error - event already exists
            console.warn(`Duplicate event ignored: ${content}`);
            channel.ack(msg);
        } else {
            console.error("Error processing message:", error.message);
            // Requeue on temporary failures (like DB connection issues)
            channel.nack(msg, false, true);
        }
    }
}

module.exports = {
    processMessage,
};
