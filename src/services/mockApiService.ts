import { generateDashboardData, courseOptions, semesterOptions } from '@/mockData/classDashboardData';

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API service
export const mockApiService = {
  // Fetch dashboard data
  fetchDashboardData: async (courseId: string, semesterId: string) => {
    // Simulate network delay
    await delay(800);
    
    // Generate data based on course and semester
    const data = generateDashboardData(courseId, semesterId);
    
    return {
      ...data,
      courseOptions,
      semesterOptions
    };
  },
  
  // Fetch assignment submission data
  fetchAssignmentSubmission: async (assignmentName: string) => {
    // Simulate network delay
    await delay(600);
    
    // Extract class ID from assignment name (e.g., "Bài tập 1 - C01" -> "C01")
    const classId = assignmentName.split(' - ')[1] || 'C01';
    
    // Generate random students who submitted
    const studentsSubmitted = Array.from({ length: Math.floor(Math.random() * 4) + 1 }, (_, i) => ({
      mssv: `${classId}${(i + 1).toString().padStart(3, '0')}`,
      name: `Sinh viên ${classId}-${i + 1}`,
      progress: Math.floor(Math.random() * 100),
      score: `${Math.floor(Math.random() * 10)}/10`,
      status: ['ĐẠT CHỈ TIÊU', 'KHÁ', 'CẦN CẢI THIỆN', 'NGUY HIỂM'][Math.floor(Math.random() * 4)] as 'ĐẠT CHỈ TIÊU' | 'KHÁ' | 'CẦN CẢI THIỆN' | 'NGUY HIỂM'
    }));
    
    // Generate random students who didn't submit
    const studentsNotSubmitted = Array.from({ length: 5 - studentsSubmitted.length }, (_, i) => ({
      mssv: `${classId}${(i + studentsSubmitted.length + 1).toString().padStart(3, '0')}`,
      name: `Sinh viên ${classId}-${i + studentsSubmitted.length + 1}`,
      progress: Math.floor(Math.random() * 100),
      score: '0/10',
      status: 'NGUY HIỂM' as 'NGUY HIỂM'
    }));
    
    return {
      name: assignmentName,
      studentsSubmitted,
      studentsNotSubmitted
    };
  },
  
  // Send reminder to all students
  sendReminder: async (assignmentName: string) => {
    await delay(500);
    return { success: true, message: `Đã gửi nhắc nhở cho tất cả sinh viên về ${assignmentName}` };
  },
  
  // Send reminder to specific student
  sendReminderToStudent: async (assignmentName: string, mssv: string) => {
    await delay(500);
    return { success: true, message: `Đã gửi nhắc nhở cho sinh viên ${mssv} về ${assignmentName}` };
  },
  
  // Extend deadline for assignment
  extendDeadline: async (assignmentName: string) => {
    await delay(500);
    return { success: true, message: `Đã gia hạn thời gian nộp bài cho ${assignmentName}` };
  }
};