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
  
  // Learning Path endpoints for course management and progress tracking
  LEARNING_PATH: {
    GET_ALL_COURSES: "/api/learning-path/courses",
    GET_COURSE_DETAILS: "/api/learning-path/courses/:id",
    GET_IN_PROGRESS_COURSES: "/api/learning-path/courses/in-progress",
    GET_RECOMMENDED_COURSES: "/api/learning-path/courses/recommended",
    UPDATE_COURSE_PROGRESS: "/api/learning-path/courses/:id/progress",
    ENROLL_COURSE: "/api/learning-path/courses/:id/enroll",
    GET_COURSE_MODULES: "/api/learning-path/courses/:id/modules",
    GET_MODULE_CONTENT: "/api/learning-path/modules/:id",
    COMPLETE_MODULE: "/api/learning-path/modules/:id/complete",
    GET_COURSE_CERTIFICATES: "/api/learning-path/certificates",
    DOWNLOAD_CERTIFICATE: "/api/learning-path/certificates/:id/download",
  },
  
  // GameFi endpoints for educational gamification
  GAMEFI: {
    // Game management
    GET_GAMES: "/api/gamefi/games",
    GET_GAME_DETAILS: "/api/gamefi/games/:id",
    START_GAME: "/api/gamefi/games/:id/start",
    COMPLETE_GAME: "/api/gamefi/games/:id/complete",
    SUBMIT_GAME_ANSWER: "/api/gamefi/games/:id/submit",
    RATE_GAME: "/api/gamefi/games/:id/rate",
    
    // Quest management
    GET_QUESTS: "/api/gamefi/quests",
    GET_QUEST_DETAILS: "/api/gamefi/quests/:id",
    START_QUEST: "/api/gamefi/quests/:id/start",
    COMPLETE_QUEST: "/api/gamefi/quests/:id/complete",
    
    // User progress and rewards
    GET_USER_PROFILE: "/api/gamefi/profile",
    UPDATE_USER_PROFILE: "/api/gamefi/profile",
    GET_USER_ACHIEVEMENTS: "/api/gamefi/achievements",
    CLAIM_ACHIEVEMENT: "/api/gamefi/achievements/:id/claim",
    GET_USER_REWARDS: "/api/gamefi/rewards",
    CLAIM_REWARD: "/api/gamefi/rewards/:id/claim",
    
    // Leaderboard
    GET_LEADERBOARD: "/api/gamefi/leaderboard",
    GET_LEADERBOARD_BY_CATEGORY: "/api/gamefi/leaderboard/:category",
    
    // Daily challenges
    GET_DAILY_CHALLENGES: "/api/gamefi/daily-challenges",
    COMPLETE_DAILY_CHALLENGE: "/api/gamefi/daily-challenges/:id/complete",
    
    // Learning paths
    GET_LEARNING_PATHS: "/api/gamefi/learning-paths",
    GET_LEARNING_PATH_DETAILS: "/api/gamefi/learning-paths/:id",
    JOIN_LEARNING_PATH: "/api/gamefi/learning-paths/:id/join",
    UPDATE_LEARNING_PATH_PROGRESS: "/api/gamefi/learning-paths/:id/progress",
  },
  
  // Notification endpoints
  NOTIFICATIONS: {
    GET_NOTIFICATIONS: "/api/notifications",
    MARK_AS_READ: "/api/notifications/:id/read",
    MARK_ALL_AS_READ: "/api/notifications/read-all",
    GET_UNREAD_COUNT: "/api/notifications/unread-count",
  }
}