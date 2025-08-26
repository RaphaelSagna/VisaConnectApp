import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ChatList from '../components/ChatList';
import Chat from '../components/Chat';
import { useUserStore } from '../stores/userStore';

const ChatScreen: React.FC = () => {
  const navigate = useNavigate();

  const [selectedConversationId, setSelectedConversationId] =
    useState<string>('');
  const [otherUserId, setOtherUserId] = useState<string>('');
  const [otherUserName, setOtherUserName] = useState<string>('');
  const [otherUserPhoto, setOtherUserPhoto] = useState<string>('');

  const handleSelectConversation = (
    conversationId: string,
    otherUserId: string,
    otherUserName: string
  ) => {
    setSelectedConversationId(conversationId);
    setOtherUserId(otherUserId);
    setOtherUserName(otherUserName);
    // In production, you'd fetch the other user's photo here
    setOtherUserPhoto('');
  };

  // If a conversation is selected, show the chat view
  if (selectedConversationId) {
    return (
      <div className="h-screen flex flex-col bg-white">
        {/* Chat Header */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center">
          <button
            onClick={() => setSelectedConversationId('')}
            className="mr-3 p-1"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <div className="flex items-center flex-1">
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center mr-3">
              <span className="text-gray-600 font-medium">
                {otherUserName.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">{otherUserName}</h2>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-hidden">
          <Chat
            conversationId={selectedConversationId}
            otherUserId={otherUserId}
            otherUserName={otherUserName}
            otherUserPhoto={otherUserPhoto}
          />
        </div>
      </div>
    );
  }

  // Main chat list view
  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Chat List */}
      <div className="flex-1 overflow-hidden">
        <ChatList
          onSelectConversation={handleSelectConversation}
          selectedConversationId={selectedConversationId}
        />
      </div>
    </div>
  );
};

export default ChatScreen;
