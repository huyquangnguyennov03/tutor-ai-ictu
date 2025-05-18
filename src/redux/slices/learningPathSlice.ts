// src/redux/slices/learningPathSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import { API_ENDPOINTS } from '@/common/constants/apis';
import { 
  Course, 
  fetchAllCourses, 
  fetchInProgressCourses, 
  fetchRecommendedCourses, 
  fetchCourseDetails,
  updateCourseProgress,
  enrollCourse
} from '@/mockData/mockLearningPath';

// Define state interface
interface LearningPathState {
  courses: Course[];
  inProgressCourses: Course[];
  recommendedCourses: Course[];
  selectedCourse: Course | null;
  activeTab: number;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Initial state
const initialState: LearningPathState = {
  courses: [],
  inProgressCourses: [],
  recommendedCourses: [],
  selectedCourse: null,
  activeTab: 0,
  status: 'idle',
  error: null
};

// Async thunks
export const fetchAllCoursesAsync = createAsyncThunk(
  'learningPath/fetchAllCourses',
  async (_, { rejectWithValue }) => {
    try {
      // Trong môi trường phát triển, sử dụng mock data
      const data = await fetchAllCourses();
      
      // Trong môi trường production, sử dụng API thực tế:
      // const response = await axios.get(API_ENDPOINTS.LEARNING_PATH.GET_ALL_COURSES);
      // const data = response.data;
      
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Đã xảy ra lỗi khi tải danh sách khóa học');
    }
  }
);

export const fetchInProgressCoursesAsync = createAsyncThunk(
  'learningPath/fetchInProgressCourses',
  async (_, { rejectWithValue }) => {
    try {
      // Trong môi trường phát triển, sử dụng mock data
      const data = await fetchInProgressCourses();
      
      // Trong môi trường production, sử dụng API thực tế:
      // const response = await axios.get(API_ENDPOINTS.LEARNING_PATH.GET_IN_PROGRESS_COURSES);
      // const data = response.data;
      
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Đã xảy ra lỗi khi tải danh sách khóa học đang học');
    }
  }
);

export const fetchRecommendedCoursesAsync = createAsyncThunk(
  'learningPath/fetchRecommendedCourses',
  async (_, { rejectWithValue }) => {
    try {
      // Trong môi trường phát triển, sử dụng mock data
      const data = await fetchRecommendedCourses();
      
      // Trong môi trường production, sử dụng API thực tế:
      // const response = await axios.get(API_ENDPOINTS.LEARNING_PATH.GET_RECOMMENDED_COURSES);
      // const data = response.data;
      
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Đã xảy ra lỗi khi tải danh sách khóa học đề xuất');
    }
  }
);

export const fetchCourseDetailsAsync = createAsyncThunk(
  'learningPath/fetchCourseDetails',
  async (courseId: string, { rejectWithValue }) => {
    try {
      // Trong môi trường phát triển, sử dụng mock data
      const data = await fetchCourseDetails(courseId);
      
      // Trong môi trường production, sử dụng API thực tế:
      // const url = API_ENDPOINTS.LEARNING_PATH.GET_COURSE_DETAILS.replace(':id', courseId);
      // const response = await axios.get(url);
      // const data = response.data;
      
      if (!data) {
        throw new Error('Không tìm thấy khóa học');
      }
      
      return data;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Đã xảy ra lỗi khi tải chi tiết khóa học');
    }
  }
);

export const updateCourseProgressAsync = createAsyncThunk(
  'learningPath/updateCourseProgress',
  async ({ courseId, moduleId }: { courseId: string; moduleId: string }, { rejectWithValue }) => {
    try {
      // Trong môi trường phát triển, sử dụng mock data
      const result = await updateCourseProgress(courseId, moduleId);
      
      // Trong môi trường production, sử dụng API thực tế:
      // const url = API_ENDPOINTS.LEARNING_PATH.UPDATE_COURSE_PROGRESS.replace(':id', courseId);
      // const response = await axios.post(url, { moduleId });
      // const result = response.data;
      
      return result;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Đã xảy ra lỗi khi cập nhật tiến độ khóa học');
    }
  }
);

export const enrollCourseAsync = createAsyncThunk(
  'learningPath/enrollCourse',
  async (courseId: string, { rejectWithValue }) => {
    try {
      // Trong môi trường phát triển, sử dụng mock data
      const result = await enrollCourse(courseId);
      
      // Trong môi trường production, sử dụng API thực tế:
      // const url = API_ENDPOINTS.LEARNING_PATH.ENROLL_COURSE.replace(':id', courseId);
      // const response = await axios.post(url);
      // const result = response.data;
      
      return result;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Đã xảy ra lỗi khi đăng ký khóa học');
    }
  }
);

// Create slice
const learningPathSlice = createSlice({
  name: 'learningPath',
  initialState,
  reducers: {
    setActiveTab: (state, action: PayloadAction<number>) => {
      state.activeTab = action.payload;
    },
    selectCourse: (state, action: PayloadAction<string>) => {
      const course = state.courses.find(c => c.id === action.payload);
      state.selectedCourse = course || null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all courses
      .addCase(fetchAllCoursesAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllCoursesAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.courses = action.payload;
        state.error = null;
      })
      .addCase(fetchAllCoursesAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Fetch in progress courses
      .addCase(fetchInProgressCoursesAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchInProgressCoursesAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.inProgressCourses = action.payload;
        state.error = null;
      })
      .addCase(fetchInProgressCoursesAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Fetch recommended courses
      .addCase(fetchRecommendedCoursesAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRecommendedCoursesAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.recommendedCourses = action.payload;
        state.error = null;
      })
      .addCase(fetchRecommendedCoursesAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Fetch course details
      .addCase(fetchCourseDetailsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCourseDetailsAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedCourse = action.payload;
        state.error = null;
      })
      .addCase(fetchCourseDetailsAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Update course progress
      .addCase(updateCourseProgressAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateCourseProgressAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        
        // Cập nhật tiến độ khóa học trong danh sách
        const { courseId, completedModules } = action.payload;
        
        // Cập nhật trong danh sách tất cả khóa học
        const courseIndex = state.courses.findIndex(c => c.id === courseId);
        if (courseIndex !== -1) {
          state.courses[courseIndex].completedModules = completedModules;
        }
        
        // Cập nhật trong danh sách khóa học đang học
        const inProgressIndex = state.inProgressCourses.findIndex(c => c.id === courseId);
        if (inProgressIndex !== -1) {
          state.inProgressCourses[inProgressIndex].completedModules = completedModules;
        }
        
        // Cập nhật trong danh sách khóa học đề xuất
        const recommendedIndex = state.recommendedCourses.findIndex(c => c.id === courseId);
        if (recommendedIndex !== -1) {
          state.recommendedCourses[recommendedIndex].completedModules = completedModules;
        }
        
        // Cập nhật khóa học đang được chọn nếu cần
        if (state.selectedCourse?.id === courseId) {
          state.selectedCourse.completedModules = completedModules;
        }
      })
      .addCase(updateCourseProgressAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Enroll course
      .addCase(enrollCourseAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(enrollCourseAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        
        // Cập nhật trạng thái đăng ký khóa học
        const { courseId } = action.payload;
        
        // Cập nhật trong danh sách tất cả khóa học
        const courseIndex = state.courses.findIndex(c => c.id === courseId);
        if (courseIndex !== -1) {
          state.courses[courseIndex].isEnrolled = true;
        }
        
        // Cập nhật trong danh sách khóa học đề xuất
        const recommendedIndex = state.recommendedCourses.findIndex(c => c.id === courseId);
        if (recommendedIndex !== -1) {
          state.recommendedCourses[recommendedIndex].isEnrolled = true;
        }
        
        // Cập nhật khóa học đang được chọn nếu cần
        if (state.selectedCourse?.id === courseId) {
          state.selectedCourse.isEnrolled = true;
        }
      })
      .addCase(enrollCourseAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  }
});

// Export actions
export const { setActiveTab, selectCourse, clearError } = learningPathSlice.actions;

// Export selectors
export const selectAllCourses = (state: RootState) => state.learningPath.courses;
export const selectInProgressCourses = (state: RootState) => state.learningPath.inProgressCourses;
export const selectRecommendedCourses = (state: RootState) => state.learningPath.recommendedCourses;
export const selectSelectedCourse = (state: RootState) => state.learningPath.selectedCourse;
export const selectActiveTab = (state: RootState) => state.learningPath.activeTab;
export const selectStatus = (state: RootState) => state.learningPath.status;
export const selectError = (state: RootState) => state.learningPath.error;

// Export reducer
export default learningPathSlice.reducer;