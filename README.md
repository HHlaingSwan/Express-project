# Subscribe Tracker

Subscribe Tracker is a backend application built with Node.js and Express that allows users to manage their subscriptions. It provides functionalities for user authentication, creating, reading, updating, and deleting subscriptions. It also includes a workflow for handling recurring billing cycles using Upstash.

## Features

*   User registration and login
*   JWT-based authentication
*   CRUD operations for subscriptions
*   Recurring billing workflow with Upstash
*   Security with Arcjet
*   MongoDB database integration

## Tech Stack

*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB (with Mongoose)
*   **Authentication:** JSON Web Tokens (jsonwebtoken)
*   **Security:** Arcjet
*   **Workflow:** Upstash
*   **Environment Variables:** dotenv

## Getting Started

### Prerequisites

*   Node.js (v14 or later)
*   MongoDB
*   An Upstash account
*   An Arcjet account

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/subscribe-tracker.git
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```
3.  Create a `.env.development.local` file in the root directory and add the following environment variables:

    ```
    PORT=3000
    MONGODB_URI=<your-mongodb-uri>
    JWT_SECRET=<your-jwt-secret>
    JWT_EXPIRES_IN=1d
    ARCJET_KEY=<your-arcjet-key>
    QSTASH_URL=<your-qstash-url>
    QSTASH_TOKEN=<your-qstash-token>
    SERVER_URL=http://localhost:3000
    ```

### Running the Application

```bash
npm start
```

For development mode with auto-reloading:

```bash
npm run dev
```

## API Endpoints

### Authentication

*   `POST /api/v1/auth/register`: Register a new user.
*   `POST /api/v1/auth/login`: Login a user.
*   `POST /api/v1/auth/logout`: Logout a user.

### User

*   `GET /api/v1/user/profile`: Get user profile.
*   `PUT /api/v1/user/profile`: Update user profile.
*   `DELETE /api/v1/user`: Delete a user.

### Subscriptions

*   `POST /api/v1/subscriptions`: Add a new subscription.
*   `GET /api/v1/subscriptions`: Get all subscriptions for a user.
*   `GET /api/v1/subscriptions/:id`: Get a specific subscription.
*   `PUT /api/v1/subscriptions/:id`: Update a subscription.
*   `DELETE /api/v1/subscriptions/:id`: Delete a subscription.

### Workflow

*   `POST /api/v1/workflow/create`: Create a subscription workflow.
*   `POST /api/v1/workflow/subscription-callback`: Callback for the subscription workflow.
