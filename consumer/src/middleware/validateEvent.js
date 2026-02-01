/**
 * Event Validation Middleware
 * Validates event structure before processing
 */

/**
 * Validates the structure of an event from the queue
 * @returns {Object} { valid: boolean, error?: string }
 */

function validateEvent(event) {
    const requiredFields = [
        "eventId",
        "source",
        "type",
        "payload",
        "timestamp",
    ]; //Should this be in env file??

    for (const field of requiredFields) {
        if (event[field] === undefined || event[field] === null) {
            return { valid: false, error: `Missing required field: ${field}` };
        }
    }

    if (typeof event.eventId !== "string") {
        return { valid: false, error: "eventId must be a string" };
    }
    if (typeof event.source !== "string") {
        return { valid: false, error: "source must be a string" };
    }
    if (typeof event.type !== "string") {
        return { valid: false, error: "type must be a string" };
    }
    if (typeof event.payload !== "object" || Array.isArray(event.payload)) {
        return { valid: false, error: "payload must be an object" };
    }
    if (typeof event.timestamp !== "string") {
        return { valid: false, error: "timestamp must be a string" };
    }

    return { valid: true };
}

module.exports = { validateEvent };
