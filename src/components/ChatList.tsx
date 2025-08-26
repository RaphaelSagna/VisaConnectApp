import React, { useState, useEffect } from 'react';
import { useUserStore } from '../stores/userStore';
import { chatService, Conversation } from '../api/chatService';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

interface ChatListProps {
  onSelectConversation: (
    conversationId: string,
    otherUserId: string,
    otherUserName: string
  ) => void;
  selectedConversationId?: string;
}

const ChatList: React.FC<ChatListProps> = ({
  onSelectConversation,
  selectedConversationId,
}) => {
  const { user } = useUserStore();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Listen to user's conversations
  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = chatService.listenToConversations(
      user.uid,
      (newConversations) => {
        setConversations(newConversations);
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user?.uid]);

  // Get the other user's ID from a conversation
  const getOtherUserId = (conversation: Conversation): string => {
    if (!user?.uid) return '';
    return conversation.participants.find((id) => id !== user.uid) || '';
  };

  // Get the other user's name (this would need to be fetched from user data)
  const getOtherUserName = (conversation: Conversation): string => {
    // For now, we'll use a placeholder
    // In production, you'd want to fetch user details or store them in the conversation
    return 'User';
  };

  // Format timestamp for display
  const formatTime = (timestamp: any) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin h-6 w-6 border-2 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-500">
        <ChatBubbleLeftIcon className="w-12 h-12 mb-4" />
        <p className="text-lg font-medium">No conversations yet</p>
        <p className="text-sm">
          Start chatting with other users to see conversations here
        </p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      {conversations.map((conversation) => {
        const otherUserId = getOtherUserId(conversation);
        const otherUserName = getOtherUserName(conversation);
        const isSelected = conversation.id === selectedConversationId;
        const unreadCount = conversation.unreadCount?.[user?.uid || ''] || 0;

        return (
          <div
            key={conversation.id}
            onClick={() =>
              onSelectConversation(conversation.id!, otherUserId, otherUserName)
            }
            className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
              isSelected ? 'bg-blue-50 border-blue-200' : ''
            }`}
          >
            <div className="flex items-center space-x-3">
              {/* User Avatar */}
              <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0">
                <span className="text-gray-600 font-medium">
                  {otherUserName.charAt(0).toUpperCase()}
                </span>
              </div>

              {/* Conversation Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-gray-900 truncate">
                    {otherUserName}
                  </h3>
                  <span className="text-xs text-gray-500">
                    {conversation.lastMessageTime
                      ? formatTime(conversation.lastMessageTime)
                      : ''}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-gray-600 truncate">
                    {conversation.lastMessage?.content || 'No messages yet'}
                  </p>
                  {unreadCount > 0 && (
                    <span className="bg-blue-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ChatList;
