/**
 * RabbitMQ Service
 * Core logic for RabbitMQ connection and message consumption
 */
const amqp = require("amqplib");
const { RABBITMQ_URL, QUEUE_NAME } = require("../configs/env");

/**
 * Connect to RabbitMQ with retry logic
 * @returns {Channel} RabbitMQ channel
 */
async function connect(retries = 5, delay = 5000) {
    for (let i = 0; i < retries; i++) {
        try {
            console.log(
                `Connecting to RabbitMQ... (attempt ${i + 1}/${retries})`,
            );
            const connection = await amqp.connect(RABBITMQ_URL);
            const channel = await connection.createChannel();
            await channel.assertQueue(QUEUE_NAME, { durable: true });

            // Prefetch 1 message at a time for fair dispatch
            channel.prefetch(1);

            console.log("Connected to RabbitMQ");
            return channel;
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
 * Start consuming messages from the queue
 */
function startConsuming(channel, messageHandler) {
    // StartConsuming is a wrapper for channel.consume, that runs entire messageHandling function as a callback
    channel.consume(QUEUE_NAME, (msg) => {
        if (msg) {
            messageHandler(msg, channel);
        }
    });
}

module.exports = {
    connect,
    startConsuming,
};
