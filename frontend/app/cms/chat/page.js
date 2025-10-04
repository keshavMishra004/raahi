"use client";
import { useState } from "react";
import { FiMoreHorizontal, FiPlus, FiSend, FiSearch, FiFilter } from "react-icons/fi";

export default function ManualChatPage() {
  const [users, setUsers] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  // Create dummy user manually
  const addUser = () => {
    const id = Date.now();
    const name = `User ${users.length + 1}`;
    setUsers((prev) => [...prev, { userId: id, userName: name, lastMessage: "Hello 👋" }]);
  };

  const handleSend = () => {
    if (!input.trim() || !activeUser) return;

    // Append message to chat window
    setMessages((prev) => [...prev, { from: "You", text: input, type: "outgoing" }]);

    // Simulate a reply from the user
    setTimeout(() => {
      setMessages((prev) => [...prev, { from: activeUser.userName, text: "Hii XYZ", type: "incoming" }]);
    }, 1000);

    setInput("");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* LEFT SIDEBAR */}
      <aside className="w-1/4 bg-white border-r flex flex-col">
        {/* HEADER */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">Message</h2>
          <div className="flex gap-3 text-gray-500">
            <FiPlus className="cursor-pointer" onClick={addUser} />
            <FiMoreHorizontal className="cursor-pointer" />
          </div>
        </div>

        {/* SEARCH BAR */}
        <div className="flex items-center px-4 py-2 gap-2 border-b">
          <FiSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Search message..."
            className="flex-1 outline-none text-sm"
          />
          <FiFilter className="text-gray-400 cursor-pointer" />
        </div>

        {/* USER LIST */}
        <div className="flex-1 overflow-y-auto">
          {users.length === 0 ? (
            <p className="text-gray-400 text-center mt-6">No chats yet</p>
          ) : (
            users.map((user) => (
              <div
                key={user.userId}
                className={`flex items-center p-3 cursor-pointer hover:bg-gray-100 transition ${
                  activeUser?.userId === user.userId ? "bg-gray-100" : ""
                }`}
                onClick={() => {
                  setActiveUser(user);
                  setMessages([]); // clear old chat when selecting new user
                }}
              >
                <div className="w-10 h-10 bg-gray-300 rounded-full mr-3"></div>
                <div className="flex-1">
                  <p className="font-medium text-gray-800">{user.userName}</p>
                  <p className="text-sm text-gray-500 truncate">{user.lastMessage}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>

      {/* CHAT AREA */}
      <main className="flex-1 flex flex-col">
        {activeUser ? (
          <>
            {/* CHAT HEADER */}
            <div className="flex justify-between items-center p-4 border-b bg-white">
              <div>
                <h2 className="font-semibold text-gray-800">{activeUser.userName}</h2>
                <span className="text-xs text-green-500">● Online</span>
              </div>
              <FiMoreHorizontal className="cursor-pointer text-gray-500" />
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                    msg.type === "outgoing"
                      ? "bg-blue-500 text-white self-end"
                      : "bg-gray-200 text-gray-800 self-start"
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>

            {/* MESSAGE INPUT */}
            <div className="flex items-center p-3 border-t bg-white gap-3">
              <button className="p-2 rounded-full hover:bg-gray-100">
                <FiPlus />
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message..."
                className="flex-1 outline-none bg-gray-100 px-4 py-2 rounded-full text-sm"
              />
              <button
                onClick={handleSend}
                className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600"
              >
                <FiSend />
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center flex-1 text-gray-400">
            Select a chat to start messaging
          </div>
        )}
      </main>
    </div>
  );
}
