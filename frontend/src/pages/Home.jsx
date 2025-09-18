import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatSection from "../components/ChatSection";
import "../styles/chats/home.css";

const Home = () => {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);

  // Default chat
  useEffect(() => {
    if (chats.length === 0) {
      const defaultChat = {
        id: Date.now(),
        title: "Welcome Chat",
        messages: [],
      };
      setChats([defaultChat]);
      setActiveChat(defaultChat.id);
    }
  }, []);

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
      <ChatSection chats={chats} setChats={setChats} activeChat={activeChat} />
    </div>
  );
};

export default Home;
