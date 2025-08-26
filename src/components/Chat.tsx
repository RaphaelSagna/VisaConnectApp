import React, { useState, useEffect, useRef } from 'react';
import { useUserStore } from '../stores/userStore';
import { chatService, Message } from '../api/chatService';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

interface ChatProps {
  conversationId: string;
  otherUserId: string;
  otherUserName: string;
  otherUserPhoto?: string;
}

const Chat: React.FC<ChatProps> = ({
  conversationId,
  otherUserId,
  otherUserName,
  otherUserPhoto,
}) => {
  const { user } = useUserStore();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Listen to messages in this conversation with real-time updates
  useEffect(() => {
    if (!conversationId) return;

    const unsubscribe = chatService.listenToMessages(
      conversationId,
      (newMessages) => {
        setMessages(newMessages);
        // Auto-scroll disabled - let user control their own scroll position
      }
    );

    return () => unsubscribe();
  }, [conversationId]);

  // Send a new message with optimistic updates
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const messageContent = newMessage.trim();
    const tempMessageId = `temp-${Date.now()}`;

    // Create optimistic message (appears immediately)
    const optimisticMessage: Message = {
      id: tempMessageId,
      senderId: user.uid,
      receiverId: otherUserId,
      content: messageContent,
      timestamp: new Date().toISOString(), // Use ISO string for consistency
      read: false,
    };

    // Add message to UI immediately (optimistic update)
    setMessages((prev) => [...prev, optimisticMessage]);
    setNewMessage('');

    // Auto-scroll disabled - user controls their own scroll position

    try {
      // Send message to server
      const messageId = await chatService.sendMessage(conversationId, {
        senderId: user.uid,
        receiverId: otherUserId,
        content: messageContent,
        read: false,
      });

      // Replace optimistic message with real message
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === tempMessageId ? { ...msg, id: messageId } : msg
        )
      );
    } catch (error) {
      console.error('Failed to send message:', error);

      // Remove optimistic message on error and show error state
      setMessages((prev) => prev.filter((msg) => msg.id !== tempMessageId));

      // You might want to show an error toast here
      // For now, we'll just log the error
    }
  };

  // Format timestamp for display
  const formatTime = (timestamp: any) => {
    if (!timestamp) return '';

    try {
      let date: Date;

      // Handle Firestore Timestamp objects with .toDate() method
      if (timestamp.toDate && typeof timestamp.toDate === 'function') {
        date = timestamp.toDate();
      }
      // Handle Firestore Timestamp objects with _seconds and _nanoseconds
      else if (timestamp._seconds && typeof timestamp._seconds === 'number') {
        // Convert seconds to milliseconds and create Date
        date = new Date(timestamp._seconds * 1000);
      }
      // Handle regular Date objects
      else if (timestamp instanceof Date) {
        date = timestamp;
      }
      // Handle timestamp numbers or strings
      else {
        date = new Date(timestamp);
      }

      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid timestamp:', timestamp);
        return '';
      }

      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error) {
      console.warn(
        'Error formatting timestamp:',
        error,
        'Timestamp value:',
        timestamp
      );
      return '';
    }
  };

  if (!user) {
    return <div className="text-center py-8">Please log in to chat</div>;
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Messages Area */}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium mb-2">Start a conversation</h3>
              <p className="text-sm">Send a message to begin chatting</p>
            </div>
          </div>
        ) : (
          messages.map((message) => {
            const isOwnMessage = message.senderId === user.uid;
            return (
              <div
                key={message.id}
                className={`flex ${
                  isOwnMessage ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-[75%] md:max-w-md px-4 py-3 rounded-2xl ${
                    isOwnMessage
                      ? 'bg-gray-200 text-gray-900 shadow-sm border border-gray-300'
                      : 'bg-white text-gray-900 shadow-sm border border-gray-200'
                  } ${message.id?.startsWith('temp-') ? 'opacity-70' : ''}`}
                >
                  <div className="flex items-center space-x-2">
                    <p className="text-sm">{message.content}</p>
                  </div>
                  <p className={`text-xs mt-2 text-gray-500`}>
                    {formatTime(message.timestamp) || (
                      <span title={`Raw timestamp: ${message.timestamp}`}>
                        Just now
                      </span>
                    )}
                    {message.id?.startsWith('temp-') && (
                      <span className="ml-2 text-xs">Sending...</span>
                    )}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 bg-gray-50 border-t border-gray-200">
        <form
          onSubmit={handleSendMessage}
          className="flex items-center space-x-3"
        >
          {/* Attachment Button */}
          <button
            type="button"
            className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center hover:bg-gray-300 transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>

          {/* Message Input */}
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Send message"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none"
            disabled={false}
          />
        </form>
      </div>
    </div>
  );
};

export default Chat;
