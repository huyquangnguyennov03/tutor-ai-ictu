import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_ENDPOINTS, API_BASE_URL } from '@/common/constants/apis';
import { apiService } from '@/services/apiService';

// Types for API responses
export interface Student {
  mssv: string;
  name: string;
  class?: string; // Thêm trường class từ backend
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
  deadline: string;
  totalStudents: number;
  submittedCount: number;
  notSubmittedCount: number;
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
  class?: string; // Thêm trường class từ backend
  score: number;
  progress: number;
  issue: string;
  warningtype?: string; // Thêm trường warningtype từ backend
  severity?: string; // Thêm trường severity từ backend
  priority: 'khẩn cấp' | 'cảnh báo' | 'thông tin';
}

export interface TopStudent {
  mssv: string;
  name: string;
  score: number;
  progress: number;
}

export interface StudentNeedingSupport {
  mssv: string;
  name: string;
  score: number;
  progress: number;
  issue: string;
}

export interface StudentNeedingSupport {
  mssv: string;
  name: string;
  score: number;
  progress: number;
  issue: string;
}

export interface StudentNeedingSupport {
  mssv: string;
  name: string;
  score: number;
  progress: number;
  issue: string;
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
  students_list?: any[]; // Thêm danh sách sinh viên với trường class
}

export interface CourseOption {
  id: string;
  name: string;
  fullName: string;
  difficulty?: string; // Thêm trường difficulty từ backend
  category?: string; // Thêm trường category từ backend
}

export interface SemesterOption {
  id: string;
  name: string;
}

// Interface cho lộ trình học tập
export interface LearningPath {
  currentCourses: any[];
  recommendedCourses: any[];
  allCourses: any[];
}

// Main state interface
// Interface for students needing support
export interface StudentNeedingSupport {
  mssv: string;
  name: string;
  score: number;
  progress: number;
  issue: string;
}

export interface TeacherDashboardState {
  students: Student[];
  chapters: Chapter[];
  commonErrors: CommonError[];
  assignments: Assignment[];
  warnings: StudentWarning[];
  topStudents: TopStudent[];
  studentsNeedingSupport: StudentNeedingSupport[];
  classInfo: ClassInfo | null;
  courseOptions: CourseOption[];
  semesterOptions: SemesterOption[];
  currentCourse: string;
  currentSemester: string;
  selectedTab: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
  activityRate: number | null;
  currentAssignmentSubmission: AssignmentSubmission | null;
  assignmentSubmissionStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
  learningPath: LearningPath | null;
  learningPathStatus: 'idle' | 'loading' | 'succeeded' | 'failed';
}

// Initial state
const initialState: TeacherDashboardState = {
  students: [],
  chapters: [],
  commonErrors: [],
  assignments: [],
  warnings: [],
  topStudents: [],
  studentsNeedingSupport: [],
  classInfo: null,
  courseOptions: [], // Will be populated from API
  semesterOptions: [], // Will be populated from API
  currentCourse: '1', // ID khóa học dạng số
  currentSemester: 'HK1 2024-2025',
  selectedTab: 0,
  status: 'idle',
  error: null,
  activityRate: null,
  currentAssignmentSubmission: null,
  assignmentSubmissionStatus: 'idle',
  learningPath: null,
  learningPathStatus: 'idle'
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
  async ({ assignmentName, courseId }: { assignmentName: string; courseId: string }, { rejectWithValue }) => {
    try {
      // Sử dụng apiService để lấy dữ liệu
      const data = await apiService.fetchAssignmentSubmission(assignmentName, courseId);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Không thể tải dữ liệu bài tập');
    }
  }
);

// Async thunk for sending reminders to students
export const sendReminder = createAsyncThunk(
  'teacherDashboard/sendReminder',
  async (assignmentName: string, { rejectWithValue, getState }) => {
    try {
      // Lấy currentCourse từ state
      const state = getState() as { teacherDashboard: TeacherDashboardState };
      const courseId = state.teacherDashboard.currentCourse;

      // Sử dụng apiService để gửi nhắc nhở
      const result = await apiService.sendReminder(assignmentName, courseId);
      return { success: true, assignmentName };
    } catch (error: any) {
      return rejectWithValue(error.message || 'Không thể gửi nhắc nhở');
    }
  }
);

// Async thunk for reminder to specific student
export const sendReminderToStudent = createAsyncThunk(
  'teacherDashboard/sendReminderToStudent',
  async ({ assignmentName, mssv }: { assignmentName: string; mssv: string }, { rejectWithValue, getState }) => {
    try {
      // Lấy currentCourse từ state
      const state = getState() as { teacherDashboard: TeacherDashboardState };
      const courseId = state.teacherDashboard.currentCourse;

      // Sử dụng apiService để gửi nhắc nhở cho sinh viên cụ thể
      const result = await apiService.sendReminderToStudent(assignmentName, mssv, courseId);
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

export const fetchActivityRate = createAsyncThunk(
  'teacherDashboard/fetchActivityRate',
  async (courseId: string, { rejectWithValue }) => {
    try {
      const url = `${API_BASE_URL}${API_ENDPOINTS.COURSES.GET_ACTIVITY_RATE.replace(':courseid', courseId)}`;
      console.log(`Fetching activity rate for courseId: ${courseId}, URL: ${url}`); // Debug log
      const response = await axios.get(url);
      return response.data.activity_rate;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Không thể tải tỷ lệ hoạt động');
    }
  }
);

// Async thunk để lấy lộ trình học tập của sinh viên
export const fetchLearningPath = createAsyncThunk(
  'teacherDashboard/fetchLearningPath',
  async (studentId: string, { rejectWithValue }) => {
    try {
      const data = await apiService.fetchLearningPath(studentId);
      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Không thể tải lộ trình học tập');
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
      // Xóa dữ liệu bài tập hiện tại khi chuyển lớp để tránh hiển thị dữ liệu cũ
      state.currentAssignmentSubmission = null;
      state.assignmentSubmissionStatus = 'idle';
    },
    setCurrentSemester(state, action: PayloadAction<string>) {
      state.currentSemester = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
    clearCurrentAssignmentSubmission(state) {
      state.currentAssignmentSubmission = null;
      state.assignmentSubmissionStatus = 'loading';
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
        state.studentsNeedingSupport = action.payload.studentsNeedingSupport;
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
      })
      .addCase(fetchActivityRate.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchActivityRate.fulfilled, (state, action: PayloadAction<number>) => {
        state.status = 'succeeded';
        state.activityRate = action.payload;
      })
      .addCase(fetchActivityRate.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed';
        state.error = action.payload || 'Không thể tải tỷ lệ hoạt động';
      });
  },
  selectors: {
    selectStudents: (state) => state.students,
    selectChapters: (state) => state.chapters,
    selectCommonErrors: (state) => state.commonErrors,
    selectAssignments: (state) => state.assignments,
    selectWarnings: (state) => state.warnings,
    selectTopStudents: (state) => state.topStudents,
    selectStudentsNeedingSupport: (state) => state.studentsNeedingSupport,
    selectClassInfo: (state) => state.classInfo,
    selectCourseOptions: (state) => state.courseOptions,
    selectSemesterOptions: (state) => state.semesterOptions,
    selectCurrentCourse: (state) => state.currentCourse,
    selectCurrentSemester: (state) => state.currentSemester,
    selectSelectedTab: (state) => state.selectedTab,
    selectStatus: (state) => state.status,
    selectError: (state) => state.error,
    selectActivityRate: (state) => state.activityRate,
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
  clearCurrentAssignmentSubmission,
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
  selectStudentsNeedingSupport,
  selectClassInfo,
  selectCourseOptions,
  selectSemesterOptions,
  selectCurrentCourse,
  selectCurrentSemester,
  selectSelectedTab,
  selectStatus,
  selectError,
  selectActivityRate,
  selectCurrentAssignmentSubmission,
  selectAssignmentSubmissionStatus
} = teacherDashboardSlice.selectors;

// Export reducer
export default teacherDashboardSlice.reducer;