import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import "../styles/chats/chatSection.css";
import "../styles/chats/message.css";
import "../styles/chats/input.css";

const ChatSection = ({ chats, setChats, activeChat }) => {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef(null);

  const handleSend = () => {
    if (!message.trim() || !activeChat) return;

    // Add user message
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChat
          ? {
              ...chat,
              messages: [
                ...chat.messages,
                { role: "user", content: message, time: getCurrentTime() },
              ],
            }
          : chat
      )
    );
    setMessage("");

    // Simulated AI response
    setTimeout(() => {
      const aiResponse = `
        I understand ✅

        Here’s an example code:

        \`\`\`js
        function greet() {
          console.log("Hello from AI!");
        }
        greet();
        \`\`\`

        And some **bold text** + *italic text*.
      `;

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChat
            ? {
                ...chat,
                messages: [
                  ...chat.messages,
                  { role: "ai", content: aiResponse, time: getCurrentTime() },
                ],
              }
            : chat
        )
      );
    }, 800);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats]);

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const currentChat = chats.find((c) => c.id === activeChat);

  return (
    <div className="chat-section">
      <div className="messages">
        {currentChat?.messages.length === 0 ? (
          <div className="empty-chat">
            <h2>Start a new conversation</h2>
            <p>Your messages will appear here.</p>
          </div>
        ) : (
          currentChat?.messages.map((msg, idx) => (
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
                      <ReactMarkdown
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
      <div className="input-container">
        <textarea
          rows={1}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message ChatGPT..."
          className="chat-input"
        />
        <button className="send-btn" onClick={handleSend}>
          ➤
        </button>
      </div>
    </div>
  );
};

export default ChatSection;
