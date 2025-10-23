# Business Card Parser

This project is a business card parser that leverages AI to extract information from business cards and store it in a structured format. It showcases a combination of backend, DevOps, and AI skills.

## Features

*   **Upload Business Card Images:** Users can upload images of business cards.
*   **AI-Powered Information Extraction:** The application uses AI to parse the uploaded images and extract key information such as name, title, company, phone number, email, and website.
*   **Google Sheets Integration:** The extracted information is automatically saved to a Google Sheet for easy access and management.
*   **Cloud-Native Deployment:** The application is designed to be deployed on Google Cloud Platform using Docker and Google Cloud Build.

## Tech Stack

*   **Frontend:** Next.js, React, TypeScript, Tailwind CSS
*   **Backend:** Next.js API Routes, Node.js
*   **AI:** OpenAI Vision for image parsing
*   **Database:** Google Sheets
*   **DevOps:** Docker, Google Cloud Build, Google Cloud Run

## Getting Started

### Prerequisites

*   Node.js
*   pnpm
*   Google Cloud SDK

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/business-card-parser.git
    ```
2.  Install the dependencies:
    ```bash
    pnpm install
    ```
3.  Set up your environment variables by copying `.env.example` to `.env` and filling in the required values.
4.  Run the development server:
    ```bash
    pnpm dev
    ```

### Deployment

The application can be deployed to Google Cloud Run using the provided `cloudbuild.yaml` file.

## Project Structure

*   `app/`: Contains the Next.js application code.
*   `app/api/`: Contains the API routes for handling file uploads, AI processing, and Google Sheets integration.
*   `components/`: Contains the React components used in the application.
*   `lib/`: Contains the core logic for interacting with Google APIs and OpenAI.
*   `cloudbuild.yaml`: Configuration file for Google Cloud Build.
*   `Dockerfile`: Dockerfile for building the application container.
