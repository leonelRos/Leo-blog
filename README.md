# MERN Blog App

A full-stack blog application built with MongoDB, Express, Node.js, and React.

## Live Version
https://main.d3m5e6dq2ibxpo.amplifyapp.com/

## Features
- Create, read, update, and delete blog entries
- Fields: Title, Date, Notes
- Clean editorial UI with toast notifications and confirm dialogs

## Prerequisites
- Node.js (v16+)
- MongoDB running locally on port 27017 (or a MongoDB Atlas URI)

## Project Structure
```
blog-app/
├── server/           # Express + Mongoose API
│   ├── index.js
│   ├── models/Post.js
│   ├── routes/posts.js
│   └── .env.example
└── client/           # React frontend
    └── src/
        ├── App.js
        ├── api.js
        ├── pages/
        │   ├── Home.js
        │   ├── PostForm.js
        │   └── PostDetail.js
        └── components/
            ├── Toast.js
            └── ConfirmModal.js
```

## Setup & Run

### 1. Install dependencies
```bash
# From root
npm install
npm run install:all
```

### 2. Configure the server
```bash
cd server
cp .env.example .env
# Edit .env if needed (default: mongodb://localhost:27017/blogdb)
```

### 3. Start both servers
```bash
# From root — runs server (port 5000) + React (port 3000) together
npm run dev
```

Or run separately:
```bash
npm run server   # API only
npm run client   # React only
```

### 4. Open the app
Visit **http://localhost:3000**

## API Endpoints
| Method | Endpoint         | Description        |
|--------|------------------|--------------------|
| GET    | /api/posts       | Get all posts      |
| GET    | /api/posts/:id   | Get single post    |
| POST   | /api/posts       | Create a post      |
| PUT    | /api/posts/:id   | Update a post      |
| DELETE | /api/posts/:id   | Delete a post      |

## Using MongoDB Atlas (Cloud)
Replace `MONGO_URI` in `server/.env` with your Atlas connection string:
```
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/blogdb
```