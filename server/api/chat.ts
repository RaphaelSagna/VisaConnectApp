import { Express, Request, Response } from 'express';
import { authenticateUser } from '../middleware/auth';
import { chatService } from '../services/chatService';
import { UserService } from '../services/userService';

export default function chatApi(app: Express) {
  const userService = new UserService();

  // Get user's conversations with user details
  app.get(
    '/api/chat/conversations',
    authenticateUser,
    async (req: Request, res: Response) => {
      try {
        const userId = req.user?.uid;
        if (!userId) {
          return res
            .status(401)
            .json({ success: false, message: 'User not authenticated' });
        }

        const conversations = await chatService.getUserConversations(userId);

        // Enhance conversations with user details
        const enhancedConversations = await Promise.all(
          conversations.map(async (conversation) => {
            const otherUserId = conversation.participants.find(
              (id: string) => id !== userId
            );
            if (otherUserId) {
              try {
                const otherUser = await userService.getUserById(otherUserId);
                return {
                  ...conversation,
                  otherUser: otherUser
                    ? {
                        id: otherUser.id,
                        firstName: otherUser.first_name,
                        lastName: otherUser.last_name,
                        fullName:
                          `${otherUser.first_name || ''} ${
                            otherUser.last_name || ''
                          }`.trim() || 'User',
                        profilePhotoUrl: otherUser.profile_photo_url,
                        occupation: otherUser.occupation,
                        visaType: otherUser.visa_type,
                      }
                    : null,
                };
              } catch (error) {
                console.error(`Error fetching user ${otherUserId}:`, error);
                return {
                  ...conversation,
                  otherUser: null,
                };
              }
            }
            return conversation;
          })
        );

        res.json({ success: true, data: enhancedConversations });
      } catch (error) {
        console.error('Error fetching conversations:', error);
        res
          .status(500)
          .json({ success: false, message: 'Failed to fetch conversations' });
      }
    }
  );

  // Get user information for a conversation
  app.get(
    '/api/chat/conversations/:conversationId/user-info',
    authenticateUser,
    async (req: Request, res: Response) => {
      try {
        const { conversationId } = req.params;
        const userId = req.user?.uid;

        if (!userId) {
          return res
            .status(401)
            .json({ success: false, message: 'User not authenticated' });
        }

        const conversation = await chatService.getConversation(conversationId);
        if (!conversation) {
          return res
            .status(404)
            .json({ success: false, message: 'Conversation not found' });
        }

        const otherUserId = conversation.participants.find(
          (id: string) => id !== userId
        );
        if (!otherUserId) {
          return res
            .status(400)
            .json({ success: false, message: 'Invalid conversation' });
        }

        const otherUser = await userService.getUserById(otherUserId);
        if (!otherUser) {
          return res
            .status(404)
            .json({ success: false, message: 'User not found' });
        }

        res.json({
          success: true,
          data: {
            id: otherUser.id,
            firstName: otherUser.first_name,
            lastName: otherUser.last_name,
            fullName:
              `${otherUser.first_name || ''} ${
                otherUser.last_name || ''
              }`.trim() || 'User',
            profilePhotoUrl: otherUser.profile_photo_url,
            occupation: otherUser.occupation,
            visaType: otherUser.visa_type,
            currentLocation: otherUser.current_location,
            bio: otherUser.bio,
          },
        });
      } catch (error) {
        console.error('Error fetching user info:', error);
        res
          .status(500)
          .json({ success: false, message: 'Failed to fetch user info' });
      }
    }
  );

  // Get messages for a conversation
  app.get(
    '/api/chat/conversations/:conversationId/messages',
    authenticateUser,
    async (req: Request, res: Response) => {
      try {
        const { conversationId } = req.params;
        const userId = req.user?.uid;

        if (!userId) {
          return res
            .status(401)
            .json({ success: false, message: 'User not authenticated' });
        }

        const messages = await chatService.getConversationMessages(
          conversationId,
          userId
        );
        res.json({ success: true, data: messages });
      } catch (error) {
        console.error('Error fetching messages:', error);
        res
          .status(500)
          .json({ success: false, message: 'Failed to fetch messages' });
      }
    }
  );

  // Send a message
  app.post(
    '/api/chat/conversations/:conversationId/messages',
    authenticateUser,
    async (req: Request, res: Response) => {
      try {
        const { conversationId } = req.params;
        const { content, receiverId } = req.body;
        const senderId = req.user?.uid;

        if (!senderId) {
          return res
            .status(401)
            .json({ success: false, message: 'User not authenticated' });
        }

        if (!content || !receiverId) {
          return res
            .status(400)
            .json({ success: false, message: 'Missing required fields' });
        }

        const messageId = await chatService.sendMessage(conversationId, {
          senderId,
          receiverId,
          content,
          read: false,
        });

        res.json({ success: true, data: { messageId } });
      } catch (error) {
        console.error('Error sending message:', error);
        res
          .status(500)
          .json({ success: false, message: 'Failed to send message' });
      }
    }
  );

  // Create or get conversation between two users
  app.post(
    '/api/chat/conversations',
    authenticateUser,
    async (req: Request, res: Response) => {
      try {
        const { participantIds } = req.body;
        const currentUserId = req.user?.uid;

        if (!currentUserId) {
          return res
            .status(401)
            .json({ success: false, message: 'User not authenticated' });
        }

        if (
          !participantIds ||
          !Array.isArray(participantIds) ||
          participantIds.length !== 2
        ) {
          return res.status(400).json({
            success: false,
            message: 'Missing or invalid participant IDs',
          });
        }

        // Find the other user ID (not the current user)
        const otherUserId = participantIds.find((id) => id !== currentUserId);

        if (!otherUserId) {
          return res
            .status(400)
            .json({ success: false, message: 'Invalid participant IDs' });
        }

        const conversationId = await chatService.getOrCreateConversation(
          currentUserId,
          otherUserId
        );
        res.json({ success: true, data: { id: conversationId } });
      } catch (error) {
        console.error('Error creating conversation:', error);
        res
          .status(500)
          .json({ success: false, message: 'Failed to create conversation' });
      }
    }
  );

  // Mark messages as read
  app.put(
    '/api/chat/conversations/:conversationId/read',
    authenticateUser,
    async (req: Request, res: Response) => {
      try {
        const { conversationId } = req.params;
        const userId = req.user?.uid;

        if (!userId) {
          return res
            .status(401)
            .json({ success: false, message: 'User not authenticated' });
        }

        await chatService.markMessagesAsRead(conversationId, userId);
        res.json({ success: true });
      } catch (error) {
        console.error('Error marking messages as read:', error);
        res
          .status(500)
          .json({ success: false, message: 'Failed to mark messages as read' });
      }
    }
  );
}
