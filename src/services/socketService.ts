import { io, Socket } from 'socket.io-client';
import { Message, User } from '../pages/chat/types';

class SocketService {
  private socket: Socket | null = null;
  private listeners: Map<string, Function[]> = new Map();

  // Initialize socket connection
  connect(url: string, token: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.socket = io(url, {
          auth: {
            token
          },
          transports: ['websocket'],
          reconnection: true,
          reconnectionAttempts: 5,
          reconnectionDelay: 1000
        });

        this.socket.on('connect', () => {
          console.log('Socket connected successfully');
          resolve();
        });

        this.socket.on('connect_error', (error) => {
          console.error('Socket connection error:', error);
          reject(error);
        });

        this.socket.on('disconnect', (reason) => {
          console.log('Socket disconnected:', reason);
        });

        // Setup default event listeners
        this.setupEventListeners();
      } catch (error) {
        console.error('Socket initialization error:', error);
        reject(error);
      }
    });
  }

  // Disconnect socket
  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // Setup default event listeners
  private setupEventListeners(): void {
    if (!this.socket) return;

    // Listen for new messages
    this.socket.on('new_message', (message: Message) => {
      this.triggerEvent('message', message);
    });

    // Listen for typing indicators
    this.socket.on('typing', (data: { userId: string; isTyping: boolean }) => {
      this.triggerEvent('typing', data);
    });

    // Listen for user status changes
    this.socket.on('user_status', (data: { userId: string; status: string }) => {
      this.triggerEvent('user_status', data);
    });

    // Listen for new conversations
    this.socket.on('new_conversation', (conversationId: string) => {
      this.triggerEvent('new_conversation', conversationId);
    });
  }

  // Send a message
  sendMessage(message: Omit<Message, 'id' | 'timestamp'>): void {
    if (!this.socket) {
      console.error('Socket not connected');
      return;
    }
    this.socket.emit('send_message', message);
  }

  // Send typing indicator
  sendTypingIndicator(receiverId: string, isTyping: boolean): void {
    if (!this.socket) {
      console.error('Socket not connected');
      return;
    }
    this.socket.emit('typing', { receiverId, isTyping });
  }

  // Mark messages as read
  markMessagesAsRead(conversationId: string, messageIds: string[]): void {
    if (!this.socket) {
      console.error('Socket not connected');
      return;
    }
    this.socket.emit('mark_read', { conversationId, messageIds });
  }

  // Add event listener
  on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  // Remove event listener
  off(event: string, callback: Function): void {
    if (!this.listeners.has(event)) return;
    
    const callbacks = this.listeners.get(event) || [];
    const index = callbacks.indexOf(callback);
    
    if (index !== -1) {
      callbacks.splice(index, 1);
      this.listeners.set(event, callbacks);
    }
  }

  // Trigger event
  private triggerEvent(event: string, data: any): void {
    if (!this.listeners.has(event)) return;
    
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`Error in ${event} event handler:`, error);
      }
    });
  }

  // Check if socket is connected
  isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

// Create a singleton instance
const socketService = new SocketService();
export default socketService;