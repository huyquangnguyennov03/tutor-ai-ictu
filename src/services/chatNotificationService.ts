import { Message, Conversation, User } from '../pages/chat/types';
import { mockUsers, mockConversations } from '../mockData/mockDataChat';
import { Roles } from "@/common/constants/roles"

// Define event types
type EventCallback = (data: any) => void;
type EventType = 'newMessage' | 'messageRead' | 'conversationUpdate';

class ChatNotificationService {
  private conversations: Conversation[] = [...mockConversations];
  private users: User[] = [...mockUsers];
  private listeners: Map<EventType, EventCallback[]> = new Map();
  private currentUserId: string = 'teacher1'; // Default to teacher for demo

  constructor() {
    // Initialize listeners map
    this.listeners.set('newMessage', []);
    this.listeners.set('messageRead', []);
    this.listeners.set('conversationUpdate', []);
  }

  // Get all conversations
  getConversations(): Conversation[] {
    return this.conversations;
  }

  // Get unread conversations
  getUnreadConversations(): Conversation[] {
    return this.conversations.filter(conv => 
      (conv.unreadCount && conv.unreadCount > 0) && 
      !conv.participants.includes(this.currentUserId)
    );
  }

  // Get total unread count
  getUnreadCount(): number {
    return this.conversations.reduce((total, conv) => 
      total + (conv.unreadCount || 0), 0
    );
  }

  // Get user by ID
  getUserById(userId: string): User | undefined {
    return this.users.find(user => user.id === userId);
  }

  // Get conversation by ID
  getConversationById(conversationId: string): Conversation | undefined {
    return this.conversations.find(conv => conv.id === conversationId);
  }

  // Get conversation by participant IDs
  getConversationByParticipants(participantIds: string[]): Conversation | undefined {
    return this.conversations.find(conv => 
      participantIds.every(id => conv.participants.includes(id)) &&
      conv.participants.length === participantIds.length
    );
  }

  // Add a new message
  addMessage(message: Message): void {
    const { sender } = message;
    const otherParticipantId = sender !== this.currentUserId ? sender : this.currentUserId;
    
    // Find existing conversation or create new one
    let conversation = this.getConversationByParticipants([this.currentUserId, otherParticipantId]);
    
    if (conversation) {
      // Update existing conversation
      conversation.messages.push(message);
      conversation.lastMessage = message;
      
      // Update unread count if message is from other user
      if (sender !== this.currentUserId) {
        conversation.unreadCount = (conversation.unreadCount || 0) + 1;
      }
    } else {
      // Create new conversation
      const newConversation: Conversation = {
        id: `conv_${Date.now()}`,
        participants: [this.currentUserId, otherParticipantId],
        messages: [message],
        lastMessage: message,
        unreadCount: sender !== this.currentUserId ? 1 : 0
      };
      
      this.conversations.push(newConversation);
      conversation = newConversation;
    }
    
    // Notify listeners
    this.notifyListeners('newMessage', { message, conversation });
    this.notifyListeners('conversationUpdate', { conversations: this.conversations });
  }

  // Mark messages as read
  markMessagesAsRead(conversationId: string): void {
    const conversation = this.getConversationById(conversationId);
    
    if (conversation) {
      // Mark all messages as read
      conversation.messages = conversation.messages.map(msg => ({
        ...msg,
        isRead: true
      }));
      
      // Reset unread count
      conversation.unreadCount = 0;
      
      // Notify listeners
      this.notifyListeners('messageRead', { conversationId });
      this.notifyListeners('conversationUpdate', { conversations: this.conversations });
    }
  }

  // Set current user ID
  setCurrentUserId(userId: string): void {
    this.currentUserId = userId;
  }

  // Add event listener
  addEventListener(event: EventType, callback: EventCallback): void {
    const listeners = this.listeners.get(event) || [];
    listeners.push(callback);
    this.listeners.set(event, listeners);
  }

  // Remove event listener
  removeEventListener(event: EventType, callback: EventCallback): void {
    const listeners = this.listeners.get(event) || [];
    const index = listeners.indexOf(callback);
    
    if (index !== -1) {
      listeners.splice(index, 1);
      this.listeners.set(event, listeners);
    }
  }

  // Notify all listeners of an event
  private notifyListeners(event: EventType, data: any): void {
    const listeners = this.listeners.get(event) || [];
    listeners.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in ${event} event handler:`, error);
      }
    });
  }

  // Simulate receiving a new message (for testing)
  simulateNewMessage(senderId: string, content: string): void {
    const sender = this.getUserById(senderId);
    
    if (!sender) return;
    
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      sender: senderId,
      senderType: sender.role === Roles.TEACHER ? 'teacher' : 'student',
      content,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    
    this.addMessage(newMessage);
  }
}

// Create singleton instance
const chatNotificationService = new ChatNotificationService();
export default chatNotificationService;