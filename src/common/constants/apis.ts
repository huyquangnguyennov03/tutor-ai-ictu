/**
 * API Endpoints Configuration
 * 
 * Tập trung quản lý tất cả các endpoint API của ứng dụng
 * Được chia thành các nhóm theo chức năng
 */

export const API_ENDPOINTS = {
  // Core API endpoints for authentication and system functions
  CORE_API: {
    LOGIN: "/auth/login",
    REFRESH_TOKEN: "/auth/refresh-token",
    LOGOUT: "/auth/logout",
    REGISTER: "/auth/register",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
  },
  
  // User management endpoints
  USER: {
    FETCH_USERS: "/users",
    GET_USER_PROFILE: "/users/profile",
    UPDATE_USER_PROFILE: "/users/profile",
    CHANGE_PASSWORD: "/users/change-password",
    UPLOAD_AVATAR: "/users/avatar",
  },
  
  // Course management endpoints
  COURSES: {
    GET_COURSES: "/api/courses",
    GET_COURSE_DETAILS: "/api/courses/:id",
    CREATE_COURSE: "/api/courses",
    UPDATE_COURSE: "/api/courses/:id",
    DELETE_COURSE: "/api/courses/:id",
    ENROLL_COURSE: "/api/courses/:id/enroll",
  },
  
  // Statistics and analytics endpoints
  STATISTICS: {
    GET_SEMESTERS: "https://run.mocky.io/v3/6944656a-f738-4f43-9897-420ed18e2706",
    GET_USER_STATS: "https://run.mocky.io/v3/6944656a-f738-4f43-9897-420ed18e2706",
    GET_COURSE_STATS: "/api/statistics/courses/:id",
    GET_SYSTEM_STATS: "/api/statistics/system",
  },
  
  // Chat Tutor endpoints for AI-powered tutoring
  CHAT_TUTOR: {
    SEND_MESSAGE: "/api/chat/send",
    GET_SUGGESTIONS: "/api/chat/suggestions",
    GET_HISTORY: "/api/chat/history",
    SAVE_CHAT: "/api/chat/save",
    CLEAR_HISTORY: "/api/chat/clear",
    UPLOAD_CODE: "/api/chat/upload-code",
  },
  
  // Learning Process endpoints for student progress tracking
  LEARNING_PROCESS: {
    GET_STUDENT_PROGRESS: "/api/learning/student/:id",
    GET_CHAPTER_PROGRESS: "/api/learning/student/:id/chapters",
    GET_ERROR_ANALYSIS: "/api/learning/student/:id/errors",
    GET_SUGGESTIONS: "/api/learning/student/:id/suggestions",
    UPDATE_PROGRESS: "/api/learning/student/:id/progress",
    GET_SUMMARY_STATS: "/api/learning/student/:id/summary",
  },
  
  // Teacher Dashboard endpoints for class management
  CDASHBOARD: {
    GET_DASHBOARD_DATA: "/api/dashboard/:courseId/:semesterId",
    GET_STUDENTS: "/api/dashboard/students",
    GET_CHAPTERS: "/api/dashboard/chapters",
    GET_ASSIGNMENTS: "/api/dashboard/assignments",
    GET_WARNINGS: "/api/dashboard/warnings",
    GET_TOP_STUDENTS: "/api/dashboard/top-students",
    GET_CLASS_INFO: "/api/dashboard/class-info",
    GET_ASSIGNMENT_SUBMISSION: "/api/dashboard/assignment/:name/submissions",
    SEND_REMINDER: "/api/dashboard/assignment/:name/remind",
    SEND_REMINDER_TO_STUDENT: "/api/dashboard/assignment/:name/remind/:studentId",
    EXTEND_DEADLINE: "/api/dashboard/assignment/:name/extend",
  },
  
  // Chat endpoints for teacher-student communication
  CHAT: {
    GET_CONVERSATIONS: "/api/chat/conversations",
    GET_MESSAGES: "/api/chat/conversations/:id/messages",
    SEND_MESSAGE: "/api/chat/conversations/:id/messages",
    MARK_AS_READ: "/api/chat/conversations/:id/read",
    GET_UNREAD_COUNT: "/api/chat/unread-count",
    CREATE_CONVERSATION: "/api/chat/conversations",
    GET_ONLINE_USERS: "/api/chat/online-users",
    UPLOAD_ATTACHMENT: "/api/chat/upload",
  },
  
  // Assignment endpoints for homework management
  ASSIGNMENTS: {
    GET_ASSIGNMENTS: "/api/assignments",
    GET_ASSIGNMENT_DETAILS: "/api/assignments/:id",
    CREATE_ASSIGNMENT: "/api/assignments",
    UPDATE_ASSIGNMENT: "/api/assignments/:id",
    DELETE_ASSIGNMENT: "/api/assignments/:id",
    SUBMIT_ASSIGNMENT: "/api/assignments/:id/submit",
    GRADE_ASSIGNMENT: "/api/assignments/:id/grade",
    GET_SUBMISSIONS: "/api/assignments/:id/submissions",
  },
  
  // Notification endpoints
  NOTIFICATIONS: {
    GET_NOTIFICATIONS: "/api/notifications",
    MARK_AS_READ: "/api/notifications/:id/read",
    MARK_ALL_AS_READ: "/api/notifications/read-all",
    GET_UNREAD_COUNT: "/api/notifications/unread-count",
  }
}