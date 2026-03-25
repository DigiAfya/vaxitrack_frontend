import { useState, useRef, useEffect } from "react";
import chatBotLogo from "../../../public/pictures/image/chatBot.svg";
import botBox from "../../../public/pictures/image/botBox.svg";
import send from "../../../public/pictures/image/send.svg";


export default function ChatBot({ visible, onClose }) {
  const [messages, setMessages] = useState([
    { 
      sender: "ai", 
      text: "Hello! I'm VaxiBot AI, your personal vaccine companion. I can help you with questions, provide daily tips, and guide you to reliable vaccine information. How can I assist you today?",
      avatar: chatBotLogo, // display chatbotIcon as avatar
    },
  ]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // Add user message
    setMessages((prev) => [
      ...prev, 
      { sender: "user", text: input, time }
    ]);
    setInput("");

    // Simulate AI response (replace with API call)
    setTimeout(() => {
      const aiNow = new Date();
      const aiTime = aiNow.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: `You said: "${input}"`, time: aiTime, avatar: chatBotLogo }
      ]);
    }, 1000);
  };

  if (!visible) return null;

  return (
    <div className="chatbot-overlay">
      <div className="chatbot-modal">
        <button className="chatbot-close" onClick={onClose}>
          ✕
        </button>

        {/* Header + disclaimer */}
        <div className="chatbot-header-wrapper">
          <div className="chatbot-header">
            <img src={chatBotLogo} alt="VaxiBot" />
            <div>
              <h3>VaxiBot AI</h3>
              <p>Your Health Companion</p>
            </div>
          </div>

          <div className="chatbot-disclaimer">
            <img src={botBox} alt="VaxiBot" />
            <p>
              This chatbot provides general health information only and is not a
              substitute for professional medical advice, diagnosis, or treatment.
            </p>
          </div>
        </div>

        {/* Messages */}
        <div className="chatbot-messages">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`chatbot-message ${msg.sender}`}
            >
              <div className="message-avatar">
                {msg.sender === "ai" && <img src={msg.avatar} alt="VaxiBot" />}
              </div>
              <div className="message-content">
                <p>{msg.text}</p>
                {msg.time && <span className="message-time">{msg.time}</span>}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="chatbot-input-container">
          <input
            type="text"
            placeholder="Ask me about your health concerns..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <img onClick={handleSend} src={send} alt="Send" />
        </div>
        <div className="chatbot-quick-buttons">
          <button className="quick-btn">BCG Vaccine</button>
          <button className="quick-btn">COVID 19</button>
          <button className="quick-btn">Immunity</button>
          <button className="quick-btn">Vaccine for new borns</button>
        </div>

      </div>

       

    </div>
  );
}