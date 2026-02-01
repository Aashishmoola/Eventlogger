/**
 * Event Model
 * Mongoose schema definition for events collection
 */
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
    {
        eventId: {
            type: String,
            required: true,
            unique: true,
            index: true,
        },
        source: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: true,
        },
        payload: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
        },
        timestamp: {
            type: String,
            required: true,
        },
        receivedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: false,
        versionKey: false,
    },
);

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
