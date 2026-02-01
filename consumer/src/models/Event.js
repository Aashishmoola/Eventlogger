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
            type: mongoose.Schema.Types.Mixed, // Accepts all types, payload unknown
            required: true,
        },
        timestamp: {
            type: String,
            required: true,
        },
        receivedAt: {
            type: Date,
            default: Date.now, // function passed as callback (Mongoose(JS DATE Obj) --save as --> MONGODB(BSON Date Format) --viewed as--> ATLAS(ISO8601 in document))
        },
    },
    {
        timestamps: false, // We're using our own receivedAt, do not need updated timestamps for changing events
        versionKey: false, // Disable __v field for version control (Data Conflicts)
    },
);

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
