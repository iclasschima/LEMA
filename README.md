# My Full-Stack Application

This repository contains a full-stack application, comprising a React frontend and a Node.js (Express) backend. The application is designed to showcase user management and post creation functionalities, with a focus on a responsive and smooth user experience.

## Table of Contents

1. [Features](#features)
2. [Technologies Used](#technologies-used)
3. [Prerequisites](#prerequisites)
4. [Setup Instructions](#setup-instructions)
   - [Cloning the Repository](#cloning-the-repository)
   - [Backend Setup](#backend-setup)
   - [Frontend Setup](#frontend-setup)
5. [Running the Application](#running-the-application)
   - [Start Backend](#start-backend)
   - [Start Frontend](#start-frontend)
6. [API Usage](#api-usage)
7. [Testing](#testing)
8. [Deployment](#deployment)
   - [Frontend Deployment](#frontend-deployment)
   - [Backend Deployment](#backend-deployment)
9. [Code Style and Formatting](#code-style-and-formatting)
10. [Contributing](#contributing)
11. [License](#license)

---

## Features

- **User Management**: Display a list of users.
- **Post Creation**: Create new posts via a modal interface with character limits and validation.
- **Post Deletion**: Delete existing posts (with toast notifications for feedback).
- **User-to-Posts Navigation**: Navigate from a user's table row to their associated posts.
- **Responsive UI**: Designed to work across various devices.

---

## Technologies Used

### Frontend

- **React**: A JavaScript library for building user interfaces.
- **TypeScript**: A superset of JavaScript that adds static typing.
- **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
- **Axios**: Promise-based HTTP client for making API requests.
- **React Query**:

### Backend

- **Node.js**: JavaScript runtime environment.
- **Express.js**: Fast, unopinionated, minimalist web framework for Node.js.
- **TypeScript**: For type-safe backend development.
- **SQLite3**: Lightweight, file-based database.
- **sqlite3 (Node.js driver)**: For interacting with SQLite databases.

---

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js**: v14.x or higher (LTS recommended)
- **npm** or **pnpm** (recommended): Node.js package manager

To install `pnpm`:

```bash
npm install -g pnpm
```

## Setup Instructions

### Cloning the Repository

To get started, clone the repository to your local machine:

```bash
git clone https://github.com/iclasschima/LEMA.git
cd LEMA
```

### Backend Setup

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install the required dependencies:

   ```bash
   pnpm install
   ```

3. Start the backend server:
   ```bash
   pnpm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install the required dependencies:

   ```bash
   pnpm install
   ```

3. Start the frontend development server:
   ```bash
   pnpm run dev
   ```

---

Once both the backend and frontend servers are running, you can access the application in your browser at `http://localhost:3000` (or the port specified in your frontend configuration).

For more details on running the application, refer to the [Running the Application](#running-the-application) section.

## API Usage

### Base URL

The API is hosted at `http://localhost:3001/`

### Endpoints

#### Users

- **GET** `api//users`: Fetch a list of all users.

  - **Response**:

    ```json
    [
      {
        "id": 1,
        "name": "John Doe",
        "email": "john.doe@example.com",
        "address": {
          "city": "Mexico Beach",
          "street": "2802 US Highway 98"
        }
      }
    ]
    ```

#### Posts

- **GET** `/posts`: Fetch a list of all posts.

  - **Response**:
    ```json
    [
      {
        "id": 1,
        "userId": 1,
        "content": "This is a sample post."
      }
    ]
    ```

- **POST** `/posts`: Create a new post.

  - **Request Body**:

    ```json
    {
      "userId": 1,
      "title": "Sample post",
      "body": "This is a sample post."
    }
    ```

  - **Response**:
    ```json
    {
      "id": 1,
      "userId": 1,
      "title": "Sample post",
      "body": "This is a sample post."
    }
    ```

- **DELETE** `/posts/:id`: Delete a post by ID.
  - **Response**:
    ```json
    {
      "message": "Post deleted successfully."
    }
    ```
