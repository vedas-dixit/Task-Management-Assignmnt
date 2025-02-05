# Task Manager Application(Assignment: BaseRock Assignment: "Task Mgmt Dashboard")

#Project is deployed on vercel: https://task-management-assignmnt.vercel.app/

A **Task Manager Application** built using **React, TypeScript, and Axios** for seamless API communication. This application enables users to manage tasks efficiently with features like task creation, editing, deletion, reordering, and a smooth drag-and-drop experience.

## 🚀 Features

### 📌 Task Management
- ✅ **Create** new tasks with a title, description, and status.
- ✏️ **Update** existing tasks (edit title, description, or status).
- ❌ **Delete** tasks.
- 🔄 **Toggle** task status between **PENDING** and **COMPLETED**.

### 🎯 Drag-and-Drop Functionality
- 🔀 **Reorder** tasks effortlessly using **react-beautiful-dnd**.

### 🔍 Search Functionality
- 🔎 **Search** tasks quickly by title.

### 🌙 Dark Mode
- 🌗 **Toggle** between **light** and **dark** themes for an enhanced user experience.

### ✅ Validation
- 🚨 Ensures task titles are **not empty** before creating or updating tasks.

### 🌐 API Integration
- 📡 **Fetch** tasks from a backend API.
- 📥 **Create**, 📝 **update**, and 🗑️ **delete** tasks using API endpoints.

## 🛠️ Technologies Used
- **React** (for building the user interface)
- **TypeScript** (for type safety and maintainability)
- **Axios** (for API communication)
- **react-beautiful-dnd** (for drag-and-drop functionality)
- **Styled Components / Tailwind CSS** (for styling)



## 🚀 Getting Started
### 🔧 Installation
1. Clone the repository:
   ```sh
   git clone https://github.com/vedas-dixit/Task-Management-Assignmnt.git
   ```
2. Navigate to the project folder:
   ```sh
   cd task-manager
   ```
3. Install dependencies:
   ```sh
   npm install
   ```

### ▶️ Running the Application

Add this to .env.local file: NEXT_PUBLIC_BASE_URL: NEXT_PUBLIC_BASE_URL=https://67a232f8409de5ed5254a352.mockapi.io/tasks

Start the development server:
```sh
npm run dev
```

## 🖥️ API Endpoints
| Method | Endpoint       | Description                 |
|--------|---------------|-----------------------------|
| GET    | `/tasks`      | Fetch all tasks            |
| POST   | `/tasks`      | Create a new task          |
| PUT    | `/tasks/:id`  | Update an existing task    |
| DELETE | `/tasks/:id`  | Delete a task              |
