import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react"; // icons
import "../styles/chats/sidebar.css";
import Cookies from "js-cookie";

import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Sidebar = ({
  chats,
  activeChat,
  setActiveChat,
  handleNewChat,
  getMessages,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [token, setToken] = useState(null);
  const navigate = useNavigate();
  const [user, setUser] = useState("");

  // Ask for chat title when creating new chat
  const createNewChat = async () => {
    const title = prompt("Enter a title for your new chat:");

    if (title && title.trim() !== "") {
      const response = await axios.post(
        "http://localhost:3000/api/chat",
        { title },
        { withCredentials: true }
      );

      if (response.status === 201) {
        toast.success(response.data.message + " 🎉", { theme: "dark" });

        handleNewChat(response.data);
        setIsOpen(false);
      } else {
        toast.error("Something went wrong!", { theme: "dark" });
      }
    } else toast.warn("Chat title cannot be empty.", { theme: "dark" });
  };

  // Close sidebar when pressing ESC
  useEffect(() => {
    setToken(Cookies.get("token"));
    setUser(JSON.parse(Cookies.get("user")));

    const handleEsc = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [token]);

  const handleLogout = async () => {
    console.log("Hello");

    const response = await axios.get("http://localhost:3000/api/auth/logout");

    if (response.status === 200) {
      toast.success(response.data.message, { theme: "dark" });

      Cookies.remove("token");
      Cookies.remove("user");
      setToken(null);
      navigate("/login");
    } else {
      toast.error("Something went wrong!", { theme: "dark" });
    }
  };

  return (
    <>
      {/* Hamburger button for mobile */}
      <button
        className="hamburger"
        onClick={() => setIsOpen(true)}
        aria-label="Toggle Sidebar"
      >
        <Menu size={22} />
      </button>

      {/* Overlay (visible only when open) */}
      {isOpen && (
        <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />
      )}

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        {/* Close button (visible on mobile when open) */}
        <div className="sidebar-top">
          <button
            className={`sidebar-btn newChat-button button ${
              !token ? "disabled" : ""
            }`}
            disabled={!token}
            onClick={createNewChat}
          >
            {/* ＋ New chat */}
            <span className="text">+ New Chat</span>
          </button>

          {/* Close button (mobile only) */}
          <button className="close-btn" onClick={() => setIsOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-chats">
          <h4>Chats</h4>
          {chats.length === 0 ? (
            <div>
              <p className="welcome-subtitle">No chats yet.</p>
            </div>
          ) : (
            chats.map((chat) => (
              <div
                key={chat._id}
                className={`chat-item ${
                  activeChat === chat._id ? "active" : ""
                }`}
                onClick={() => {
                  setActiveChat(chat._id);
                  setIsOpen(false); // close sidebar after selection
                  getMessages(chat._id);
                }}
              >
                {chat.title.length > 30
                  ? chat.title.slice(0, 30) + "..."
                  : chat.title}
              </div>
            ))
          )}
        </div>

        <div className="sidebar-footer">
          {token ? (
            <div className="profile-section">
              <div className="profile">
                <span className="avatar">
                  {user.firstName[0].toUpperCase()}
                </span>
                {/* <span className="name">{user.firstName}</span> */}
                <span className="name">
                  {user.firstName.length > 13
                    ? user.firstName.slice(0, 13) + "..."
                    : user.firstName}
                </span>
              </div>
              <div className="logout">
                <button onClick={handleLogout}>Logout</button>
              </div>
            </div>
          ) : (
            <div className="login">
              <button onClick={() => navigate("/login")}>Login</button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
