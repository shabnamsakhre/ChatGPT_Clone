import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import "../styles/chats/chatSection.css";
import "../styles/chats/message.css";
import "../styles/chats/input.css";
import { io } from "socket.io-client";

const ChatSection = ({ chats, setChats, activeChat, getMessages }) => {
  const [message, setMessage] = useState("");
  const [messageBox, setMessageBox] = useState([]);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

    setMessageBox(
      getMessages.map((msg) => ({
        role: msg.role === "user" ? "user" : "ai",
        content: msg.content,
      }))
    );

    const tempSocket = io("http://localhost:3000", { withCredentials: true });

    tempSocket.on("ai-response", (messagePayload) => {
      console.log("Received - ", messagePayload);

      setMessageBox((prev) => [
        ...prev,
        { role: "ai", content: messagePayload.content },
      ]);
    });

    setSocket(tempSocket);
  }, [chats, getMessages]);

  const handleSend = () => {
    if (!message.trim() || !activeChat) return;

    console.log("Message = ", message.trim());

    setMessageBox((prev) => [
      ...prev,
      { role: "user", content: message.trim() },
    ]);

    socket.emit("ai-message", {
      chat: activeChat,
      content: message.trim(),
    });

    // Add user message
    // setChats((prev) =>
    //   prev.map((chat) =>
    //     chat._id === activeChat
    //       ? {
    //           ...chat,
    //           messages: [
    //             ...chat.messages,
    //             { role: "user", content: message, time: getCurrentTime() },
    //           ],
    //         }
    //       : chat
    //   )
    // );
    setMessage("");

    // Simulated AI response
    // setTimeout(() => {
    //   const aiResponse = `
    //     I understand ✅

    //     Here’s an example code:

    //     \`\`\`js
    //     function greet() {
    //       console.log("Hello from AI!");
    //     }
    //     greet();
    //     \`\`\`

    //     And some **bold text** + *italic text*.
    //   `;

    //   setChats((prev) =>
    //     prev.map((chat) =>
    //       chat.id === activeChat
    //         ? {
    //             ...chat,
    //             messages: [
    //               ...chat.messages,
    //               { role: "ai", content: aiResponse, time: getCurrentTime() },
    //             ],
    //           }
    //         : chat
    //     )
    //   );
    // }, 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const currentChat = chats.find((c) => c._id === activeChat);

  return (
    <div className="chat-section">
      <div className="messages">
        {messageBox.length === 0 ? (
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
          messageBox.map((msg, idx) => (
            <div key={idx} className={`message ${msg.role}`}>
              {msg.role === "user" ? (
                // ✅ Keep user bubble as-is
                <div className="bubble user">
                  <span>{msg.content}</span>
                  <span className="message-time">{msg.time}</span>
                </div>
              ) : (
                // ✅ Improved Bot bubble with App.jsx style
                <div className="message-wrapper bot">
                  <div className="message bot-message">
                    <span className="message-text">
                      {/* <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        rehypePlugins={[rehypeHighlight]}
                        components={{
                          code({ inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(
                              className || ""
                            );
                            return !inline && match ? (
                              <SyntaxHighlighter
                                style={vscDarkPlus}
                                language={match[1]}
                                PreTag="div"
                                {...props}
                              >
                                {String(children).replace(/\n$/, "")}
                              </SyntaxHighlighter>
                            ) : (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            );
                          },
                        }}
                      >
                        {msg.content}
                        </ReactMarkdown> */}
                      {msg.content}
                    </span>
                    <span className="message-time">{msg.time}</span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="chatgpt-input-container">
        <div className="chatgpt-input-box">
          <textarea
            ref={textareaRef}
            rows={1}
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              e.target.style.height = "auto"; // reset
              e.target.style.height =
                Math.min(e.target.scrollHeight, 150) + "px"; // expand until 150px
            }}
            onKeyDown={handleKeyDown}
            placeholder="Message ChatGPT..."
            className="chatgpt-input"
          />

          <button className="chatgpt-send-btn" onClick={handleSend}>
            ➤
          </button>
        </div>
        <p className="chatgpt-input-hint">
          ChatGPT can make mistakes. Consider checking important information.
        </p>
      </div>
    </div>
  );
};

export default ChatSection;
