# Event Logger API Documentation

# Overview

The Event Logger API provides a RESTful interface for logging and retrieving application events. Events are queued for asynchronous processing and stored in MongoDB for later retrieval.

# Event Resource

An "Event" represents a structured log entry from an application. Each event contains metadata about when and where it occurred, along with custom payload data.

# Testing out API using Postman
Shared testing workspace for Postman: https://web.postman.co/workspace/f5e0e7db-6a52-4c2b-93dc-6c082a27278f
*Remember to configure environment and collection variables in Postman as per previously set up .env file.
*Also remeber to populate database before testing get endpoints.
*Max limit for events returned by GET /events requests is default: 50, max: 100

# Authentication

All API requests require authentication via API key in the `X-API-Key` header. Remember to set up API key in .env as per template.

# Endpoints

# GET /events
Retrieve events from the database with optional filtering and pagination.

Parameters:
- `source` (optional): Filter events by source string
- `type` (optional): Filter events by event type string
- `limit` (optional): Maximum number of events to return (default: 50, max: 100)


Error Codes:
- `400 Bad Request`: Invalid limit parameter (not a positive integer or > 100)
- `401 Unauthorized`: Missing or invalid API key


# GET /events/:eventId
Retrieve a specific event by its unique event ID.

Parameters:
- `eventId` (required): The UUID of the event to retrieve

Error Codes:
- `401 Unauthorized`: Missing or invalid API key
- `404 Not Found`: Event with the specified ID does not exist

# POST /events
Queue a new event for asynchronous processing and storage.

Request Body: JSON
```json
{
  "source": "string (required)",
  "type": "string (required)",
  "payload": "object (required)",
  "timestamp": "string (required, ISO 8601 format)"
}
```

Error Codes:
- `400 Bad Request`: Invalid request body structure or missing required fields
- `401 Unauthorized`: Missing or invalid API key
- `500 Internal Server Error`: Message queue connection issues

# Error Response Format
All errors follow a consistent format:

```json
{
  "status": "error",
  "message": "Error description",
  "errors": ["Detailed error messages"] // Only for validation errors
}
```

# Common Error Codes

Code -> Description 
400 -> Bad Request - Invalid input data or parameters 
401 -> Unauthorized - Missing or invalid API key 
404 -> Not Found - Resource does not exist 
500 -> Internal Server Error - Server-side issues 
503 -> Service Unavailable - External service (RabbitMQ/MongoDB) unavailable 

# Rate Limiting
Currently no rate limiting is implemented. Consider implementing if needed for production use.
