# Local Setup & Installation

This guide will help you set up and run the Event Logger project locally using Docker and Docker Compose.

# Prerequisites

- Docker Desktop (or Docker Engine + Compose) installed and running.
- Git for cloning the repository.
- A MongoDB Atlas account and connection string.

# Installation Steps

1. Clone the Repository

```bash
git clone <repository_url>
cd <repository_folder>
```

2. Configure Environment Variables

The project requires an `.env` file in the root directory. A template has been provided or you can create one based on the example below.

Create a file named `.env` in the root:

```ini
# API Service Configuration
API_PORT=3000 # Port to be used locally
API_KEY= example@key # Set up here and use in `X-API-Key` header when sending a request throgh the API using Postman or Curl.

# RabbitMQ Configuration

# Internal Docker Network URL
RABBITMQ_URL=amqp://guest:guest@rabbitmq:5672
RABBITMQ_USER=guest # default username
RABBITMQ_PASS=guest # default password

# Queue Configuration
QUEUE_NAME=events #default queue name 

# MongoDB Configuration
# NOTE: Ensure your MongoDB Atlas Network Access allows connections from your IP, # "main" in url refers to DB name default in cluster, under which events are being stored.
MONGODB_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/main?appName=EventLogger #template url

```

Important Notes:
- MongoDB URL: Since the application runs inside Docker, the `MONGODB_URL` must point to the remote Atlas instance. Ensure your IP address is whitelisted in MongoDB Atlas Network Access.


3. Build and Run with Docker Compose

# Run the entire stack (API, Consumer, RabbitMQ) using Docker Compose:
- This will start
    - RabbitMQ on port 5672 (management UI on port 15672)
    - MongoDB on port 27017
    - API service on port 3000 (default)
    - Consumer service

- Run this command:
```bash
docker-compose up --build
```

- `--build`: Forces a rebuild of the images if you have made changes to the code.
- Add `-d` to run in detached mode (background).

# To stop containers:
- CTRL + C (if required to get back terminal prompt)
- Run this commmand:
```bash
docker-compose down
```


4. Verify Services

- API: Accessible at `http://localhost:3000`.
- RabbitMQ Management: Accessible at `http://localhost:15672` (User: `guest` as default, Password: `guest` as default).

# Connecting to MongoDB Atlas

1.  Log in to your [MongoDB Atlas Dashboard](https://cloud.mongodb.com/).
2.  Navigate to "Network Access" and select "Add IP Address". You can choose "Add Current IP Address" or "Allow Access from Anywhere" (for development only).
3.  Navigate to "Database" -> "Connect" -> "Drivers".
4.  Copy the connection string and replace the `<password>` placeholder with your actual database user password.
5.  Paste this into your `.env` file for `MONGODB_URL`.

# Testing out API using Postman
Refer to (docs/API_DOCUMENTATION.md).

