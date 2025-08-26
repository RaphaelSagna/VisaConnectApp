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
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Listen to messages in this conversation with real-time updates
  useEffect(() => {
    if (!conversationId) return;

    const unsubscribe = chatService.listenToMessages(
      conversationId,
      (newMessages) => {
        setMessages(newMessages);
        scrollToBottom();
      }
    );

    return () => unsubscribe();
  }, [conversationId]);

  // Scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

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
      timestamp: new Date(),
      read: false,
    };

    // Add message to UI immediately (optimistic update)
    setMessages((prev) => [...prev, optimisticMessage]);
    setNewMessage('');

    // Scroll to bottom to show new message
    setTimeout(() => scrollToBottom(), 100);

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
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!user) {
    return <div className="text-center py-8">Please log in to chat</div>;
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
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
                  className={`max-w-xs px-4 py-2 rounded-lg ${
                    isOwnMessage
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  } ${message.id?.startsWith('temp-') ? 'opacity-70' : ''}`}
                >
                  <div className="flex items-center space-x-2">
                    <p className="text-sm">{message.content}</p>
                    {message.id?.startsWith('temp-') && (
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-current rounded-full animate-pulse"></div>
                        <div
                          className="w-2 h-2 bg-current rounded-full animate-pulse"
                          style={{ animationDelay: '0.2s' }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-current rounded-full animate-pulse"
                          style={{ animationDelay: '0.4s' }}
                        ></div>
                      </div>
                    )}
                  </div>
                  <p
                    className={`text-xs mt-1 ${
                      isOwnMessage ? 'text-blue-100' : 'text-gray-500'
                    }`}
                  >
                    {formatTime(message.timestamp)}
                    {message.id?.startsWith('temp-') && (
                      <span className="ml-2 text-xs">Sending...</span>
                    )}
                  </p>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
            disabled={false} // Always enabled for better UX
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 transition-colors duration-200"
          >
            <PaperAirplaneIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Send</span>
          </button>
        </form>

        {/* Typing indicators */}
        {messages.some((msg) => msg.id?.startsWith('temp-')) && (
          <div className="mt-2 text-xs text-gray-500 flex items-center space-x-1">
            <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse"></div>
              <div
                className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse"
                style={{ animationDelay: '0.2s' }}
              ></div>
              <div
                className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-pulse"
                style={{ animationDelay: '0.4s' }}
              ></div>
            </div>
            <span>Message sending...</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
