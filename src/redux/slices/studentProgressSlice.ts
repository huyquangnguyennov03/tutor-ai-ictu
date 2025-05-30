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

      // Lấy tiến độ học tập của sinh viên
      const progressUrl = `${API_BASE_URL}${API_ENDPOINTS.STUDENTS.GET_STUDENT_PROGRESS.replace(':studentid', student.studentid.toString())}`;
      const progressResponse = await axios.get(progressUrl);

      if (!progressResponse.data || progressResponse.data.length === 0) {
        return rejectWithValue(`Không tìm thấy tiến độ học tập cho sinh viên ${student.mssv}`);
      }

      // Lấy courseId từ progress
      const courseId = progressResponse.data[0].courseid.toString();

      // Lấy báo cáo chi tiết của sinh viên
      const reportUrl = `${API_BASE_URL}${API_ENDPOINTS.STUDENTS.GET_STUDENT_REPORT.replace(':studentid', student.studentid.toString())}`;
      const reportResponse = await axios.get(reportUrl);

      // Lấy dự đoán và đề xuất can thiệp
      const predictionUrl = `${API_BASE_URL}${API_ENDPOINTS.STUDENTS.PREDICT_INTERVENTION.replace(':studentid', student.studentid.toString())}`;
      const predictionResponse = await axios.get(predictionUrl);

      // Lấy chi tiết các chương học
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

      const chapters: ChapterData[] = chaptersResponse.data.courses.map((chapter: any) => ({
        id: chapter.chapterid,
        title: chapter.name,
        progress: chapter.completion_rate || 0,
        quizScore: `${chapter.average_score || 0}/10`,
        exercisesCompleted: `${Math.floor((chapter.completion_rate || 0) / 10)}/${Math.floor((chapter.completion_rate || 0) / 10) + 2}`
      }));

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

      const suggestions: Suggestion[] = predictionResponse.data && predictionResponse.data.recommendation
        ? [{
          id: 1,
          title: 'Đề xuất học tập',
          content: predictionResponse.data.recommendation,
          type: predictionResponse.data.risk_level === 'An toàn' ? 'success' :
            predictionResponse.data.risk_level === 'Cần cải thiện' ? 'warning' : 'error'
        }]
        : [];

      const summaryStats: SummaryStatsData = {
        totalLearningTime: reportResponse.data.progress[0]?.progressrate ? `${Math.floor(reportResponse.data.progress[0].progressrate)} giờ` : '0 giờ',
        successfulCompilations: reportResponse.data.progress[0]?.completionrate ? Math.floor(reportResponse.data.progress[0].completionrate) : 0,
        failedCompilations: reportResponse.data.warnings.length || 0,
        successRate: `${reportResponse.data.progress[0]?.completionrate || 0}%`,
        dailyAverageTime: '2 giờ', // Có thể tính từ dữ liệu thực tế nếu có
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
      const errorMessage = error.response?.data?.error || error.message || 'Đã xảy ra lỗi khi tải dữ liệu';
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