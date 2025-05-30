/**
 * API Endpoints Configuration
 *
 * Tập trung quản lý tất cả các endpoint API của ứng dụng
 * Được chia thành các nhóm theo chức năng
 */

// Cấu hình API base URL
export const API_BASE_URL = 'http://localhost:8000';

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

  // Student management endpoints
  STUDENTS: {
    GET_STUDENTS: "/api/students",
    GET_STUDENT_PROGRESS: "/api/progress/:studentid",
    GET_ALL_PROGRESS: "/api/progress", // Thêm endpoint mới để lấy tất cả tiến độ
    GET_STUDENT_REPORT: "/api/student-report/:studentid",
    PREDICT_INTERVENTION: "/api/predict-intervention/:studentid",
    CREATE_WARNING: "/api/create-warning/:studentid",
    GET_LEARNING_PATH: "/api/learning-path/:studentid", // Thêm endpoint mới cho lộ trình học tập
  },

  // Course management endpoints
  COURSES: {
    GET_COURSES: "/api/courses",
    GET_COURSE_DETAILS: "/api/courses/:id",
    CREATE_COURSE: "/api/courses",
    UPDATE_COURSE: "/api/courses/:id",
    DELETE_COURSE: "/api/courses/:id",
    ENROLL_COURSE: "/api/courses/:id/enroll",
    GET_CLASS_PROGRESS: "/api/class-progress/:courseid",
    GET_ACTIVITY_RATE: "/api/activity-rate/:courseid",
  },

  // Chapter management endpoints
  CHAPTERS: {
    GET_CHAPTERS: "/api/chapters",
    GET_CHAPTER_DETAILS: "/api/chapter-details/:studentid/:courseid",
  },

  // Warning management endpoints
  WARNINGS: {
    GET_WARNINGS: "/api/warnings",
    UPDATE_WARNING_STATUS: "/api/update-status",
    CREATE_WARNING: "/api/create-warning/:studentid",
  },

  // Chat endpoints for teacher-student communication
  CHAT: {
    SEND_MESSAGE: "/api/chat",
  },

  // Assignment endpoints for homework management
  ASSIGNMENTS: {
    GET_ASSIGNMENTS: "/api/assignments",
    GET_ASSIGNMENT_DETAILS: "/api/assignments/:id",
    SUBMIT_ASSIGNMENT: "/api/assignments/:id/submit",
    GET_ASSIGNMENT_STATUS: "/api/assignment-status/:assignmentid",
  },

  // Error analysis endpoints
  ERRORS: {
    GET_COMMON_ERRORS: "/api/common-errors",
    GET_COURSE_ERRORS: "/api/common-errors/:courseid",
  },

  // Notification endpoints
  NOTIFICATIONS: {
    GET_NOTIFICATIONS: "/api/notifications",
    MARK_AS_READ: "/api/notifications/:id/read",
    MARK_ALL_AS_READ: "/api/notifications/read-all",
    GET_UNREAD_COUNT: "/api/notifications/unread-count",
  }
};