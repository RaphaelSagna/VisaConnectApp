// Frontend chat service now uses backend API instead of Firebase directly
// This provides better security and centralized Firebase management
//
// Current Implementation: Polling-based with error handling
// Future Improvement: Replace with actual Firestore real-time listeners
// Benefits of Firestore listeners:
// - Real-time updates without polling
// - Better performance and battery life
// - Automatic offline sync
// - Built-in conflict resolution

export interface Message {
  id?: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: any; // Changed from Timestamp to any for backend compatibility
  read: boolean;
}

export interface Conversation {
  id?: string;
  participants: string[];
  lastMessage?: Message;
  lastMessageTime?: any; // Changed from Timestamp to any for backend compatibility
  unreadCount?: { [userId: string]: number };
  createdAt: any; // Changed from Timestamp to any for backend compatibility
  updatedAt: any; // Changed from Timestamp to any for backend compatibility
}

export interface ChatUser {
  id: string;
  firstName: string;
  lastName: string;
  profilePhotoUrl?: string;
  lastSeen?: any; // Changed from Timestamp to any for backend compatibility
}

class ChatService {
  private getAuthToken(): string | null {
    return localStorage.getItem('userToken');
  }

  private async makeRequest(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<any> {
    const token = this.getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`/api/chat${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Create a new conversation between two users
  async createConversation(userId1: string, userId2: string): Promise<string> {
    try {
      const response = await this.makeRequest('/conversations', {
        method: 'POST',
        body: JSON.stringify({ otherUserId: userId2 }),
      });
      return response.data.conversationId;
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
      const response = await this.makeRequest(
        `/conversations/${conversationId}/messages`,
        {
          method: 'POST',
          body: JSON.stringify({
            content: message.content,
            receiverId: message.receiverId,
          }),
        }
      );
      return response.data.messageId;
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
      const response = await this.makeRequest('/conversations', {
        method: 'POST',
        body: JSON.stringify({ otherUserId: userId2 }),
      });
      return response.data.conversationId;
    } catch (error) {
      console.error('Error getting or creating conversation:', error);
      throw new Error('Failed to get or create conversation');
    }
  }

  // Get messages for a conversation (polling-based for now)
  async getMessages(conversationId: string): Promise<Message[]> {
    try {
      const response = await this.makeRequest(
        `/conversations/${conversationId}/messages`
      );
      return response.data || [];
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Return empty array instead of throwing error for better UX
      return [];
    }
  }

  // Get user's conversations (polling-based for now)
  async getConversations(): Promise<Conversation[]> {
    try {
      const response = await this.makeRequest('/conversations');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching conversations:', error);
      // Return empty array instead of throwing error for better UX
      return [];
    }
  }

  // Mark messages as read
  async markMessagesAsRead(
    conversationId: string,
    userId: string
  ): Promise<void> {
    try {
      await this.makeRequest(`/conversations/${conversationId}/read`, {
        method: 'PUT',
      });
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw new Error('Failed to mark messages as read');
    }
  }

  // Get user's unread message count
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const conversations = await this.getConversations();
      let totalUnread = 0;
      conversations.forEach((conversation) => {
        totalUnread += conversation.unreadCount?.[userId] || 0;
      });
      return totalUnread;
    } catch (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }
  }

  // Real-time Firestore listeners
  listenToMessages(
    conversationId: string,
    callback: (messages: Message[]) => void
  ): () => void {
    // Try Firestore listener; fallback to polling on failure
    try {
      // Lazy require to avoid hard dependency if env vars are missing
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const {
        ensureFirebase,
        ensureSignedInAnonymously,
      } = require('./firebase');
      const bundle = ensureFirebase?.();
      if (!bundle) throw new Error('Firebase not configured');
      const { db } = bundle;
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const {
        collection,
        query,
        orderBy,
        onSnapshot,
      } = require('firebase/firestore');

      ensureSignedInAnonymously?.().catch(() => undefined);

      const q = query(
        collection(db, 'conversations', conversationId, 'messages'),
        orderBy('timestamp', 'asc')
      );

      const unsub = onSnapshot(
        q,
        (snap: any) => {
          const msgs: Message[] = [];
          snap.forEach((doc: any) => msgs.push({ id: doc.id, ...doc.data() }));
          callback(msgs);
        },
        (_err: any) => {
          unsub();
          return this._startMessagesPolling(conversationId, callback);
        }
      );

      return () => unsub();
    } catch (_e) {
      return this._startMessagesPolling(conversationId, callback);
    }
  }

  private _startMessagesPolling(
    conversationId: string,
    callback: (messages: Message[]) => void
  ): () => void {
    let isActive = true;
    const poll = async () => {
      if (!isActive) return;
      try {
        const messages = await this.getMessages(conversationId);
        callback(messages);
      } catch (error) {
        console.error('Error polling messages:', error);
      }
      if (isActive) setTimeout(poll, 2000);
    };
    poll();
    return () => {
      isActive = false;
    };
  }

  listenToConversations(
    userId: string,
    callback: (conversations: Conversation[]) => void
  ): () => void {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const {
        ensureFirebase,
        ensureSignedInAnonymously,
      } = require('./firebase');
      const bundle = ensureFirebase?.();
      if (!bundle) throw new Error('Firebase not configured');
      const { db } = bundle;
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const {
        collection,
        query,
        where,
        orderBy,
        onSnapshot,
      } = require('firebase/firestore');

      ensureSignedInAnonymously?.().catch(() => undefined);

      const q = query(
        collection(db, 'conversations'),
        where('participants', 'array-contains', userId),
        orderBy('lastMessageTime', 'desc')
      );

      const unsub = onSnapshot(
        q,
        (snap: any) => {
          const rows: Conversation[] = [];
          snap.forEach((doc: any) => rows.push({ id: doc.id, ...doc.data() }));
          callback(rows);
        },
        (_err: any) => {
          unsub();
          return this._startConversationsPolling(userId, callback);
        }
      );

      return () => unsub();
    } catch (_e) {
      return this._startConversationsPolling(userId, callback);
    }
  }

  private _startConversationsPolling(
    _userId: string,
    callback: (conversations: Conversation[]) => void
  ): () => void {
    let isActive = true;
    const poll = async () => {
      if (!isActive) return;
      try {
        const conversations = await this.getConversations();
        callback(conversations);
      } catch (error) {
        console.error('Error polling conversations:', error);
      }
      if (isActive) setTimeout(poll, 4000);
    };
    poll();
    return () => {
      isActive = false;
    };
  }
}

export const chatService = new ChatService();
