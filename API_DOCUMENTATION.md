# Real-Time Chat API Documentation

This document provides a comprehensive overview of the Real-Time Chat API, including its RESTful endpoints and Socket.IO events.

## Technologies Used

*   **Node.js**: JavaScript runtime environment.
*   **Express.js**: Web application framework for Node.js.
*   **Sequelize**: ORM for Node.js, used with MySQL (or SQLite for testing).
*   **Socket.IO**: Library for real-time, bidirectional, event-based communication.
*   **JWT (JSON Web Tokens)**: For authentication.
*   **Bcrypt.js**: For password hashing.

## Authentication

This API uses JWT (JSON Web Tokens) for authentication. After a successful login, the API returns a token that must be included in the `Authorization` header of subsequent requests in the format `Bearer <token>`.

### Error Handling

API errors are returned with a `success: false` flag, an `error` message, and an appropriate HTTP status code.

Example Error Response:

```json
{
  "success": false,
  "error": "Invalid credentials"
}
```

## API Endpoints

### Authentication Routes (`/auth`)

#### 1. User Registration (Signup)

*   **HTTP Method**: `POST`
*   **Endpoint**: `/auth/signup`
*   **Description**: Registers a new user.
*   **Request Body**:

    ```json
    {
      "username": "string",
      "email": "string (email format)",
      "password": "string (min 6 characters)"
    }
    ```

*   **Success Response (201 Created)**:

    ```json
    {
      "success": true,
      "data": {
        "id": "number",
        "username": "string",
        "email": "string",
        "created_at": "datetime"
      }
    }
    ```

*   **Error Responses**:
    *   `422 Unprocessable Entity`: If validation fails (e.g., invalid email, password too short, missing username).
    *   `500 Internal Server Error`: If email is already in use or other server errors.

*   **Example Usage (cURL)**:

    ```bash
    curl -X POST \
  http://localhost:3000/auth/signup \
  -H 'Content-Type: application/json' \
  -d '{ \
    "username": "testuser", \
    "email": "test@example.com", \
    "password": "password123" \
  }'
    ```

*   **Example Usage (JavaScript Fetch)**:

    ```javascript
    fetch('http://localhost:3000/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      }),
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
    ```

#### 2. User Login

*   **HTTP Method**: `POST`
*   **Endpoint**: `/auth/login`
*   **Description**: Authenticates a user and returns a JWT token.
*   **Request Body**:

    ```json
    {
      "email": "string (email format)",
      "password": "string"
    }
    ```

*   **Success Response (200 OK)**:

    ```json
    {
      "success": true,
      "data": {
        "token": "string (JWT token)"
      }
    }
    ```

*   **Error Responses**:
    *   `401 Unauthorized`: If invalid credentials (email not found or incorrect password).
    *   `422 Unprocessable Entity`: If validation fails (e.g., invalid email, missing password).

*   **Example Usage (cURL)**:

    ```bash
    curl -X POST \
  http://localhost:3000/auth/login \
  -H 'Content-Type: application/json' \
  -d '{ \
    "email": "test@example.com", \
    "password": "password123" \
  }'
    ```

*   **Example Usage (JavaScript Fetch)**:

    ```javascript
    fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'test@example.com',
        password: 'password123',
      }),
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
    ```

### User Routes (`/users`)

#### 1. Get Current User's Profile

*   **HTTP Method**: `GET`
*   **Endpoint**: `/users/me`
*   **Description**: Retrieves the profile information of the authenticated user.
*   **Headers**:
    *   `Authorization`: `Bearer <token>`
*   **Success Response (200 OK)**:

    ```json
    {
      "success": true,
      "data": {
        "id": "number",
        "username": "string",
        "email": "string",
        "created_at": "datetime"
      }
    }
    ```

*   **Error Responses**:
    *   `401 Unauthorized`: If no token is provided or the token is invalid.
    *   `404 Not Found`: If the user associated with the token is not found.

*   **Example Usage (cURL)**:

    ```bash
    curl -X GET \
  http://localhost:3000/users/me \
  -H 'Authorization: Bearer <your_jwt_token>'
    ```

*   **Example Usage (JavaScript Fetch)**:

    ```javascript
    const token = 'your_jwt_token';
    fetch('http://localhost:3000/users/me', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
    ```

#### 2. Get Current User's Conversations

*   **HTTP Method**: `GET`
*   **Endpoint**: `/users/me/conversations`
*   **Description**: Retrieves all conversations involving the authenticated user.
*   **Headers**:
    *   `Authorization`: `Bearer <token>`
*   **Success Response (200 OK)**:

    ```json
    {
      "success": true,
      "data": [
        {
          "id": "number",
          "user1_id": "number",
          "user2_id": "number",
          "created_at": "datetime",
          "user1": {
            "id": "number",
            "username": "string"
          },
          "user2": {
            "id": "number",
            "username": "string"
          }
        }
      ]
    }
    ```

*   **Error Responses**:
    *   `401 Unauthorized`: If no token is provided or the token is invalid.

*   **Example Usage (cURL)**:

    ```bash
    curl -X GET \
  http://localhost:3000/users/me/conversations \
  -H 'Authorization: Bearer <your_jwt_token>'
    ```

*   **Example Usage (JavaScript Fetch)**:

    ```javascript
    const token = 'your_jwt_token';
    fetch('http://localhost:3000/users/me/conversations', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
    ```

#### 3. Get All Users with Online Status

*   **HTTP Method**: `GET`
*   **Endpoint**: `/users`
*   **Description**: Retrieves a list of all registered users, indicating their online status.
*   **Headers**:
    *   `Authorization`: `Bearer <token>`
*   **Success Response (200 OK)**:

    ```json
    {
      "success": true,
      "data": [
        {
          "id": "number",
          "username": "string",
          "email": "string",
          "created_at": "datetime",
          "online": "boolean"
        }
      ]
    }
    ```

*   **Error Responses**:
    *   `401 Unauthorized`: If no token is provided or the token is invalid.

*   **Example Usage (cURL)**:

    ```bash
    curl -X GET \
  http://localhost:3000/users \
  -H 'Authorization: Bearer <your_jwt_token>'
    ```

*   **Example Usage (JavaScript Fetch)**:

    ```javascript
    const token = 'your_jwt_token';
    fetch('http://localhost:3000/users', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
    ```

### Conversation Routes (`/conversations`)

#### 1. Get Conversation Messages

*   **HTTP Method**: `GET`
*   **Endpoint**: `/conversations/:conversationId/messages`
*   **Description**: Retrieves messages for a specific conversation.
*   **URL Parameters**:
    *   `conversationId`: `number` (ID of the conversation)
*   **Query Parameters**:
    *   `limit`: `number` (Optional, default: 20, max: 100) - Number of messages to retrieve.
    *   `offset`: `number` (Optional, default: 0) - Number of messages to skip.
*   **Headers**:
    *   `Authorization`: `Bearer <token>`
*   **Success Response (200 OK)**:

    ```json
    {
      "success": true,
      "data": [
        {
          "id": "number",
          "conversation_id": "number",
          "sender_id": "number",
          "content": "string",
          "created_at": "datetime",
          "sender": {
            "id": "number",
            "username": "string"
          }
        }
      ]
    }
    ```

*   **Error Responses**:
    *   `401 Unauthorized`: If no token is provided or the token is invalid.
    *   `404 Not Found`: If the conversation is not found.
    *   `422 Unprocessable Entity`: If validation fails (e.g., invalid `conversationId`, `limit`, or `offset`).

*   **Example Usage (cURL)**:

    ```bash
    curl -X GET \
  http://localhost:3000/conversations/1/messages?limit=10&offset=0 \
  -H 'Authorization: Bearer <your_jwt_token>'
    ```

*   **Example Usage (JavaScript Fetch)**:

    ```javascript
    const token = 'your_jwt_token';
    const conversationId = 1;
    const limit = 10;
    const offset = 0;
    fetch(`http://localhost:3000/conversations/${conversationId}/messages?limit=${limit}&offset=${offset}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
    ```

## Socket.IO Events

Socket.IO is used for real-time communication, primarily for sending and receiving messages, and for user online status updates.

### Authentication

Clients must provide a JWT token in the `auth` object when connecting to the Socket.IO server:

```javascript
const socket = io('http://localhost:3000', {
  auth: {
    token: 'your_jwt_token'
  }
});
```

### Events

#### 1. `user_status_changed`

*   **Description**: Emitted when a user comes online or goes offline.
*   **Payload**:

    ```json
    {
      "userId": "number",
      "online": "boolean"
    }
    ```

*   **Example Usage (Client-side)**:

    ```javascript
    socket.on('user_status_changed', (data) => {
      console.log(`User ${data.userId} is now ${data.online ? 'online' : 'offline'}`);
    });
    ```

#### 2. `join_conversation`

*   **Description**: Client emits this event to join a specific conversation room to receive messages for that conversation.
*   **Payload**:

    ```json
    {
      "conversationId": "number"
    }
    ```

*   **Example Usage (Client-side)**:

    ```javascript
    socket.emit('join_conversation', 123); // Join conversation with ID 123
    ```

#### 3. `send_message`

*   **Description**: Client emits this event to send a new message.
*   **Payload**:

    ```json
    {
      "conversationId": "number",
      "recipientId": "number",
      "content": "string"
    }
    ```

*   **Example Usage (Client-side)**:

    ```javascript
    socket.emit('send_message', {
      conversationId: 123,
      recipientId: 456,
      content: 'Hello there!'
    });
    ```

#### 4. `receive_message`

*   **Description**: Server emits this event to all participants in a conversation when a new message is sent.
*   **Payload**:

    ```json
    {
      "id": "number",
      "conversationId": "number",
      "senderId": "number",
      "content": "string",
      "createdAt": "datetime"
    }
    ```

*   **Example Usage (Client-side)**:

    ```javascript
    socket.on('receive_message', (message) => {
      console.log('New message received:', message);
    });
    ```

#### 5. `message_error`

*   **Description**: Server emits this event if there's an error sending a message.
*   **Payload**:

    ```json
    "string (error message)"
    ```

*   **Example Usage (Client-side)**:

    ```javascript
    socket.on('message_error', (errorMessage) => {
      console.error('Message error:', errorMessage);
    });
    ```

## Database Schema

The application uses a MySQL database (or SQLite for testing) with the following main tables:

### `users` Table

Stores user account information.

| Column Name   | Type      | Description                  |
| :------------ | :-------- | :--------------------------- |
| `id`          | INTEGER   | Primary Key, Auto-increment  |
| `username`    | VARCHAR   | Unique username              |
| `email`       | VARCHAR   | Unique email address         |
| `password_hash` | VARCHAR   | Hashed password              |
| `created_at`  | DATETIME  | Timestamp of user creation   |

### `conversations` Table

Stores information about conversations between two users.

| Column Name   | Type      | Description                  |
| :------------ | :-------- | :--------------------------- |
| `id`          | INTEGER   | Primary Key, Auto-increment  |
| `user1_id`    | INTEGER   | Foreign Key to `users.id`    |
| `user2_id`    | INTEGER   | Foreign Key to `users.id`    |
| `created_at`  | DATETIME  | Timestamp of conversation creation |

### `messages` Table

Stores individual messages within conversations.

| Column Name     | Type      | Description                  |
| :-------------- | :-------- | :--------------------------- |
| `id`            | INTEGER   | Primary Key, Auto-increment  |
| `conversation_id` | INTEGER   | Foreign Key to `conversations.id` |
| `sender_id`     | INTEGER   | Foreign Key to `users.id` (sender of the message) |
| `content`       | TEXT      | Message content              |
| `created_at`    | DATETIME  | Timestamp of message creation |
