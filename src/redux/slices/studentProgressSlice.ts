import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_ENDPOINTS, API_BASE_URL } from '@/common/constants/apis';

// Định nghĩa các interface (giữ nguyên)
export interface ChapterData {
  id: number;
  title: string;
  progress: number;
  quizScore: string;
  exercisesCompleted: string;
}

export interface ErrorData {
  name: string;
  count: number;
  percentage: number;
}

export interface Suggestion {
  id: number;
  title: string;
  content: string;
  type: 'info' | 'warning' | 'success' | 'error';
}

export interface StudentInfo {
  name: string;
  studentId: string;
  courseLevel: string;
  updateDate: string;
  class: string;
}

export interface SummaryStatsData {
  totalLearningTime: string;
  successfulCompilations: number;
  failedCompilations: number;
  successRate: string;
  dailyAverageTime: string;
  mostCommonError?: string;
}

export interface StudentProgressData {
  studentInfo: StudentInfo;
  chapters: ChapterData[];
  summaryStats: SummaryStatsData;
  errors: ErrorData[];
  suggestions: Suggestion[];
}

export interface StudentProgressState {
  data: StudentProgressData | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: StudentProgressState = {
  data: null,
  status: 'idle',
  error: null
};

export const fetchStudentProgress = createAsyncThunk(
  'studentProgress/fetchStudentProgress',
  async (studentId: string, { rejectWithValue }) => {
    try {
      // Lấy thông tin sinh viên
      const studentsResponse = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.STUDENTS.GET_STUDENTS}`);
      const student = studentsResponse.data.find((s: any) => s.studentid.toString() === studentId || s.mssv === studentId);

      if (!student) {
        return rejectWithValue(`Không tìm thấy thông tin sinh viên với MSSV: ${studentId}`);
      }

      // Lấy báo cáo chi tiết của sinh viên (bao gồm suggestions)
      const reportUrl = `${API_BASE_URL}${API_ENDPOINTS.STUDENTS.GET_STUDENT_REPORT.replace(':studentid', student.studentid.toString())}`;
      const reportResponse = await axios.get(reportUrl);

      if (!reportResponse.data) {
        return rejectWithValue(`Không tìm thấy dữ liệu cho sinh viên ${student.mssv}`);
      }

      // Lấy tiến độ học tập của sinh viên
      const progressUrl = `${API_BASE_URL}${API_ENDPOINTS.STUDENTS.GET_STUDENT_PROGRESS.replace(':studentid', student.studentid.toString())}`;
      const progressResponse = await axios.get(progressUrl);

      // Lấy chi tiết các chương học
      const courseId = progressResponse.data[0]?.courseid.toString() || '';
      const chaptersUrl = `${API_BASE_URL}${API_ENDPOINTS.CHAPTERS.GET_CHAPTER_DETAILS
        .replace(':studentid', student.studentid.toString())
        .replace(':courseid', courseId)}`;
      const chaptersResponse = await axios.get(chaptersUrl);

      // Lấy danh sách cảnh báo từ Warning
      const warningsResponse = await axios.get(`${API_BASE_URL}/api/warnings`);
      const studentWarnings = warningsResponse.data.filter((w: any) => w.studentid.toString() === student.studentid.toString());

      // Chuyển đổi dữ liệu từ API
      const studentInfo: StudentInfo = {
        name: student.name,
        studentId: student.mssv,
        courseLevel: 'Trung cấp',
        updateDate: progressResponse.data[0]?.lastupdated || new Date().toISOString().split('T')[0],
        class: student.class || 'Unknown'
      };

      const chapters: ChapterData[] = chaptersResponse.data && chaptersResponse.data.chapters && Array.isArray(chaptersResponse.data.chapters)
        ? chaptersResponse.data.chapters.map((chapter: any) => ({
          id: chapter.chapterid || 0,
          title: chapter.name || 'Chương không xác định',
          progress: chapter.completion_rate || 0,
          quizScore: `${chapter.average_score || 0}/10`,
          exercisesCompleted: `${Math.floor((chapter.completion_rate || 0) / 10)}/${Math.floor((chapter.completion_rate || 0) / 10) + 2}`
        }))
        : [];

      const errors: ErrorData[] = studentWarnings.length > 0
        ? studentWarnings.reduce((acc: ErrorData[], warning: any) => {
          const existingError = acc.find(err => err.name === warning.message);
          if (existingError) {
            existingError.count += 1;
          } else {
            acc.push({
              name: warning.message,
              count: 1,
              percentage: (1 / studentWarnings.length) * 100
            });
          }
          return acc;
        }, [])
        : [];

      const suggestions: Suggestion[] = reportResponse.data.suggestions || [];

      const summaryStats: SummaryStatsData = {
        totalLearningTime: reportResponse.data.progress && reportResponse.data.progress[0]?.progressrate
          ? `${Math.floor(reportResponse.data.progress[0].progressrate)} giờ`
          : '0 giờ',
        successfulCompilations: reportResponse.data.progress && reportResponse.data.progress[0]?.completionrate
          ? Math.floor(reportResponse.data.progress[0].completionrate)
          : 0,
        failedCompilations: reportResponse.data.warnings && Array.isArray(reportResponse.data.warnings)
          ? reportResponse.data.warnings.length
          : 0,
        successRate: reportResponse.data.progress && reportResponse.data.progress[0]?.completionrate
          ? `${reportResponse.data.progress[0].completionrate}%`
          : '0%',
        dailyAverageTime: '2 giờ',
        mostCommonError: errors.length > 0 ? errors[0].name : 'Không có lỗi'
      };

      return {
        studentInfo,
        chapters,
        summaryStats,
        errors,
        suggestions
      };
    } catch (error: any) {
      console.error('Error in fetchStudentProgress:', error);
      let errorMessage = 'Đã xảy ra lỗi khi tải dữ liệu';
      if (error.response) {
        errorMessage = error.response.data?.error || `Lỗi server: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = 'Không thể kết nối đến server';
      } else {
        errorMessage = error.message || 'Lỗi không xác định';
      }
      return rejectWithValue(errorMessage);
    }
  }
);

const studentProgressSlice = createSlice({
  name: 'studentProgress',
  initialState,
  reducers: {
    clearErrorMessage(state) {
      state.error = null;
    },
    resetStudentProgress(state) {
      return { ...initialState };
    },
    updateChapterProgress(state, action: PayloadAction<ChapterData>) {
      if (state.data?.chapters) {
        const index = state.data.chapters.findIndex(chapter => chapter.id === action.payload.id);
        if (index !== -1) {
          state.data.chapters[index] = action.payload;
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentProgress.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchStudentProgress.fulfilled, (state, action: PayloadAction<StudentProgressData>) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchStudentProgress.rejected, (state, action: PayloadAction<any>) => {
        state.status = 'failed';
        state.error = action.payload || 'Không thể tải dữ liệu tiến độ học tập';
      });
  },
  selectors: {
    selectStudentProgressData: (state) => state.data,
    selectStudentInfo: (state) => state.data?.studentInfo,
    selectChapters: (state) => state.data?.chapters,
    selectSummaryStats: (state) => state.data?.summaryStats,
    selectErrors: (state) => state.data?.errors,
    selectSuggestions: (state) => state.data?.suggestions,
    selectStatus: (state) => state.status,
    selectErrorMessage: (state) => state.error
  }
});

export const {
  clearErrorMessage,
  resetStudentProgress,
  updateChapterProgress
} = studentProgressSlice.actions;

export const {
  selectStudentProgressData,
  selectStudentInfo,
  selectChapters,
  selectSummaryStats,
  selectErrors,
  selectSuggestions,
  selectStatus,
  selectErrorMessage
} = studentProgressSlice.selectors;

export default studentProgressSlice.reducer;