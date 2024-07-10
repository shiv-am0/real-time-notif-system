# Real-Time Notification System

A real-time notification system that allows users to receive immediate updates. This backend system is designed to be scalable, efficient, and easy to integrate into various applications.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)

## Installation

To install and set up the project locally, follow these steps:

1. **Clone the repository**:
    ```bash
    git clone https://github.com/shiv-am0/real-time-notif-system.git
    cd real-time-notif-system
    ```

2. **Create a `.env` file** at the same level as `src` with the following variables:
    ```plaintext
    PORT=3000
    MONGODB_URI=http://localhost:27017
    JWT_SECRET=your_jwt_secret
    RABBITMQ_URI=amqp://localhost
    SWAGGER_URL=https://localhost:3000
    ```
    Make sure to replace the values with yours.

3. **Install dependencies**:
    ```bash
    npm install
    ```

4. **Run the application**:
    ```bash
    npm start
    ```

## Usage

After setting up the project, you can start using the real-time notification system. Here’s a basic example of how to use it:

1. Head over to the following link to view the real-time streamed messages.
    [https://localhost:3000](https://localhost:3000)

2. Head over to the following link for using the endpoints interactively.
    [https://localhost:3000/api-docs](https://localhost:3000/api-docs)

3. The API routes for different usages are as follows:

    - **Auth Service**
        1. `POST /api/register`: Register a new user.
        2. `POST /api/login`: Login and receive a JWT.
        
    - **Notification Service**
        1. `POST /api/notifications`: Create a new notification for a user. This should push a message to the queue.
        2. `GET /api/notifications`: Get a list of all notifications for the authenticated user.
        3. `GET /api/notifications/:id`: Get details of a specific notification.
        4. `PUT /api/notifications/:id`: Mark a notification as read.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
