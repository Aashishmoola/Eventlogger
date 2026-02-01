# Event Logger Service

A scalable and lightweight Event Logger Service designed to handle application events asynchronously. Can be used for any application where logging data to a message broker is the first priority before analysing and futher processing of data can ocurred once it is stored in a database

# Project Structure

Tasking1/
├── docker-compose.yml
├── api/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       └── index.js
├── consumer/
│   ├── Dockerfile
│   ├── package.json
│   └── src/
│       └── index.js
└── README.md

# Documentation
Detailed documentation has been moved to the [docs/](docs/) folder:

- [Setup Guide](docs/SETUP.md): Steps to configure the `.env` file, connect to MongoDB Atlas, and run the project locally with Docker.
- [API Reference](docs/API_DOCUMENTATION.md): Full details on available endpoints, request formats, and authentication.
- [Technologies & Design](docs/TECHNOLOGIES.md): Information on the tech stack (Node.js, RabbitMQ, MongoDB) and architectural decisions.

# Quick Start

1.  Clone the repo.
2.  Configure `.env`: Create a `.env` file based on the provided template (see [Setup Guide](docs/SETUP.md)).
3.  Run with Docker in CLI: docker-compose up --build
4.  Access API: `http://localhost:3000` or Run API through Postman (Recommened, see (docs/API_DOCUMENTATION.md))

# Architecture Overview

The system follows a producer-consumer pattern to ensure high throughput and reliability:

1.  **Producer (API Service)**: Accepts HTTP requests, validates them, and pushes tasks to a RabbitMQ queue.
2.  **Message Queue (RabbitMQ)**: Buffers messages to handle traffic spikes.
3.  **Consumer (Worker Service)**: Pulls messages from the queue and reliably writes them to the MongoDB database on the cloud ( MongoDB Altas).

For more details, see the [Technologies & Design](docs/TECHNOLOGIES.md) document.
