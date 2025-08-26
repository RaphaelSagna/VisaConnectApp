import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DrawerMenu from '../components/DrawerMenu';
import ChatList from '../components/ChatList';
import Chat from '../components/Chat';
import { useUserStore } from '../stores/userStore';

const ChatScreen: React.FC = () => {
  const navigate = useNavigate();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedConversationId, setSelectedConversationId] =
    useState<string>('');
  const [otherUserId, setOtherUserId] = useState<string>('');
  const [otherUserName, setOtherUserName] = useState<string>('');
  const [otherUserPhoto, setOtherUserPhoto] = useState<string>('');

  const handleOverlayClick = () => {
    setIsDrawerOpen(false);
  };

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

  return (
    <div>
      <DrawerMenu
        open={isDrawerOpen}
        onClose={handleOverlayClick}
        navigate={navigate}
        highlight={undefined}
      />

      {/* Main Content */}
      <div className="flex-1 px-4 md:px-6 py-6 max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Chat</h1>
          <p className="text-gray-600">
            Connect with other users through private messages
          </p>
        </div>

        {/* Chat Interface */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 h-[600px] flex">
          {/* Left Side - Chat List */}
          <div className="w-1/3 border-r border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">Conversations</h2>
            </div>
            <ChatList
              onSelectConversation={handleSelectConversation}
              selectedConversationId={selectedConversationId}
            />
          </div>

          {/* Right Side - Chat Area */}
          <div className="flex-1">
            {selectedConversationId ? (
              <Chat
                conversationId={selectedConversationId}
                otherUserId={otherUserId}
                otherUserName={otherUserName}
                otherUserPhoto={otherUserPhoto}
              />
            ) : (
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
                  <h3 className="text-lg font-medium mb-2">
                    Select a conversation
                  </h3>
                  <p className="text-sm">
                    Choose a conversation from the list to start chatting
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;
