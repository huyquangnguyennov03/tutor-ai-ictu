import { Roles } from '../../common/constants/roles';

export interface User {
  id: string;
  name: string;
  email?: string;
  status: 'online' | 'offline' | 'away';
  lastActive?: string;
  role: Roles;
  avatar?: string;
}

export interface Student extends User {
  role: Roles.STUDENT;
  progress?: StudentProgress;
}

export interface Teacher extends User {
  role: Roles.TEACHER;
}

export interface Message {
  id: string;
  sender: string;
  senderType: 'student' | 'teacher' | 'ai';
  content: string;
  timestamp: string;
  isRead?: boolean;
  type?: 'text' | 'image' | 'file';
  fileUrl?: string;
  fileName?: string;
}

export interface Conversation {
  id: string;
  participants: string[]; // User IDs
  messages: Message[];
  lastMessage?: Message;
  unreadCount?: number;
}

export interface CourseClass {
  id: string;
  name: string;
  studentCount?: number;
}

export interface StudentProgress {
  currentScore: number;
  totalScore: number;
  currentChapter: number;
  totalChapters: number;
  completionPercentage: number;
}

export interface ChatState {
  users: User[];
  conversations: Conversation[];
  selectedUser: string | null;
  isTyping: boolean;
}