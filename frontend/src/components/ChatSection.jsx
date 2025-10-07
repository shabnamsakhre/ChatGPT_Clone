import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { io } from "socket.io-client";
import "../styles/chats/chatSection.css";
import "../styles/chats/message.css";
import "../styles/chats/input.css";

const genId = (prefix = "id") =>
  `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;

const ChatSection = ({ activeChat, messageBox, setMessageBox }) => {
  const [message, setMessage] = useState("");
  const [copiedCodeId, setCopiedCodeId] = useState(null); // holds unique code-block id
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);
  const [socket, setSocket] = useState(null);

  // Map of messageId -> array of codeBlockUniqueIds
  const codeIdMap = useRef({});

  // ensure every message has a stable id
  useEffect(() => {
    setMessageBox((prev) => {
      let changed = false;
      const mapped = prev.map((m) => {
        if (!m || typeof m !== "object") return m;
        if (!m.id) {
          changed = true;
          return { ...m, id: genId("msg") };
        }
        return m;
      });
      return changed ? mapped : prev;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // run once on mount

  // scroll to bottom every time messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageBox]);

  // socket setup (unchanged logic)
  useEffect(() => {
    const tempSocket = io("https://chatgpt-clone-cpl7.onrender.com", {
      withCredentials: true,
    });

    tempSocket.on("ai-response", (messagePayload) => {
      console.log("Received - ", messagePayload);

      setMessageBox((prev) => {
        const copy = [...prev];
        const loaderIndex = copy.findIndex((m) => m.role === "loader");
        if (loaderIndex !== -1) {
          copy[loaderIndex] = {
            ...copy[loaderIndex],
            role: "ai",
            content: messagePayload.content,
            time: getCurrentTime(),
            id: copy[loaderIndex].id || genId("msg"),
          };
          return copy;
        }
        return [
          ...copy,
          {
            role: "ai",
            content: messagePayload.content,
            time: getCurrentTime(),
            id: genId("msg"),
          },
        ];
      });
    });

    setSocket(tempSocket);
    return () => tempSocket.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSend = () => {
    if (!message.trim() || !activeChat) return;

    const userMsg = {
      role: "user",
      content: message.trim(),
      time: getCurrentTime(),
      id: genId("msg"),
    };
    const loaderMsg = { role: "loader", id: genId("loader") };

    // Append user message & loader
    setMessageBox((prev) => [...prev, userMsg, loaderMsg]);

    socket?.emit("ai-message", {
      chat: activeChat,
      content: message.trim(),
    });

    setMessage("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getCurrentTime = () =>
    new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  // Copy handler: only the clicked code-block id changes
  const handleCopy = async (text, codeBlockId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCodeId(codeBlockId);
      setTimeout(() => {
        setCopiedCodeId((current) =>
          current === codeBlockId ? null : current
        );
      }, 3000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  // Helper: ensure codeIdMap has stable ids for each message's code blocks
  const ensureCodeIdsForMessage = (msg) => {
    if (!msg || typeof msg.content !== "string") return [];

    const msgId = msg.id || (msg.id = genId("msg"));
    const codeBlocks = msg.content.match(/```[\s\S]*?```/g) || [];
    if (!codeIdMap.current[msgId]) {
      codeIdMap.current[msgId] = [];
    }
    // ensure we have an id for each code block
    while (codeIdMap.current[msgId].length < codeBlocks.length) {
      codeIdMap.current[msgId].push(genId("code"));
    }
    return codeIdMap.current[msgId];
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
          messageBox.map((msg, messageIdx) => {
            // ensure stable id for the message and prepare code ids
            const msgId = msg.id || (msg.id = genId("msg"));
            const codeIds = ensureCodeIdsForMessage(msg);
            // local counter to pick code id in order during rendering this message
            let localCodeIndex = 0;

            return (
              <div key={msgId} className={`message ${msg.role}`}>
                {msg.role === "user" ? (
                  <div className="bubble user">
                    <span>{msg.content}</span>
                    <span className="message-time">{msg.time}</span>
                  </div>
                ) : msg.role === "loader" ? (
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
                      <div className="message-text">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            code({ inline, className, children, ...props }) {
                              const match = /language-(\w+)/.exec(
                                className || ""
                              );
                              if (!inline && match) {
                                // get stable id for this code block in this message
                                const codeBlockId =
                                  codeIds[localCodeIndex] ||
                                  (codeIds[localCodeIndex] = genId("code"));
                                localCodeIndex += 1;

                                const codeString = String(children).replace(
                                  /\n$/,
                                  ""
                                );
                                return (
                                  <div className="code-block">
                                    <SyntaxHighlighter
                                      style={vscDarkPlus}
                                      language={match[1]}
                                      PreTag="div"
                                      {...props}
                                    >
                                      {codeString}
                                    </SyntaxHighlighter>
                                    <button
                                      className={`copy-btn ${
                                        copiedCodeId === codeBlockId
                                          ? "copied"
                                          : ""
                                      }`}
                                      onClick={() =>
                                        handleCopy(codeString, codeBlockId)
                                      }
                                    >
                                      {copiedCodeId === codeBlockId
                                        ? "Copied"
                                        : "Copy"}
                                    </button>
                                  </div>
                                );
                              }
                              return (
                                <code className={className} {...props}>
                                  {children}
                                </code>
                              );
                            },
                          }}
                        >
                          {msg.content}
                        </ReactMarkdown>
                      </div>

                      <span className="message-time">{msg.time}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      {activeChat !== null ? (
        <div className="chatgpt-input-container">
          <div className="chatgpt-input-box">
            <textarea
              ref={textareaRef}
              rows={1}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height =
                  Math.min(e.target.scrollHeight, 150) + "px";
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
