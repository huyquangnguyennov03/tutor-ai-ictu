import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

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
  courseOptions: [
    { id: 'C01', name: 'C Programming - C01', fullName: 'C Programming' },
    { id: 'C02', name: 'C Programming - C02', fullName: 'C Programming' },
    { id: 'J01', name: 'Java Programming - J01', fullName: 'Java Programming' },
    { id: 'P01', name: 'Python - P01', fullName: 'Python' },
    { id: 'W01', name: 'Web Development - W01', fullName: 'Web Development' }
  ],
  semesterOptions: [
    { id: 'SUM2024', name: 'Hè 2024' },
    { id: 'SEM12024', name: 'HK1 2024-2025' },
    { id: 'SEM22023', name: 'HK2 2023-2024' },
    { id: 'SEM12023', name: 'HK1 2023-2024' }
  ],
  currentCourse: 'C01',
  currentSemester: 'SUM2024',
  selectedTab: 0,
  status: 'idle',
  error: null
};

// Async thunk for fetching dashboard data
export const fetchDashboardData = createAsyncThunk(
  'teacherDashboard/fetchDashboardData',
  async ({ courseId, semesterId }: { courseId: string; semesterId: string }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`https://run.mocky.io/v3/fa7702b6-e541-4328-9ddf-61b192f19680`, {
        params: { courseId, semesterId }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể tải dữ liệu');
    }
  }
);

// Async thunk for sending reminders to students
export const sendReminder = createAsyncThunk(
  'teacherDashboard/sendReminder',
  async (assignmentName: string, { rejectWithValue }) => {
    try {
      // In a real app, this would send data to the API
      const response = await axios.post(`https://run.mocky.io/v3/ab3ef706-a743-4f6d-aa9c-4663e0ee364f`, {
        assignmentName
      });
      return { success: true, assignmentName };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể gửi nhắc nhở');
    }
  }
);

// Async thunk for extending deadlines
export const extendDeadline = createAsyncThunk(
  'teacherDashboard/extendDeadline',
  async (assignmentName: string, { rejectWithValue }) => {
    try {
      // In a real app, this would send data to the API
      const response = await axios.post(`https://run.mocky.io/v3/8f5c9f95-97f4-4a69-84b3-484669a15a09`, {
        assignmentName,
        action: 'extend'
      });
      return { success: true, assignmentName };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Không thể gia hạn deadline');
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
      })
      .addCase(fetchDashboardData.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed';
        state.error = action.payload || 'Không thể tải dữ liệu';
      })
      .addCase(sendReminder.fulfilled, (state, action) => {
        // Có thể cập nhật trạng thái gửi nhắc nhở nếu cần
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
    selectError: (state) => state.error
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
  selectError
} = teacherDashboardSlice.selectors;

// Export reducer
export default teacherDashboardSlice.reducer;