# Documenso API Integration - Full-Stack PoC

This project is a fully functional Proof of Concept (PoC) that demonstrates how to integrate a self-hosted Documenso instance with a React frontend and a Node.js/Express backend.

The backend securely handles all API communication with Documenso and manages file uploads to a local S3-compatible storage (MinIO), which is the recommended security pattern.

## Features

- **React Frontend**: A clean UI to upload a PDF and specify two signers.
- **Node.js/Express Backend**: A secure proxy that handles file uploads and all Documenso API interactions.
- **MinIO for Storage**: Uploads documents to a self-hosted S3-compatible storage solution.
- **Documenso Embed SDK**: Uses `@documenso/embed-react` to display the signing interface directly in the frontend.

## Prerequisites

Before you begin, ensure you have the following installed and running:

- **Node.js**: v18 or later.
- **Docker & Docker Compose**: To run Documenso and MinIO.
- **Running Documenso Instance**: You must have a self-hosted Documenso instance running. You can set one up easily using the official `docker-compose.yml` from the Documenso repository.
- **Running MinIO Instance**: A local S3-compatible object storage. You can run it with the following Docker command:

    ```bash
    docker run \
         -p 9000:9000 \
         -p 9001:9001 \
         --name minio \
         -e "MINIO_ROOT_USER=YOUR_ACCESS_KEY" \
         -e "MINIO_ROOT_PASSWORD=YOUR_SECRET_KEY" \
         minio/minio server /data --console-address ":9001"
    ```

- **MinIO Bucket**: After starting MinIO, navigate to http://localhost:9001, log in, and create a new bucket. Set its access policy to Public.

## Setup

1. Clone the repository:
     ```bash
     git clone <repository_url>
     cd documenso-poc
     ```

2. Install dependencies:
     ```bash
     npm install
     ```

3. Configure Environment Variables:
     - Create a `.env` file in the root of the project by copying the example file:
         ```bash
         cp .env.example .env
         ```
     - Now, open the `.env` file and fill in the values based on your Documenso and MinIO setup.

## Running the Application

This application consists of a Node.js backend and a React frontend. The start script will run them both concurrently.

```bash
npm start
```

- The Backend Server will start on http://localhost:3001.
- The React Dev Server will start on http://localhost:5173.

Open your web browser and navigate to http://localhost:5173.

## How to Use

1. Make sure your Documenso and MinIO containers are running.
2. Navigate to the application URL in your browser.
3. Use the form to select a PDF file from your computer.
4. Enter the names and email addresses for the two signers.
5. Click "Create & Sign Document".
6. The backend will upload the file, create the document in Documenso, and retrieve a signing token for the first signer.
7. The Documenso signing interface will be embedded directly on the page for the first user to sign.
