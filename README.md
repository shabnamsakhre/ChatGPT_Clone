# 🧠 ChatGPT Clone

[![React](https://img.shields.io/badge/Frontend-React.js-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![NodeJS](https://img.shields.io/badge/Backend-Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Framework-Express.js-black?logo=express&logoColor=white)](https://expressjs.com/)
[![Socket.io](https://img.shields.io/badge/Realtime-Socket.IO-010101?logo=socket.io&logoColor=white)](https://socket.io/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Status](https://img.shields.io/badge/Status-Live-brightgreen)](https://your-live-link-here.vercel.app)
<!-- [![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE) -->

A **ChatGPT-inspired real-time AI chat application** built using **React, Node.js, Express, and Socket.IO**.  
This project recreates a full ChatGPT-like experience with **real-time communication**, **AI typing loader**, **code highlighting**, and **persistent chat history**.

🔗 **Live Demo:** [ChatGPT Clone - Try it here](https://chatgpt-clone-cpl7.onrender.com)

---

## ✨ Features

- ⚡ **Real-time messaging** via Socket.IO  
- 💬 **Dynamic Markdown rendering** with code syntax highlighting  
- 🤖 **AI typing loader** (three-dot animation while generating responses)  
- 📋 **Copyable code snippets** for AI-generated code snippets with one-click copy button  
- 🧠 **Short-Term & Long-Term Memory Support**
  - **Short-Term Memory:** AI remembers context from the current chat.  
  - **Long-Term Memory:** Previous conversations are stored and retrievable from chat history.  
- 💾 **Full Chat History** — view, continue, and manage all past chats  
- 🔒 **Login & Register** using cookies & JWT authentication  
- 💾 **MongoDB integration** for persistent chats  
- 🌙 **Modern ChatGPT-style dark theme**  
- 📱 **Fully responsive** for all screen sizes  

---

## 🏗️ Tech Stack

### **Frontend**
- ⚛️ React.js (Vite)
- 🎨 Custom CSS with modern dark styling
- 🧩 React Markdown + Remark GFM
- 💻 Socket.IO client

### **Backend**
- 🟢 Node.js + Express.js
- 💬 Socket.IO for real-time updates
- 🍃 MongoDB + Mongoose
- 🔐 JWT Authentication
- ⚙️ REST APIs for chat & auth management

---

## 📂 Project Structure

```

ChatGPT-Clone/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── authController.js
│   │   │   └── chatController.js
│   │   ├── db/
│   │   │   └── db.js
│   │   ├── middlewares/
│   │   │   └── auth.middleware.js
│   │   ├── models/
│   │   │   ├── chat.model.js
│   │   │   ├── message.model.js
│   │   │   └── user.model.js
│   │   ├── routes/
│   │   │   ├── auth.route.js
│   │   │   └── chat.route.js
│   │   ├── services/
│   │   │   ├── ai.service.js
│   │   │   └── vector.service.js
│   │   ├── socket/
│   │   │   └── socket.service.js
│   │   └── app.js
│   ├── .env
│   ├── .gitignore
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChatSection.jsx
│   │   │   ├── FormInput.jsx
│   │   │   └── Sidebar.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── routes/
│   │   │   └── MainRoute.jsx
│   │   ├── styles/
│   │   │   ├── chats/
│   │   │   │   ├── chatSection.css
│   │   │   │   ├── home.css
│   │   │   │   ├── input.css
│   │   │   │   ├── message.css
│   │   │   │   └── sidebar.css
│   │   │   ├── auth.css
│   │   │   ├── button.css
│   │   │   └── theme.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
│
├── README.md
└── package.json

````

---

## ⚙️ Setup Instructions

### 🛠️ Backend Setup

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# Create .env file
PORT=3000
MONGO_URI=mongodb://localhost:27017/chatgpt_clone
JWT_SECRET=yourSecretKey

# Run the server
npm run dev
````

---

### 💻 Frontend Setup

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Run the React app
npm run dev
```

---

## 🔌 Connecting Frontend & Backend

Ensure both frontend and backend are running simultaneously.

The frontend connects automatically to the backend via:

```js
const socket = io("http://localhost:3000", { withCredentials: true });
```

✅ Enable **CORS** on the backend to allow requests from your frontend URL.

---

## 🧠 AI Memory System

### 🕒 Short-Term Memory

  - The AI remembers recent context and maintains conversation flow.
  - Messages are stored temporarily within the current chat session.

### 🗃️ Long-Term Memory

  - The complete conversation is stored in MongoDB.
  - When a chat is reopened, previous messages are fetched automatically.
  - Enables the user to resume past chats anytime.

---

## 💬 Real-Time Chat Flow

1. The user sends a message through the frontend.
2. The message is emitted via `socket.emit("ai-message")`.
3. The backend processes it and responds using `socket.emit("ai-response")`.
4. The frontend displays the AI's formatted response with loader and Markdown rendering.

---

## 🧠 Example AI Response

```js
function greet() {
  console.log("Hello from AI!");
}
greet();
```

✅ Code blocks are syntax highlighted and can be copied with a single click.

---

## 🧩 Environment Variables

**Backend `.env`**

```
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

---

## 📸 UI Preview

### 💬 Chat Interface

* Real-time chat with markdown formatting
* Animated typing loader
* Copyable code snippets
* Smooth scrolling and bubble design

### 🧠 Memory System

* Continue conversations with AI using past chats
* Persistent short-term and long-term memory

### 🔐 Authentication

* Login & Register forms
* Gradient button styling
* Secure JWT-based authentication with cookies

---

## 🔮 Future Enhancements

* 🧍 Add **User Profiles** and Settings
* 🧩 Add **export chat** and **delete chat** features
* 🎤 Enable **voice input and speech output**

---

## 🧰 Useful Commands

| Command         | Description                      |
| --------------- | -------------------------------- |
| `npm run dev`   | Run frontend in development mode |
| `npm run dev`   | Run backend server               |
| `npm install`   | Install dependencies             |
| `npm run build` | Build React app for production   |

---

## 🤝 Contributing

Contributions are welcome!

1. Fork this repository
2. Create your branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "Add new feature"`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request 🚀

---

## 💡 Inspiration

This project is inspired by **OpenAI’s ChatGPT**, created for learning and development purposes — blending **AI**, **real-time systems**, and **frontend UI design**.

---

## 🌐 Live Demo

👉 **Try it now:** [ChatGPT Clone - Live Site](https://chatgpt-clone-cpl7.onrender.com)

---

## 👨‍💻 Author

**Developed by:** Shabnam Rajkumar Sakhre

**GitHub:** https://github.com/shabnamsakhre

**LinkedIn:** www.linkedin.com/in/shabnamsakhre

---
