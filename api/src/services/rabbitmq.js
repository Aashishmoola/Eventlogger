/**
 * RabbitMQ Service
 * Core logic for RabbitMQ connection and message publishing
 */
const amqp = require("amqplib");
const { RABBITMQ_URL, QUEUE_NAME } = require("../configs/env");

let channel = null;

/**
 * Connect to RabbitMQ with retry logic
 */
async function connect(retries = 5, delay = 5000) {
    for (let i = 0; i < retries; i++) {
        try {
            console.log(
                `Connecting to RabbitMQ... (attempt ${i + 1}/${retries})`,
            );
            const connection = await amqp.connect(RABBITMQ_URL);
            channel = await connection.createChannel();
            await channel.assertQueue(QUEUE_NAME, { durable: true });
            console.log("Connected to RabbitMQ");
            return;
        } catch (error) {
            console.error(`RabbitMQ connection failed: ${error.message}`);
            if (i < retries - 1) {
                console.log(`Retrying in ${delay / 1000} seconds...`);
                await new Promise((resolve) => setTimeout(resolve, delay));
            }
        }
    }
    throw new Error("Failed to connect to RabbitMQ after multiple attempts");
}

/**
 * Check if RabbitMQ channel is connected
 * @returns {boolean}
 */
function isConnected() {
    return channel !== null;
}

/**
 * Publish an event to the queue
 */
function publish(event) {
    if (!channel) {
        throw new Error("RabbitMQ channel not initialized");
    }

    channel.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(event)), {
        persistent: true,
    });
}

module.exports = {
    connect,
    isConnected,
    publish,
};
