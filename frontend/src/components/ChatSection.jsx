import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import "../styles/chats/chatSection.css";
import "../styles/chats/message.css";
import "../styles/chats/input.css";
import { io } from "socket.io-client";

const ChatSection = ({ activeChat, messageBox, setMessageBox }) => {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const [socket, setSocket] = useState(null);

  // 👇 scroll to bottom every time messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageBox]);

  useEffect(() => {
    const tempSocket = io("http://localhost:3000", { withCredentials: true });

    tempSocket.on("ai-response", (messagePayload) => {
      console.log("Received - ", messagePayload);

      // 👇 Replace loader with AI response
      setMessageBox((prev) => {
        const copy = [...prev];
        const loaderIndex = copy.findIndex((m) => m.role === "loader");
        if (loaderIndex !== -1) {
          copy[loaderIndex] = {
            role: "ai",
            content: messagePayload.content,
            time: getCurrentTime(),
          };
          return copy;
        }
        return [
          ...prev,
          {
            role: "ai",
            content: messagePayload.content,
            time: getCurrentTime(),
          },
        ];
      });
    });

    setSocket(tempSocket);

    return () => tempSocket.disconnect();
  }, []);

  const handleSend = () => {
    if (!message.trim() || !activeChat) return;

    console.log("Message = ", message.trim());

    // Add user message
    setMessageBox((prev) => [
      ...prev,
      { role: "user", content: message.trim(), time: getCurrentTime() },
      { role: "loader" }, // 👈 Add loader temporarily
    ]);

    socket.emit("ai-message", {
      chat: activeChat,
      content: message.trim(),
    });

    setMessage("");
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
                <div className="bubble user">
                  <span>{msg.content}</span>
                  <span className="message-time">{msg.time}</span>
                </div>
              ) : msg.role === "loader" ? (
                // 👇 Loader bubbles
                <div className="message-wrapper bot">
                  <div className="message bot-message">
                    <div className="typing-loader">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="message-wrapper bot">
                  <div className="message bot-message">
                    <span className="message-text">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code({ inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(
                              className || ""
                            );
                            return !inline && match ? (
                              <div className="code-block">
                                <SyntaxHighlighter
                                  style={vscDarkPlus}
                                  language={match[1]}
                                  PreTag="div"
                                  {...props}
                                >
                                  {String(children).replace(/\n$/, "")}
                                </SyntaxHighlighter>
                                <button
                                  className="copy-btn"
                                  onClick={() =>
                                    navigator.clipboard.writeText(
                                      String(children)
                                    )
                                  }
                                >
                                  copy
                                </button>
                              </div>
                            ) : (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            );
                          },
                        }}
                      >
                        {msg.content}
                      </ReactMarkdown>
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
      {messageBox.length !== 0 ? (
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
      ) : null}
    </div>
  );
};

export default ChatSection;
