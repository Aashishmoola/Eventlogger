# Technologies & Design Choices

# Technology Stack

This project utilizes a event -driven, microservices-inspired architecture with the following core technologies:

# Runtime & Frameworks
- Node.js: The core backend runtime environment for both the API and Consumer services.
- Express.js: Key web framework used in the API service for checking routes and handling HTTP requests.
  - *Rationale*: Leverages existing team knowledge (previous experience with simple REST APIs) and provides a minimal, flexible foundation for building web services.

# Database & Storage
- MongoDB over PostgreSQL: Native JSON document storage, flexible payload schema without migrations.
- MongoDB Atlas (Cloud Hosted):
  - *Rationale*: A fully managed cloud database ensures data persistence "out of the box" without needing to manage local database storage volumes or backups. It simplifies the local development environment by removing the need for a local database container.
- Mongoose: An Object Data Modeling (ODM) library for MongoDB and Node.js.
  - *Rationale*: Provides schema-based solution to model application data, enforcing structure on the flexible MongoDB documents. Also has in-built validation for injection attacks.

# Message Broker
- RabbitMQ over Kafka: Simpler setup for a logging service, lower resource footprint.
- RabbitMQ: The message broker used for asynchronous communication between the API and Consumer services.
  - *Rationale*: Decouples the ingestion of events (API) from the processing of events (Consumer), allowing the system to handle bursts of traffic without slowing down the HTTP response times. Also allows to cache events when the database is down or connection is lost. This ensures reliability of each event being stored syncronously without being lost. 

# Containerization
- Docker:
  - *Rationale*: Ensures consistency across different development environments. The entire stack (API, Consumer, RabbitMQ) can be spun up with a single command, isolating dependencies and configuration.

# Architecture & Design Choices

1.  Separation of Concerns:
    - The API service is solely responsible for receiving requests, validating input, and publishing messages to the queue. It returns a quick response to the client.
    - The Consumer service handles the heavy lifting of processing those messages and persisting them to the database.

2.  Cloud-First Persistence:
    - By connecting directly to MongoDB Atlas from the local Docker containers, we avoid the complexity of managing persistent volumes for a database in a local container environment.

3.  Environment Configuration:
    - Sensitive data and configuration (API Keys, DB URLs) are managed via `.env` files, keeping them out of the source code.

4.  Robust to services being down/offline:
    - Multiple attempts to connect to RabbitMQ and MongoDB Atlas (5 times, 5 sec delay) before concluding service is unavailable. Checks status of services intermittently to ensure healthy connection. Events persist even if RabbitMQ restarts or MongoDB altas is offline.

5. Message Acknowledgment: 
    Consumer only acknowledges after successful database write.

6. Invalid Message Handling: 
    Malformed or invalid messages are rejected without requeue to prevent infinite loops.
