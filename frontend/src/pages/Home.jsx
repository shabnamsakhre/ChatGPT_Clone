// import { useEffect, useState } from "react";
// import Sidebar from "../components/Sidebar";
// import ChatSection from "../components/ChatSection";
// import "../styles/chats/home.css";
// import axios from "axios";

// const Home = () => {
//   const [chats, setChats] = useState([]);
//   const [activeChat, setActiveChat] = useState(null);
//   const [msg, setMsg] = useState([]);

//   // Default chat
//   useEffect(() => {
//     axios
//       .get("http://localhost:3000/api/chat", { withCredentials: true })
//       .then((response) => {
//         setChats(response.data.chats.reverse());
//         setActiveChat(response.data.chats[0]._id);
//       });
//   }, []);

//   // Now accepts title from Sidebar
//   const handleNewChat = (newChat) => {
//     setChats([newChat.chat, ...chats]);
//     setActiveChat(newChat.chat._id);

//     getMessages(newChat.chat._id);
//   };

//   const getMessages = async (chatId) => {
//     const response = await axios.get(
//       `http://localhost:3000/api/chat/messages/${chatId}`,
//       { withCredentials: true }
//     );

//     setMsg(response.data.messages);
//   };

//   return (
//     <div className="home-container">
//       <Sidebar
//         chats={chats}
//         activeChat={activeChat}
//         setActiveChat={setActiveChat}
//         handleNewChat={handleNewChat}
//         getMessages={getMessages}
//       />

//       {chats.length === 0 ? (
//         <div className="empty-chat">
//           <h1 className="welcome-title">ChatGPT Clone</h1>
//           <p className="welcome-subtitle">
//             Your AI assistant is ready to help you.
//           </p>

//           <div className="welcome-examples">
//             <div className="example">
//               💡 Explain a complex topic in simple words
//             </div>
//             <div className="example">📄 Generate a professional email</div>
//             <div className="example">💻 Help me debug a piece of code</div>
//           </div>
//         </div>
//       ) : (
//         <ChatSection
//           chats={chats}
//           setChats={setChats}
//           activeChat={activeChat}
//           getMessages={msg}
//         />
//       )}
//     </div>
//   );
// };

// export default Home;

import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import ChatSection from "../components/ChatSection";
import "../styles/chats/home.css";
import axios from "axios";

const Home = () => {
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messageBox, setMessageBox] = useState([]);

  // Default chat
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/chat", { withCredentials: true })
      .then((response) => {
        setChats(response.data.chats.reverse());
      });
  }, []);

  // Now accepts title from Sidebar
  const handleNewChat = (newChat) => {
    setChats([newChat.chat, ...chats]);
    setActiveChat(newChat.chat._id);

    getMessages(newChat.chat._id);
  };

  const getMessages = async (chatId) => {
    const response = await axios.get(
      `http://localhost:3000/api/chat/messages/${chatId}`,
      { withCredentials: true }
    );

    setMessageBox(
      response.data.messages.map((msg) => ({
        role: msg.role === "user" ? "user" : "ai",
        content: msg.content,
        time: new Date(msg.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),

        // time: `${new Date(msg.createdAt).toLocaleTimeString([], {
        //   hour: "2-digit",
        //   minute: "2-digit",
        // })} - ${new Date(msg.createdAt).toLocaleDateString("en-GB", {
        //   day: "2-digit",
        //   month: "short",
        //   year: "2-digit",
        // })}`,
      }))
    );
  };

  return (
    <div className="home-container">
      <Sidebar
        chats={chats}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
        handleNewChat={handleNewChat}
        getMessages={getMessages}
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
          messageBox={messageBox}
          setMessageBox={setMessageBox}
        />
      )}
    </div>
  );
};

export default Home;
