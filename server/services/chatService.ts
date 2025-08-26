import admin from 'firebase-admin';
import { FieldValue } from 'firebase-admin/firestore';

// Lazy-load Firebase Firestore to ensure it's initialized when needed
function getFirestore() {
  if (!admin.apps.length) {
    throw new Error(
      'Firebase Admin not initialized. Please ensure the main server has started.'
    );
  }
  return admin.firestore();
}

export interface Message {
  id?: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: any;
  read: boolean;
}

export interface Conversation {
  id?: string;
  participants: string[];
  lastMessage?: Message;
  lastMessageTime?: any;
  unreadCount?: { [userId: string]: number };
  createdAt: any;
  updatedAt: any;
}

class ChatService {
  // Create a new conversation between two users
  async createConversation(userId1: string, userId2: string): Promise<string> {
    try {
      const conversationData: Omit<Conversation, 'id'> = {
        participants: [userId1, userId2].sort(),
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp(),
        unreadCount: {
          [userId1]: 0,
          [userId2]: 0,
        },
      };

      const docRef = await getFirestore()
        .collection('conversations')
        .add(conversationData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw new Error('Failed to create conversation');
    }
  }

  // Send a message in a conversation
  async sendMessage(
    conversationId: string,
    message: Omit<Message, 'id' | 'timestamp'>
  ): Promise<string> {
    try {
      const messageData: Omit<Message, 'id'> = {
        ...message,
        timestamp: FieldValue.serverTimestamp(),
      };

      const docRef = await getFirestore()
        .collection('conversations')
        .doc(conversationId)
        .collection('messages')
        .add(messageData);

      // Update conversation with last message info
      await getFirestore()
        .collection('conversations')
        .doc(conversationId)
        .update({
          lastMessage: messageData,
          lastMessageTime: messageData.timestamp,
          updatedAt: FieldValue.serverTimestamp(),
          [`unreadCount.${message.receiverId}`]:
            message.receiverId === message.senderId ? 0 : 1,
        });

      return docRef.id;
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error('Failed to send message');
    }
  }

  // Get or create conversation between two users
  async getOrCreateConversation(
    userId1: string,
    userId2: string
  ): Promise<string> {
    try {
      // Check if conversation already exists
      const existingConversation = await this.findConversation(
        userId1,
        userId2
      );
      if (existingConversation) {
        return existingConversation.id!;
      }

      // Create new conversation if none exists
      return await this.createConversation(userId1, userId2);
    } catch (error) {
      console.error('Error getting or creating conversation:', error);
      throw new Error('Failed to get or create conversation');
    }
  }

  // Find existing conversation between two users
  private async findConversation(
    userId1: string,
    userId2: string
  ): Promise<Conversation | null> {
    try {
      const participants = [userId1, userId2].sort();
      const query = getFirestore()
        .collection('conversations')
        .where('participants', '==', participants);

      const snapshot = await query.get();

      if (!snapshot.empty) {
        const doc = snapshot.docs[0];
        return { id: doc.id, ...doc.data() } as Conversation;
      }

      return null;
    } catch (error) {
      console.error('Error finding conversation:', error);
      return null;
    }
  }

  // Get messages for a conversation
  async getConversationMessages(
    conversationId: string,
    userId: string
  ): Promise<Message[]> {
    try {
      const snapshot = await getFirestore()
        .collection('conversations')
        .doc(conversationId)
        .collection('messages')
        .orderBy('timestamp', 'asc')
        .get();

      const messages: Message[] = [];
      snapshot.forEach((doc) => {
        messages.push({ id: doc.id, ...doc.data() } as Message);
      });

      return messages;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw new Error('Failed to fetch messages');
    }
  }

  // Get user's conversations
  async getUserConversations(userId: string): Promise<Conversation[]> {
    try {
      // First try with ordering (requires index)
      try {
        const snapshot = await getFirestore()
          .collection('conversations')
          .where('participants', 'array-contains', userId)
          .orderBy('lastMessageTime', 'desc')
          .get();

        const conversations: Conversation[] = [];
        snapshot.forEach((doc) => {
          conversations.push({ id: doc.id, ...doc.data() } as Conversation);
        });
        return conversations;
      } catch (indexError: any) {
        // If index doesn't exist, fall back to unordered query
        console.warn(
          'Index not ready, using fallback query:',
          indexError?.message || 'Unknown error'
        );
        const snapshot = await getFirestore()
          .collection('conversations')
          .where('participants', 'array-contains', userId)
          .get();

        const conversations: Conversation[] = [];
        snapshot.forEach((doc) => {
          conversations.push({ id: doc.id, ...doc.data() } as Conversation);
        });

        // Sort in memory as fallback
        return conversations.sort(
          (a, b) =>
            (b.lastMessageTime?.toMillis?.() || 0) -
            (a.lastMessageTime?.toMillis?.() || 0)
        );
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      return []; // Return empty array instead of throwing
    }
  }

  // Mark messages as read
  async markMessagesAsRead(
    conversationId: string,
    userId: string
  ): Promise<void> {
    try {
      await getFirestore()
        .collection('conversations')
        .doc(conversationId)
        .update({
          [`unreadCount.${userId}`]: 0,
        });
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw new Error('Failed to mark messages as read');
    }
  }

  // Get user's unread message count
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const snapshot = await getFirestore()
        .collection('conversations')
        .where('participants', 'array-contains', userId)
        .get();

      let totalUnread = 0;
      snapshot.forEach((doc) => {
        const data = doc.data();
        totalUnread += data.unreadCount?.[userId] || 0;
      });

      return totalUnread;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }
}

export const chatService = new ChatService();
