import React, { useState, useRef, useEffect } from "react";
import { Send, Bot, User } from "lucide-react";

const EngineerChat = () => {
  const [messages, setMessages] = useState([
    { 
      sender: "bot", 
      text: "👋 Hey Racer! Ready to dominate the track? Ask me about setups, strategy, tire management, or any F1 technical questions!" 
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:5000/ask-engineer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      if (data.success) {
        const botMessage = { sender: "bot", text: data.reply };
        setMessages((prev) => [...prev, botMessage]);
      } else {
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: "⚠️ Server responded with an error." },
        ]);
      }
    } catch (error) {
      console.error("❌ Chat error:", error);
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "⚠️ Error connecting to AI server." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen w-full bg-transparent flex flex-col relative overflow-hidden">
      
      {/* F1 Hyperspeed Background Animation */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute bottom-0 left-0 w-full h-96 bg-gradient-to-t from-red-900/50 via-red-800/20 to-transparent"></div>
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600/60 to-transparent animate-pulse"></div>
        <div className="absolute top-1/3 right-0 w-full h-1 bg-gradient-to-l from-transparent via-red-500/50 to-transparent animate-pulse" style={{ animationDelay: '0.5s' }}></div>
        
        <div className="absolute inset-0">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-red-600/20 to-transparent"
              style={{
                top: `${20 + i * 12}%`,
                width: '100%',
                animation: `speedLine ${1.5 + i * 0.3}s linear infinite`,
                animationDelay: `${i * 0.3}s`
              }}
            />
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes speedLine {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(100%);
            opacity: 0;
          }
        }
      `}} />

      {/* Main Chat Container */}
      <div className="flex-1 flex flex-col w-full h-full relative z-10 p-8">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center gap-3 mb-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center shadow-lg shadow-red-600/50">
              <Bot className="w-9 h-9" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-white mb-2 tracking-tight">
            AI RACE ENGINEER
          </h1>
          <p className="text-gray-400 text-lg">Your personal F1 technical advisor</p>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-4 space-y-6 mb-6">
          <div className="max-w-5xl mx-auto space-y-6">
            {messages.map((msg, index) => {
              const isUser = msg.sender === "user";
              const avatarClass = isUser 
                ? "bg-gradient-to-br from-red-900/80 to-black/80 border-2 border-red-700/80 backdrop-blur-sm shadow-lg shadow-red-900/40"
                : "bg-gradient-to-br from-red-600 to-red-800 shadow-xl shadow-red-600/50 border-2 border-red-500/50";
              const bubbleClass = isUser
                ? "bg-gradient-to-br from-red-950/70 to-black/60 border-2 border-red-800/80 shadow-red-900/30"
                : "bg-gradient-to-br from-red-950/60 to-black/50 border-2 border-red-800/70 shadow-red-900/20";

              return (
                <div
                  key={index}
                  className={`flex gap-4 ${isUser ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${avatarClass}`}>
                    {isUser ? <User className="w-6 h-6" /> : <Bot className="w-6 h-6" />}
                  </div>

                  <div className={`max-w-3xl px-6 py-4 rounded-2xl backdrop-blur-md shadow-lg ${bubbleClass}`}>
                    <p className="text-gray-100 leading-relaxed text-lg">{msg.text}</p>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-600 to-red-800 flex items-center justify-center shadow-xl shadow-red-600/50 border-2 border-red-500/50">
                  <Bot className="w-6 h-6" />
                </div>
                <div className="bg-gradient-to-br from-red-950/60 to-black/50 border-2 border-red-800/70 px-6 py-4 rounded-2xl backdrop-blur-md shadow-lg shadow-red-900/20">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="bg-gradient-to-br from-red-950/70 to-black/70 backdrop-blur-lg border-2 border-red-800/80 rounded-2xl p-6 shadow-2xl shadow-red-900/40">
          <div className="max-w-5xl mx-auto flex gap-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
              placeholder="Ask your AI engineer..."
              className="flex-1 bg-gradient-to-br from-black/60 to-red-950/40 border-2 border-red-900/60 text-white px-6 py-4 rounded-xl outline-none focus:border-red-600 focus:ring-2 focus:ring-red-600/40 transition-all placeholder:text-gray-400 backdrop-blur-md text-lg shadow-inner"
            />
            <button
              onClick={handleSend}
              disabled={isLoading || !input.trim()}
              className={`px-8 py-4 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                isLoading || !input.trim()
                  ? "bg-zinc-800/40 text-gray-600 cursor-not-allowed border-2 border-zinc-700/40"
                  : "bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg shadow-red-600/40 hover:shadow-red-600/60 border-2 border-red-500/50"
              }`}
            >
              <Send className="w-5 h-5" />
              Send
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EngineerChat;