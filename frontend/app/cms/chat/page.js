"use client";

import { useEffect, useState } from "react";
import io from "socket.io-client";

let socket;

export default function ChatPage() {
  const [roomId, setRoomId] = useState("global"); // you can replace with userId/operatorId
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    // Connect to backend socket server
    socket = io("http://localhost:5100", {
      transports: ["websocket"],
    });

    // Join a room
    socket.emit("joinRoom", roomId);

    // Listen for new messages
    socket.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.disconnect();
    };
  }, [roomId]);

  const sendMessage = () => {
    if (newMessage.trim() === "") return;

    const messageData = {
      roomId,
      sender: "client", // Or fetch from logged-in user info
      message: newMessage,
    };

    socket.emit("sendMessage", messageData);
    setNewMessage("");
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-orange-500 text-white p-4 font-semibold">
        Chat with Operator
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`my-2 flex ${
              msg.sender === "client" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-lg shadow ${
                msg.sender === "client"
                  ? "bg-orange-500 text-white"
                  : "bg-white text-gray-800 border"
              }`}
            >
              {msg.message}
            </div>
          </div>
        ))}
      </div>

      {/* Input box */}
      <div className="p-4 flex gap-2 border-t bg-white">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button
          onClick={sendMessage}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}
