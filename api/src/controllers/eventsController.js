/**
 * Events Controller
 * Coordinates request handling - extracts input, calls services, returns responses
 */
const { v4: uuidv4 } = require("uuid");
const rabbitmqService = require("../services/rabbitmq");
const mongodbService = require("../services/mongodb");
const {
    ServiceUnavailableError,
    NotFoundError,
    ValidationError,
} = require("../errors/AppError");

const MAX_GET_EVENTS_LIMIT = 100;
const DEFAULT_GET_EVENTS_LIMIT = 50;

/**
 * GET /events - Retrieve events from MongoDB
 * Supports query params: source, type, limit
 */
async function getEvents(req, res) {
    let { source, type, limit = DEFAULT_GET_EVENTS_LIMIT } = req.query;
    limit = parseInt(limit); // Will return NaN if string cannot be converted to a number

    if (isNaN(limit) || limit < 1) {
        throw new ValidationError("Invalid request params", [
            "Limit must be a positive integer",
        ]);
    }
    if (limit > MAX_GET_EVENTS_LIMIT) {
        throw new ValidationError("Invalid request params", [
            "Limit cannot exceed 100",
        ]);
    }

    // Build query filter
    const filter = {};
    if (source) filter.source = source;
    if (type) filter.type = type;

    // Query via service
    const events = await mongodbService.getEvents(filter, limit);

    return res.status(200).json({
        status: "success",
        count: events.length,
        events,
    });
}

/**
 * GET /events/:eventId - Retrieve a specific event by ID
 */
async function getEventById(req, res) {
    const { eventId } = req.params;

    // Query via service
    const event = await mongodbService.getEventById(eventId);

    if (!event) {
        throw new NotFoundError(`Event with ID ${eventId} not found`);
    }

    return res.status(200).json({
        status: "success",
        event,
    });
}

/**
 * POST /events - Queue an event for async processing
 * Throws errors - caught by errorHandler middleware
 */
async function createEvent(req, res) {
    // Check if RabbitMQ is connected
    if (!rabbitmqService.isConnected()) {
        throw new ServiceUnavailableError("Message queue not connected");
    }

    // Generate event ID
    const eventId = uuidv4();

    // Create event object from validated input
    const event = {
        eventId,
        source: req.body.source,
        type: req.body.type,
        payload: req.body.payload,
        timestamp: req.body.timestamp,
    };

    // Publish to message queue
    rabbitmqService.publish(event);

    console.log(`Event queued: ${eventId}`);

    // Return success response
    return res.status(200).json({
        status: "queued",
        eventId,
    });
}

module.exports = {
    getEvents,
    getEventById,
    createEvent,
};
