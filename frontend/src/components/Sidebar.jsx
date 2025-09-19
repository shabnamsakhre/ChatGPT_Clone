import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react"; // icons
import "../styles/chats/sidebar.css";

const Sidebar = ({ chats, activeChat, setActiveChat, handleNewChat }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Ask for chat title when creating new chat
  const createNewChat = () => {
    const title = prompt("Enter a title for your new chat:");
    if (title && title.trim() !== "") {
      handleNewChat(title.trim());
      setIsOpen(false); // close after creation (mobile UX)
    }
  };

  // Close sidebar when pressing ESC
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

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
          <button className="sidebar-btn" onClick={createNewChat}>
            ＋ New chat
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
                key={chat.id}
                className={`chat-item ${
                  activeChat === chat.id ? "active" : ""
                }`}
                onClick={() => {
                  setActiveChat(chat.id);
                  setIsOpen(false); // close sidebar after selection
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
          <div className="profile">
            <span className="avatar">J</span>
            <span className="name">User</span>
          </div>
          <div className="logout">
            <button>Logout</button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
