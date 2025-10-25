# 📝 To-Do List REST API

[![Express](https://img.shields.io/badge/Express-4.x-blue.svg)](https://expressjs.com)

> A RESTful API for managing to-do tasks built with Node.js and Express.js.

## 🎯 Project Overview

This is a simple yet comprehensive REST API that demonstrates all essential CRUD (Create, Read, Update, Delete) operations for managing a to-do list.

### Features

- ✅ **Create** new to-do tasks
- ✅ **Read** all tasks or individual tasks
- ✅ **Update** task details and completion status
- ✅ **Delete** tasks
- ✅ **Filter** tasks by completion status
- ✅ **Bulk operations** (mark all as complete, delete completed tasks)
- ✅ **Input validation** and error handling
- ✅ **RESTful design** following best practices

## 🛠️ Tech Stack

- **Runtime**: Node.js 20.x
- **Framework**: Express.js 4.x
- **Testing**: Insomnia / Postman
- **Data Storage**: In-memory array (upgradeable to MongoDB/PostgreSQL)

## 📦 Installation

### Prerequisites

- [Node.js](https://nodejs.org) (v16 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Git](https://git-scm.com/)

### Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Rubberduckduck/Bryan-TodoList-Fullstack.git
   cd Bryan-TodoList-Fullstack
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Install backend and frontend dependencies**
   ```bash
   cd backend
   npm install
   cd ../frontend
   npm install
   cd ../
   ```

## 🚀 Running the Application

### Option 1: Run Both Frontend and Backend Together

Start both servers simultaneously with a single command:

```bash
npm start
```

This will concurrently run:
- **Backend API** on `http://localhost:8888`
- **Frontend** on `http://localhost:3000`

### Option 2: Run Backend Only

To run and test just the backend API server:

```bash
cd backend
npm start
```

The backend will be available at `http://localhost:8888`.

### Option 3: Run Frontend Only

To run just the frontend application:

```bash
cd frontend
npm start
```

The frontend will be available at `http://localhost:3000`.

## 🧪 Testing the API

Once the backend is running, you can test the API endpoints using:

- [Postman](https://www.postman.com/)
- [Insomnia](https://insomnia.rest/)
- cURL commands

### Example API Request

#### Get All Todos
**Using cURL (Mac/Linux/Git Bash):**
```bash
curl http://localhost:8888/todos
```
**Using PowerShell:**
```Powershell
Invoke-RestMethod -Uri "http://localhost:8888/todos" -Method Get
```

#### Create a New Todo

**Using cURL (Mac/Linux/Git Bash):**
```bash
curl -X POST http://localhost:8888/todos -H "Content-Type: application/json" -d "{\"task\":\"Test1\",\"description\":\"Test1\"}"
```

**Using PowerShell:**
```Powershell
Invoke-RestMethod -Uri "http://localhost:8888/todos" -Method Post -Body '{"task":"Test1","description":"Test1"}' -ContentType "application/json"
```
