export interface Student {
  id: string;
  name: string;
  status: 'online' | 'offline';
  lastActive?: string;
}

export interface Message {
  id: string;
  sender: string;
  senderType: 'student' | 'teacher' | 'ai';
  content: string;
  timestamp: string;
  isRead?: boolean;
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