'use client';
import React, { useState, useRef, useEffect } from 'react';
import '../css/ai-chatbot.css';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Hello! 👋 I\'m your AI assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Common questions and responses
  const qaDatabase = {
    booking: {
      keywords: ['book', 'booking', 'flight', 'charter'],
      response:
        "To book a flight, go to the 'Book a Flight' section on your dashboard. Select your route, date, and preferences. Our team will provide available options. Would you like step-by-step guidance?",
    },
    payment: {
      keywords: ['payment', 'pay', 'card', 'upi', 'method'],
      response:
        "You can manage payment methods in the 'Payment Methods' section. We accept credit/debit cards and UPI. Add your preferred method there for faster checkout during booking.",
    },
    companions: {
      keywords: ['companion', 'family', 'traveler', 'member', 'group'],
      response:
        "Add travel companions in the 'Companions' section. This helps us customize group bookings and send invitations to your travel partners for coordinated flights.",
    },
    preferences: {
      keywords: ['preference', 'airline', 'seat', 'meal', 'notification'],
      response:
        "Set your travel preferences in the 'Preferences' section. Choose favorite airlines, seat preferences, meal options, and notification settings for a personalized experience.",
    },
    chat: {
      keywords: ['chat', 'support', 'operator', 'help', 'connect'],
      response:
        "You can chat with our operators in the 'Chat' section. Select a booking to discuss details, ask questions, or get real-time support from our team.",
    },
    profile: {
      keywords: ['profile', 'account', 'information', 'edit', 'update'],
      response:
        "Manage your profile in the 'Profile' section. Update personal details, contact information, and preferences. Keep your information current for better service.",
    },
    cancel: {
      keywords: ['cancel', 'refund', 'reschedule', 'change'],
      response:
        "To cancel or reschedule a booking, go to 'My Bookings' and select the booking. You can request changes or cancellations based on the booking terms and policies.",
    },
    pricing: {
      keywords: ['price', 'cost', 'discount', 'offer', 'rate'],
      response:
        "Pricing depends on route, date, and aircraft type. Charter flights are customized. Contact our team via Chat for a personalized quote for your needs.",
    },
  };

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Find best response from database
  const findResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();

    for (const [key, data] of Object.entries(qaDatabase)) {
      if (data.keywords.some((keyword) => lowerMessage.includes(keyword))) {
        return data.response;
      }
    }

    return "I'm not sure about that. Try asking about bookings, payments, companions, preferences, chat, profile, cancellations, or pricing. Or chat with our support team!";
  };

  // Handle send message
  const handleSendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // Simulate AI thinking delay
    setTimeout(() => {
      const response = findResponse(input);
      const botMessage = {
        id: messages.length + 2,
        text: response,
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setLoading(false);
    }, 600);
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <button
        className="ai-chatbot-button"
        onClick={() => setIsOpen(!isOpen)}
        title="AI Assistant"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
        </svg>
      </button>

      {/* Chat Modal */}
      <div className={`ai-chatbot-modal ${isOpen ? 'open' : ''}`}>
        <div className="ai-chatbot-container">
          {/* Header */}
          <div className="ai-chatbot-header">
            <div className="ai-chatbot-title">
              <div className="ai-avatar">🤖</div>
              <div>
                <h3>AI Assistant</h3>
                <p>Always here to help</p>
              </div>
            </div>
            <button
              className="ai-close-btn"
              onClick={() => setIsOpen(false)}
              title="Close"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div className="ai-chatbot-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`ai-message ai-message-${msg.sender}`}>
                {msg.sender === 'bot' && <div className="ai-bot-avatar">🤖</div>}
                <div className="ai-message-bubble">
                  <p>{msg.text}</p>
                  <span className="ai-time">
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="ai-message ai-message-bot">
                <div className="ai-bot-avatar">🤖</div>
                <div className="ai-message-bubble ai-loading">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {messages.length === 1 && (
            <div className="ai-suggestions">
              <p>Quick questions:</p>
              <div className="ai-suggestion-buttons">
                {[
                  { text: 'How to book?', query: 'How do I book a flight?' },
                  {
                    text: 'Payment methods',
                    query: 'What payment methods do you accept?',
                  },
                  {
                    text: 'Add companions',
                    query: 'How do I add travel companions?',
                  },
                  {
                    text: 'Contact support',
                    query: 'How do I chat with support?',
                  },
                ].map((suggestion, idx) => (
                  <button
                    key={idx}
                    className="ai-suggestion-btn"
                    onClick={() => {
                      setInput(suggestion.query);
                      setTimeout(() => setInput(''), 0);
                      setTimeout(
                        () => {
                          const userMsg = {
                            id: messages.length + 1,
                            text: suggestion.query,
                            sender: 'user',
                            timestamp: new Date(),
                          };
                          setMessages((prev) => [...prev, userMsg]);
                          setLoading(true);

                          setTimeout(() => {
                            const response = findResponse(suggestion.query);
                            const botMsg = {
                              id: messages.length + 2,
                              text: response,
                              sender: 'bot',
                              timestamp: new Date(),
                            };
                            setMessages((prev) => [...prev, botMsg]);
                            setLoading(false);
                          }, 600);
                        },
                        100
                      );
                    }}
                  >
                    {suggestion.text}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="ai-chatbot-input">
            <input
              type="text"
              placeholder="Ask me anything..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={loading}
            />
            <button
              onClick={handleSendMessage}
              disabled={loading || !input.trim()}
              className="ai-send-btn"
            >
              {loading ? '...' : '→'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AIChatbot;
