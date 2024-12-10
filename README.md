# OSINT Harvester (Ktor + React)

This project is a web application that integrates **OSINT (Open Source Intelligence) harvesting** tools. The backend is built with **Ktor** (Kotlin) and provides API endpoints to interact with the frontend built using **React** and **Vite**. Both the frontend and backend can be run locally and are also dockerized for easy deployment.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Setting up the Backend](#setting-up-the-backend)
3. [Setting up the Frontend](#setting-up-the-frontend)
4. [API Documentation](#api-documentation)

---

## Prerequisites

Before running the project, ensure you have the following installed:

- **Docker** (for containerized deployment)
- **Java 20** or higher (for the Ktor backend)
- **Node.js** (for React/Vite frontend)
- **Git** (to clone the repository)

### For Running Locally:

- **Gradle** (for Kotlin-based backend)
- **npm** (for managing React/Vite dependencies)

---

## Setting up the Backend

1. **Clone the repository**:
   ```bash
   git clone https://github.com/morningstar2049/React-Kotlin-OSINT.git
   cd React-Kotlin-OSINT
   ```
2. **Set up theHarvester**:
   Build Harvester Docker image to be able to use it later from back-end
   ```bash
   cd React-Kotlin-OSINT
   docker build -t theharvester:latest -f Dockerfile.theharvester .
   ```
3. **Navigate to back-end folder and run it locally**:
   ```bash
   cd ktor-harvester
   ./gradlew build
   ./gradlew run
   ```
   The backend should now be running on http://localhost:8080.
4. **Dockerize the back-end()**:
   You can also run the back-end in Docker container, but scanning the domain will not work, as I could not figure out how to run docker command inside Docker container(back-end uses docker to run theHarvester). **Possible fix is to use dind(docker-in-docker) image**
   ```bash
   docker build -t ktor-backend .
   docker run -p 8080:8080 ktor-backend
   ```
   The backend should now be running on http://localhost:8080.

## Setting up the Frontend

1. **Navigate to the frontend directory and run it locally**:

   ```bash
   cd ..
   cd ./OSINT-web
   npm install
   npm run dev
   ```

   The frontend should now be running on http://localhost:5173.

2. **Dockerize the Frontend**:
   ```bash
   docker build -t frontend .
   docker run -p 5173:80 frontend
   ```
   The frontend should now be running on http://localhost:5173.

## API Documentation

### Endpoints

### POST /scan

- **Description**: Initiates a domain scan.
- **Request Body**:
  - `domain`: The domain to scan (required).
- **Response**:
  - **200 OK**: Scan initiated successfully.
  - **400 Bad Request**: Invalid input or missing domain.
  - **500 Internal Server Error**: Error during the scan process.

#### GET /scan-history

- **Description**: Retrieves the results of past scans.
- **Parameters**:
  - None
- **Response**:
  - **200 OK**: Returns the scan results.
    - Example Response:
      ```json
      {
        "id": 1,
        "domain": "example.com",
        "result": "Scan result data here",
        "startTime": "2024-12-10T10:00:00",
        "endTime": "2024-12-10T10:05:00"
      }
      ```
  - **404 Not Found**: If there are no scans available.
  - **500 Internal Server Error**: Error retrieving the scan result.
