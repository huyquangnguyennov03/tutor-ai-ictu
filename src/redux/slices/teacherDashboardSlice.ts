import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_ENDPOINTS, API_BASE_URL } from '@/common/constants/apis';
import { apiService } from '@/services/apiService';

// Types for API responses
export interface Student {
  mssv: string;
  name: string;
  progress: number;
  score: number;
  status: 'đạt chỉ tiêu' | 'nguy hiểm' | 'cần cải thiện' | 'khá';
  progressColor: string;
  active?: boolean;
}

// Thêm interface cho sinh viên nộp/chưa nộp bài tập
export interface StudentSubmission {
  mssv: string;
  name: string;
  progress: number;
  score: string;
  status: 'ĐẠT CHỈ TIÊU' | 'KHÁ' | 'CẦN CẢI THIỆN' | 'NGUY HIỂM';
}

export interface AssignmentSubmission {
  name: string;
  studentsSubmitted: StudentSubmission[];
  studentsNotSubmitted: StudentSubmission[];
}

export interface Chapter {
  id: number;
  name: string;
  totalStudents: number;
  completionRate: number;
  averageScore: number;
  studentsCompleted: string;
  estimatedTime: number;
}

export interface CommonError {
  type: string;
  occurrences: number;
  studentsAffected: number;
  relatedChapters: string;
}

export interface Assignment {
  name: string;
  deadline: string;
  submitted: string;
  completionRate: number;
  status: 'sắp hết hạn' | 'sắp tới' | 'đã qua hạn';
}

export interface StudentWarning {
  mssv: string;
  name: string;
  score: number;
  progress: number;
  issue: string;
  priority: 'khẩn cấp' | 'cảnh báo' | 'thông tin';
}

export interface TopStudent {
  mssv: string;
  name: string;
  score: number;
  progress: number;
}

export interface ClassInfo {
  id: string;
  name: string;
  semester: string;
  totalStudents: number;
  activityRate: number;
  averageScore: number;
  overallProgress: number;
  instructor: {
    name: string;
    title: string;
  };
  assistant?: {
    name: string;
    title: string;
  };
}

export interface CourseOption {
  id: string;
  name: string;
  fullName: string;
}

export interface SemesterOption {
  id: string;
  name: string;
}

// Main state interface
export interface TeacherDashboardState {
  students: Student[];
  chapters: Chapter[];
  commonErrors: CommonError[];
  assignments: Assignment[];
  warnings: StudentWarning[];
  topStudents: TopStudent[];
  classInfo: ClassInfo | null;
  courseOptions: CourseOption[];
  semesterOptions: SemesterOption[];
  currentCourse: string;
  currentSemester: string;
  selectedTab: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  // Thêm state mới cho danh sách nộp bài tập
  currentAssignmentSubmission: AssignmentSubmission | null;
  assignmentSubmissionStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

// Initial state
const initialState: TeacherDashboardState = {
  students: [],
  chapters: [],
  commonErrors: [],
  assignments: [],
  warnings: [],
  topStudents: [],
  classInfo: null,
  courseOptions: [], // Will be populated from API
  semesterOptions: [], // Will be populated from API
  currentCourse: '1', // ID khóa học dạng số
  currentSemester: 'HK1 2024-2025',
  selectedTab: 0,
  status: 'idle',
  error: null,
  // Khởi tạo state mới
  currentAssignmentSubmission: null,
  assignmentSubmissionStatus: 'idle'
};

// Async thunk for fetching dashboard data
export const fetchDashboardData = createAsyncThunk(
  'teacherDashboard/fetchDashboardData',
  async ({ courseId, semesterId }: { courseId: string; semesterId: string }, { rejectWithValue }) => {
    try {
      // Sử dụng apiService để lấy dữ liệu
      const data = await apiService.fetchDashboardData(courseId, semesterId);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Không thể tải dữ liệu');
    }
  }
);

// Async thunk cho việc lấy danh sách sinh viên đã nộp/chưa nộp bài tập
export const fetchAssignmentSubmission = createAsyncThunk(
  'teacherDashboard/fetchAssignmentSubmission',
  async (assignmentName: string, { rejectWithValue }) => {
    try {
      // Sử dụng apiService để lấy dữ liệu
      const data = await apiService.fetchAssignmentSubmission(assignmentName);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Không thể tải dữ liệu bài tập');
    }
  }
);

// Async thunk for sending reminders to students
export const sendReminder = createAsyncThunk(
  'teacherDashboard/sendReminder',
  async (assignmentName: string, { rejectWithValue }) => {
    try {
      // Sử dụng apiService để gửi nhắc nhở
      const result = await apiService.sendReminder(assignmentName);
      return { success: true, assignmentName };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Không thể gửi nhắc nhở');
    }
  }
);

// Async thunk for reminder to specific student
export const sendReminderToStudent = createAsyncThunk(
  'teacherDashboard/sendReminderToStudent',
  async ({ assignmentName, mssv }: { assignmentName: string; mssv: string }, { rejectWithValue }) => {
    try {
      // Sử dụng apiService để gửi nhắc nhở cho sinh viên cụ thể
      const result = await apiService.sendReminderToStudent(assignmentName, mssv);
      return { success: true, assignmentName, mssv };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Không thể gửi nhắc nhở cho sinh viên');
    }
  }
);

// Async thunk for extending deadlines
export const extendDeadline = createAsyncThunk(
  'teacherDashboard/extendDeadline',
  async (assignmentName: string, { rejectWithValue }) => {
    try {
      // Sử dụng apiService để gia hạn deadline
      const result = await apiService.extendDeadline(assignmentName);
      return { success: true, assignmentName };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Không thể gia hạn deadline');
    }
  }
);

// Create slice
const teacherDashboardSlice = createSlice({
  name: 'teacherDashboard',
  initialState,
  reducers: {
    setSelectedTab(state, action: PayloadAction<number>) {
      state.selectedTab = action.payload;
    },
    setCurrentCourse(state, action: PayloadAction<string>) {
      state.currentCourse = action.payload;
    },
    setCurrentSemester(state, action: PayloadAction<string>) {
      state.currentSemester = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
    sortStudents(state, action: PayloadAction<'alphabetical' | 'score' | 'progress'>) {
      const sortType = action.payload;
      if (sortType === 'alphabetical') {
        state.students.sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortType === 'score') {
        state.students.sort((a, b) => b.score - a.score);
      } else if (sortType === 'progress') {
        state.students.sort((a, b) => b.progress - a.progress);
      }
    },
    filterStudents(state, action: PayloadAction<'all' | 'active' | 'inactive'>) {
      if (action.payload === 'active') {
        state.students = state.students.filter(student => student.progress > 50);
      } else if (action.payload === 'inactive') {
        state.students = state.students.filter(student => student.progress <= 50);
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDashboardData.fulfilled, (state, action: PayloadAction<any>) => {
        state.status = 'succeeded';
        state.students = action.payload.students;
        state.chapters = action.payload.chapters;
        state.commonErrors = action.payload.commonErrors;
        state.assignments = action.payload.assignments;
        state.warnings = action.payload.warnings;
        state.topStudents = action.payload.topStudents;
        state.classInfo = action.payload.classInfo;
        
        // Update course and semester options if provided
        if (action.payload.courseOptions) {
          state.courseOptions = action.payload.courseOptions;
        }
        if (action.payload.semesterOptions) {
          state.semesterOptions = action.payload.semesterOptions;
        }
      })
      .addCase(fetchDashboardData.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed';
        state.error = action.payload || 'Không thể tải dữ liệu';
      })
      // Thêm xử lý cho fetchAssignmentSubmission
      .addCase(fetchAssignmentSubmission.pending, (state) => {
        state.assignmentSubmissionStatus = 'loading';
      })
      .addCase(fetchAssignmentSubmission.fulfilled, (state, action: PayloadAction<AssignmentSubmission>) => {
        state.assignmentSubmissionStatus = 'succeeded';
        state.currentAssignmentSubmission = action.payload;
      })
      .addCase(fetchAssignmentSubmission.rejected, (state, action: PayloadAction<any>) => {
        state.assignmentSubmissionStatus = 'failed';
        state.error = action.payload || 'Không thể tải dữ liệu bài tập';
      })
      .addCase(sendReminder.fulfilled, (state, action) => {
        // Có thể cập nhật trạng thái gửi nhắc nhở nếu cần
      })
      .addCase(sendReminderToStudent.fulfilled, (state, action) => {
        // Có thể cập nhật trạng thái gửi nhắc nhở cho sinh viên nếu cần
      })
      .addCase(extendDeadline.fulfilled, (state, action: PayloadAction<{ assignmentName: string }>) => {
        const assignmentIndex = state.assignments.findIndex(
          a => a.name === action.payload.assignmentName
        );
        if (assignmentIndex !== -1) {
          const dateObj = new Date(state.assignments[assignmentIndex].deadline.split('/').reverse().join('-'));
          dateObj.setDate(dateObj.getDate() + 7);
          const newDeadline = `${dateObj.getDate().toString().padStart(2, '0')}/${
            (dateObj.getMonth() + 1).toString().padStart(2, '0')}/${
            dateObj.getFullYear()}`;
          state.assignments[assignmentIndex].deadline = newDeadline;
          state.assignments[assignmentIndex].status = 'sắp tới';
        }
      });
  },
  selectors: {
    selectStudents: (state) => state.students,
    selectChapters: (state) => state.chapters,
    selectCommonErrors: (state) => state.commonErrors,
    selectAssignments: (state) => state.assignments,
    selectWarnings: (state) => state.warnings,
    selectTopStudents: (state) => state.topStudents,
    selectClassInfo: (state) => state.classInfo,
    selectCourseOptions: (state) => state.courseOptions,
    selectSemesterOptions: (state) => state.semesterOptions,
    selectCurrentCourse: (state) => state.currentCourse,
    selectCurrentSemester: (state) => state.currentSemester,
    selectSelectedTab: (state) => state.selectedTab,
    selectStatus: (state) => state.status,
    selectError: (state) => state.error,
    // Thêm selectors mới
    selectCurrentAssignmentSubmission: (state) => state.currentAssignmentSubmission,
    selectAssignmentSubmissionStatus: (state) => state.assignmentSubmissionStatus
  }
});

// Export actions
export const {
  setSelectedTab,
  setCurrentCourse,
  setCurrentSemester,
  clearError,
  sortStudents,
  filterStudents
} = teacherDashboardSlice.actions;

// Export selectors
export const {
  selectStudents,
  selectChapters,
  selectCommonErrors,
  selectAssignments,
  selectWarnings,
  selectTopStudents,
  selectClassInfo,
  selectCourseOptions,
  selectSemesterOptions,
  selectCurrentCourse,
  selectCurrentSemester,
  selectSelectedTab,
  selectStatus,
  selectError,
  // Export selectors mới
  selectCurrentAssignmentSubmission,
  selectAssignmentSubmissionStatus
} = teacherDashboardSlice.selectors;

// Export reducer
export default teacherDashboardSlice.reducer;