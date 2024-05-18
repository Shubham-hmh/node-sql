# Hospital  System

This project implements a simple user authentication system using Node.js and MySQL. It provides API endpoints .

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

## API Endpoints
POST http://localhost:5000/api/patient/register : register patients by psychiatrist
POST http://localhost:5000/api/patient/hospital-details  : Fetch all the psychiatrists, their count along with IDs and patient details for a hospital.



