import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatSection from "../components/ChatSection";
import "../styles/chats/home.css";

const Home = () => {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);

  // Default chat
  useEffect(() => {}, []);

  // Now accepts title from Sidebar
  const handleNewChat = (title) => {
    const newChat = {
      id: Date.now(),
      title: title || "New Chat",
      messages: [],
    };
    setChats([newChat, ...chats]);
    setActiveChat(newChat.id);
  };

  return (
    <div className="home-container">
      <Sidebar
        chats={chats}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
        handleNewChat={handleNewChat}
      />

      {chats.length === 0 ? (
        <div className="empty-chat">
          <h1 className="welcome-title">ChatGPT Clone</h1>
          <p className="welcome-subtitle">
            Your AI assistant is ready to help you.
          </p>

          <div className="welcome-examples">
            <div className="example">
              💡 Explain a complex topic in simple words
            </div>
            <div className="example">📄 Generate a professional email</div>
            <div className="example">💻 Help me debug a piece of code</div>
          </div>
        </div>
      ) : (
        <ChatSection
          chats={chats}
          setChats={setChats}
          activeChat={activeChat}
        />
      )}
    </div>
  );
};

export default Home;
