# 💬 Chat with Operators - Complete Guide

## How the Chat System Works

The chat system allows users to communicate with operators in real-time. Here's everything you need to know:

---

## 🎯 Chat Features

### **1. Support Chat (Always Available)**
- General support for questions and inquiries
- Operators respond to all inquiries from the support channel
- Available 24/7 for customer assistance

### **2. Booking-Linked Chats**
- Each booking has its own chat conversation
- Directly communicate about your specific booking
- View booking details while chatting:
  - **Route**: Departure and destination
  - **Date**: Travel date
  - **Service**: Type of service booked
  - **Amount**: Booking amount

### **3. Real-Time Messaging**
- Messages update instantly using Socket.io
- See when operators are responding
- Full message history preserved
- Timestamps for every message

---

## 📱 How to Chat

### **Step 1: Open Chat**
1. Click on **"Chat"** in the dashboard sidebar
2. The chat page will load with your conversations

### **Step 2: Select a Conversation**
- **Support**: General inquiries chat (always available)
- **Your Bookings**: Each booking shows in the conversation list with:
  - ✈️ Airplane icon (booking type)
  - Route and date
  - Current booking status (Pending, Confirmed, Completed, Cancelled)

### **Step 3: View Conversation**
- Left panel shows list of all conversations
- Click any conversation to open it
- Right panel shows the chat window

### **Step 4: Send Message**
1. Type your message in the input field at the bottom
2. Press **Enter** or click the **Send button** (📤)
3. Your message appears immediately
4. Operator responses appear in real-time

---

## 📊 Chat Interface Layout

### **Left Sidebar - Conversations**
```
┌─────────────────────────┐
│        Messages         │ ← Header shows message count
├─────────────────────────┤
│ 💬 Support (Active)     │ ← Support chat
│ ✈️ Route - Date         │ ← First booking
│ ✈️ Route - Date         │ ← Second booking
│ ...                      │
└─────────────────────────┘
```

### **Right Panel - Chat Window**
```
┌────────────────────────────────────┐
│ Booking Info (if booking chat)     │ ← Route, Date, Service
├────────────────────────────────────┤
│                                    │
│ Message 1                          │ ← Your message (right side)
│                                    │
│                       Message 2    │ ← Operator message (left side)
│                                    │
├────────────────────────────────────┤
│ [Type message...] [📤 Send]        │ ← Message input
└────────────────────────────────────┘
```

---

## 🏷️ Status Indicators

Each conversation shows a status badge:

| Status | Icon | Color | Meaning |
|--------|------|-------|---------|
| **Pending** | ⏳ | Orange | Waiting for confirmation |
| **Confirmed** | ✓ | Green | Booking confirmed |
| **Completed** | ✅ | Purple | Flight completed |
| **Cancelled** | ❌ | Red | Booking cancelled |
| **Active** | 💬 | Cyan | Support chat active |

---

## 💡 Common Use Cases

### **Before Booking**
- Chat with support to ask questions about pricing, service, availability
- Discuss special requirements or group bookings

### **After Booking**
- Chat about your specific booking
- Ask for changes, modifications, or clarifications
- Get updates on booking status
- Report issues or problems

### **During Travel**
- Ask questions about your flight
- Report emergencies or urgent issues
- Get real-time support

### **After Travel**
- Provide feedback about your experience
- Report issues or concerns
- Ask about future bookings or special offers

---

## 🔄 Real-Time Features

### **Socket.io Integration**
The chat uses Socket.io for real-time communication:

1. **Auto-Connect**: When you open the chat, it automatically connects to the server
2. **Live Updates**: Messages appear instantly without refreshing
3. **Room Joining**: Automatically joins rooms for each conversation
4. **Message Persistence**: All messages are saved to the database

### **Message Flow**
```
You write message
    ↓
Message sent to server via Socket.io
    ↓
Message saved to database
    ↓
Message broadcast to operator
    ↓
Operator receives and responds
    ↓
Their message comes back to you instantly
```

---

## 📝 Message Features

### **What You Can Do**
✅ Send text messages
✅ See full message history
✅ View timestamps
✅ See operator responses in real-time
✅ Check booking details while chatting
✅ Track conversation status

### **Limitations**
❌ File uploads (for now - can be added)
❌ Voice messages (for now - can be added)
❌ Video calls (for now - can be added)

---

## 🎨 Message Styling

### **Your Messages**
- Appear on the **right side**
- Have a **purple/blue gradient background**
- White text
- Shows your timestamp

### **Operator Messages**
- Appear on the **left side**
- Have a **gray background**
- Dark text
- Shows their timestamp

---

## 🔐 Security & Privacy

✅ **Secure Communication**: All messages encrypted in transit
✅ **Persistent Storage**: Messages saved securely in database
✅ **User Authentication**: Only logged-in users can chat
✅ **Private Conversations**: Each conversation is private

---

## 📱 Responsive Design

The chat interface works perfectly on all devices:

### **Desktop (1024px+)**
- Sidebar always visible on the left
- Large chat window on the right
- Side-by-side layout

### **Tablet (768px-1023px)**
- Sidebar optimized for medium screens
- Chat window takes remaining space
- Touch-friendly buttons

### **Mobile (< 768px)**
- Sidebar can be toggled/hidden
- Full-width chat window
- Optimized touch interface
- Stacked layout for readability

---

## ❓ Frequently Asked Questions

### **Q: How long does it take for an operator to respond?**
A: Operators typically respond within 5-30 minutes during business hours. Support may be slower during peak times.

### **Q: Can I chat without booking?**
A: Yes! You can use the Support chat to ask any questions before booking.

### **Q: Will my messages be saved?**
A: Yes! All messages are permanently saved in your conversation history.

### **Q: Can I see old messages?**
A: Yes! When you open a conversation, all previous messages are automatically loaded.

### **Q: Is there a chat history limit?**
A: No! Your entire chat history is preserved.

### **Q: Can I delete chat messages?**
A: Not yet, but this feature can be added.

### **Q: Can I chat with multiple operators?**
A: The operator system currently routes all support chats to the support team.

---

## 🚀 Getting Started with Chat

1. **Open Dashboard**: Go to `/dashboard`
2. **Click Chat**: In the sidebar menu
3. **Select Conversation**: Click Support or your booking
4. **Type Message**: Use the input at the bottom
5. **Send**: Press Enter or click Send button (📤)
6. **Wait for Response**: New messages appear automatically

---

## 📞 When to Use Chat

✅ **Best for:**
- General questions
- Booking clarifications
- Non-urgent issues
- Getting information

❌ **Not for (contact support directly):**
- Technical emergencies
- Safety concerns
- Critical issues during flight

In emergencies, please call our support number directly rather than using chat.

---

## 💾 Backend Architecture

### **Technology Stack**
- **Real-time**: Socket.io
- **Database**: MongoDB
- **Messages Model**: Stores roomId, sender, message, timestamps
- **Rooms**: One room per conversation (booking or support)

### **API Endpoints**
```
GET    /messages/:roomId              - Fetch messages
POST   /messages                      - Send new message
PUT    /messages/:id                  - Edit message
DELETE /messages/:id                  - Delete message
```

### **Socket Events**
```
join-room        - Join a conversation room
send-message     - Send a message
message          - Receive new message
disconnect       - Leave room
```

---

## 🎓 Tips for Better Experience

1. **Be Clear**: Write clear messages so operators understand your issue
2. **Include Details**: Mention booking ID or reference number
3. **Be Patient**: Operators respond as quickly as possible
4. **Check Status**: See your booking status at a glance
5. **Use Support**: For general questions before booking

---

## 📊 Chat Statistics

Your chat interface shows:
- **Total Conversations**: Count displayed at top
- **Booking Details**: Route, date, service, amount (when available)
- **Status**: Current booking/support status
- **Message Count**: All previous messages in conversation

---

## 🔧 Customization Options (For Developers)

### **Can Be Added:**
- 📁 File uploads (images, documents)
- 🎙️ Voice messages
- 👥 Group chats
- 📎 Message reactions (emoji)
- 🔍 Message search
- 📌 Pinned messages
- 🔔 Chat notifications

---

## 📞 Support

If you have any issues with the chat system:
1. Try using the **Support** chat channel
2. Check your internet connection
3. Refresh the page if messages aren't updating
4. Contact support directly if problem persists

---

**Last Updated**: March 29, 2026
**Version**: 1.0
