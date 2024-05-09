# User Authentication System

This project implements a simple user authentication system using Node.js and MySQL. It provides API endpoints for user registration, login, dashboard access, and token refresh.

## Prerequisites

Before running the project, make sure you have the following installed:

- Node.js: [Download and Install Node.js](https://nodejs.org/)
- XAMPP: [Download and Install XAMPP](https://www.apachefriends.org/index.html)

## Setting Up the Project

1. **Clone the Repository:**
   ```bash
   git clone <repository-url>

2. npm install
3. Start XAMPP:
   Start the Apache and MySQL servers using XAMPP control panel.
4. Set Up MySQL Database:
Access phpMyAdmin via your web browser by navigating to http://localhost/phpmyadmin/.
Create a new database named node-sql
Create a table named users with columns id, username, and password. You can use the provided SQL query in the README.md file.
Configure MySQL Connection:
Open config/db.js and update the MySQL connection settings (host, user, password, database) according to your MySQL configuration.

## Run the Server:
nodemon index.js

 API Endpoints
POST /api/user/register: Register a new user.
POST /api/user/login: Log in with username and password.
GET /api/user/dashboard: Access user dashboard.
POST /api/user/refresh: Refresh authentication token.

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);


