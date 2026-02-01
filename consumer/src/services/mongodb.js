/**
 * MongoDB Service
 * Core logic for database connection using Mongoose
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
 * Get the Mongoose connection
 * @returns {Connection}
 */
function getConnection() {
    if (mongoose.connection.readyState !== 1) {
        throw new Error("MongoDB not connected");
    }
    return mongoose.connection;
}

/**
 * Store an event in the database
 */
async function storeEvent(eventData) {
    // Will be stored in DB as event collection under main
    const event = new Event({
        ...eventData,
        receivedAt: new Date(),
    });
    await event.save();
}

module.exports = {
    connect,
    getConnection,
    storeEvent,
    Event, // Export model for direct access if needed
};
