'use client';
import React, { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import userApi from '@/utils/userAxios';
import { toast } from 'react-toastify';
import '../css/chat.css';

export default function ChatPage() {
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    initializeChat();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const initializeChat = async () => {
    try {
      setLoading(true);

      // Get current user
      const userRes = await userApi.get('/user/me');
      setCurrentUser(userRes.data);

      // Fetch conversations (from bookings)
      const bookingsRes = await userApi.get('/bookings/user');
      const bookings = bookingsRes.data || [];

      // Create conversations from bookings
      const convs = bookings.map(booking => ({
        id: booking._id,
        type: 'booking',
        title: `${booking.route || 'Booking'} - ${booking.date}`,
        description: `${booking.service} | Status: ${booking.status}`,
        lastMessage: '--',
        status: booking.status,
        booking: booking,
        unread: 0,
      }));

      // Also add support conversation
      convs.unshift({
        id: 'support',
        type: 'support',
        title: 'RAAHi Support',
        description: 'Chat with our support team',
        lastMessage: 'Hi there! How can we help?',
        status: 'active',
        unread: 0,
      });

      setConversations(convs);

      // Connect to Socket.io
      const socket = io(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5100', {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      });

      socket.on('connect', () => {
        console.log('Connected to chat server');
        // Join all conversation rooms
        convs.forEach(conv => {
          socket.emit('join-room', { roomId: conv.id });
        });
      });

      socket.on('message', (data) => {
        // Update messages if they're from the current conversation
        if (selectedConversation && data.roomId === selectedConversation.id) {
          setMessages(prev => [...prev, data]);
        }
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from chat server');
      });

      socketRef.current = socket;
    } catch (err) {
      console.error('Error initializing chat:', err);
      toast.error('Failed to initialize chat');
    } finally {
      setLoading(false);
    }
  };

  const loadConversationMessages = async (conversation) => {
    try {
      setSelectedConversation(conversation);
      const res = await userApi.get(`/messages/${conversation.id}`);
      setMessages(res.data || []);

      // Join room in socket
      if (socketRef.current) {
        socketRef.current.emit('join-room', { roomId: conversation.id });
      }
    } catch (err) {
      console.error('Error loading messages:', err);
      toast.error('Failed to load messages');
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation || sending) return;

    try {
      setSending(true);
      const messageData = {
        roomId: selectedConversation.id,
        sender: currentUser?._id || 'user',
        message: newMessage,
      };

      // Save to backend
      await userApi.post('/messages', messageData);

      // Emit through socket
      if (socketRef.current) {
        socketRef.current.emit('send-message', {
          ...messageData,
          createdAt: new Date().toISOString(),
        });

        // Add to local messages
        setMessages(prev => [
          ...prev,
          {
            ...messageData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]);
      }

      setNewMessage('');
    } catch (err) {
      console.error('Error sending message:', err);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: '#f59e0b',
      confirmed: '#10b981',
      completed: '#8b5cf6',
      cancelled: '#ef4444',
      active: '#06b6d4',
    };
    return colors[status] || '#6b7280';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: '⏳',
      confirmed: '✓',
      completed: '✅',
      cancelled: '❌',
      active: '💬',
    };
    return icons[status] || '•';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-lg p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
            <p className="mt-4 text-gray-600">Loading chat...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-page">
      <div className="chat-container">
        {/* Conversations List */}
        <div className="conversations-sidebar">
          <div className="conversations-header">
            <h2>Messages</h2>
            <span className="conversation-count">{conversations.length}</span>
          </div>

          <div className="conversations-list">
            {conversations.map(conv => (
              <div
                key={conv.id}
                onClick={() => loadConversationMessages(conv)}
                className={`conversation-item ${selectedConversation?.id === conv.id ? 'active' : ''}`}
              >
                <div className="conversation-avatar">
                  <span className="avatar-text">{conv.type === 'support' ? '💬' : '✈️'}</span>
                </div>
                <div className="conversation-content">
                  <div className="conversation-title">{conv.title}</div>
                  <div className="conversation-preview">{conv.description}</div>
                </div>
                <div className="conversation-meta">
                  <span
                    className="status-badge"
                    style={{ backgroundColor: `${getStatusColor(conv.status)}20`, color: getStatusColor(conv.status) }}
                  >
                    {getStatusIcon(conv.status)} {conv.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="chat-main">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="chat-header">
                <div className="chat-header-info">
                  <h2>{selectedConversation.title}</h2>
                  <p>{selectedConversation.description}</p>
                </div>
                <div className="chat-header-status">
                  <span
                    className="status-badge"
                    style={{
                      backgroundColor: `${getStatusColor(selectedConversation.status)}20`,
                      color: getStatusColor(selectedConversation.status),
                    }}
                  >
                    {getStatusIcon(selectedConversation.status)} {selectedConversation.status}
                  </span>
                </div>
              </div>

              {/* Booking Info (if applicable) */}
              {selectedConversation.booking && (
                <div className="booking-info-card">
                  <div className="booking-info-row">
                    <span className="label">Route:</span>
                    <span className="value">{selectedConversation.booking.route || 'N/A'}</span>
                  </div>
                  <div className="booking-info-row">
                    <span className="label">Date:</span>
                    <span className="value">
                      {new Date(selectedConversation.booking.date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="booking-info-row">
                    <span className="label">Service:</span>
                    <span className="value">{selectedConversation.booking.service}</span>
                  </div>
                  <div className="booking-info-row">
                    <span className="label">Amount:</span>
                    <span className="value">₹{selectedConversation.booking.amount}</span>
                  </div>
                </div>
              )}

              {/* Messages Area */}
              <div className="messages-area">
                {messages.length === 0 ? (
                  <div className="empty-chat">
                    <div className="empty-icon">💬</div>
                    <p>No messages yet. Start the conversation!</p>
                  </div>
                ) : (
                  messages.map((msg, idx) => {
                    const isCurrentUser = msg.sender === currentUser?._id || msg.sender === 'user';
                    return (
                      <div
                        key={idx}
                        className={`message ${isCurrentUser ? 'sent' : 'received'}`}
                      >
                        <div className="message-bubble">
                          <p className="message-text">{msg.message}</p>
                          <span className="message-time">
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="message-input-area">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="message-input"
                  disabled={sending}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || sending}
                  className="btn-send"
                >
                  {sending ? '⏳' : '📤'}
                </button>
              </div>
            </>
          ) : (
            <div className="no-chat-selected">
              <div className="empty-icon">💭</div>
              <h3>Select a conversation</h3>
              <p>Choose a conversation from the list to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
