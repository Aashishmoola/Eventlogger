/**
 * Events Routes
 * Defines API endpoints and maps HTTP methods to controller functions
 */
const express = require("express");
const eventsController = require("../controllers/eventsController");
const validateEvent = require("../middleware/validateEvent");

const router = express.Router();

/**
 * GET /events
 * Retrieve events with optional filters (source, type, limit)
 */
router.get("/", eventsController.getEvents);

/**
 * GET /events/:eventId
 * Retrieve a specific event by ID
 */
router.get("/:eventId", eventsController.getEventById);

/**
 * POST /events
 * Validates → Controller: Queues event for processing
 */
router.post("/", validateEvent, eventsController.createEvent);

module.exports = router;
