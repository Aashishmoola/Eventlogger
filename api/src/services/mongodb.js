/**
 * MongoDB Service
 * Handles database connection and query operations
 */
const mongoose = require("mongoose");
const { MONGODB_URL } = require("../configs/env");
const Event = require("../models/Event");

/**
 * Connect to MongoDB with retry logic
 */
async function connect(retries = 5, delay = 5000) {
    for (let i = 0; i < retries; i++) {
        try {
            console.log(
                `Connecting to MongoDB... (attempt ${i + 1}/${retries})`,
            );

            await mongoose.connect(MONGODB_URL);

            console.log("Connected to MongoDB");
            return;
        } catch (error) {
            console.error(`MongoDB connection failed: ${error.message}`);
            if (i < retries - 1) {
                console.log(`Retrying in ${delay / 1000} seconds...`);
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }
    }
    throw new Error("Failed to connect to MongoDB after multiple attempts");
}

/**
 * Check if MongoDB is connected
 * @returns {boolean}
 */
function isConnected() {
    return mongoose.connection.readyState === 1;
}

/**
 * Get events with optional filters
 * @returns {Promise<Array>} Array of events
 */
async function getEvents(filter = {}, limit = 50) {
    return Event.find(filter).sort({ receivedAt: -1 }).limit(limit).lean(); // return as JS objects instead of mongooose documents (special object with methods)
}

/**
 * Get a single event by eventId
 * @returns {Promise<Object|null>} Event object or null
 */
async function getEventById(eventId) {
    return Event.findOne({ eventId }).lean();
}

module.exports = {
    connect,
    isConnected,
    getEvents,
    getEventById,
};
