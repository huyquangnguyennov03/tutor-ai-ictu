// src/redux/slices/learningPathSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import axios from 'axios';
import { API_ENDPOINTS, API_BASE_URL } from '@/common/constants/apis';

// Define Course interface
export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  instructor: string;
  duration: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  totalModules: number;
  completedModules: number;
  isEnrolled: boolean;
  rating: number;
  tags: string[];
  modules?: {
    id: string;
    title: string;
    duration: string;
    isCompleted: boolean;
    content?: string;
  }[];
}

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
      // Sử dụng API thực tế
      const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.COURSES.GET_COURSES}`);
      
      // Chuyển đổi dữ liệu từ API thành định dạng phù hợp với ứng dụng
      const courses: Course[] = response.data.map((course: any) => ({
        id: course.courseid.toString(),
        title: course.name || 'Khóa học không tên',
        description: 'Mô tả khóa học sẽ được cập nhật sau',
        thumbnail: '/images/course-thumbnail.jpg', // Đường dẫn mặc định
        instructor: 'Giảng viên',
        duration: '8 tuần',
        level: 'intermediate',
        totalModules: 10,
        completedModules: Math.floor(course.completionrate / 10) || 0,
        isEnrolled: true,
        rating: 4.5,
        tags: ['programming', 'beginner']
      }));
      
      return courses;
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
      // Sử dụng API thực tế
      const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.COURSES.GET_COURSES}`);
      
      // Lọc các khóa học đang học (giả định: completionrate < 100%)
      const inProgressCourses: Course[] = response.data
        .filter((course: any) => course.completionrate < 100)
        .map((course: any) => ({
          id: course.courseid.toString(),
          title: course.name || 'Khóa học không tên',
          description: 'Mô tả khóa học sẽ được cập nhật sau',
          thumbnail: '/images/course-thumbnail.jpg', // Đường dẫn mặc định
          instructor: 'Giảng viên',
          duration: '8 tuần',
          level: 'intermediate',
          totalModules: 10,
          completedModules: Math.floor(course.completionrate / 10) || 0,
          isEnrolled: true,
          rating: 4.5,
          tags: ['programming', 'beginner']
        }));
      
      return inProgressCourses;
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
      // Sử dụng API thực tế
      const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.COURSES.GET_COURSES}`);
      
      // Lọc các khóa học được đề xuất (giả định: lấy 3 khóa học đầu tiên)
      const recommendedCourses: Course[] = response.data
        .slice(0, 3)
        .map((course: any) => ({
          id: course.courseid.toString(),
          title: course.name || 'Khóa học không tên',
          description: 'Khóa học được đề xuất dựa trên tiến độ học tập của bạn',
          thumbnail: '/images/course-thumbnail.jpg', // Đường dẫn mặc định
          instructor: 'Giảng viên',
          duration: '8 tuần',
          level: 'intermediate',
          totalModules: 10,
          completedModules: 0,
          isEnrolled: false,
          rating: 4.5,
          tags: ['programming', 'recommended']
        }));
      
      return recommendedCourses;
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
      // Sử dụng API thực tế
      const url = `${API_BASE_URL}${API_ENDPOINTS.COURSES.GET_COURSE_DETAILS.replace(':id', courseId)}`;
      const response = await axios.get(url);
      
      // Lấy danh sách chương học của khóa học
      const chaptersUrl = `${API_BASE_URL}${API_ENDPOINTS.CHAPTERS.GET_CHAPTERS}`;
      const chaptersResponse = await axios.get(chaptersUrl);
      
      // Lọc các chương học thuộc khóa học này
      const courseChapters = chaptersResponse.data.filter((chapter: any) => 
        chapter.courseid.toString() === courseId
      );
      
      // Chuyển đổi dữ liệu từ API thành định dạng phù hợp với ứng dụng
      const course: Course = {
        id: response.data.courseid.toString(),
        title: response.data.name || 'Khóa học không tên',
        description: 'Mô tả chi tiết khóa học sẽ được cập nhật sau',
        thumbnail: '/images/course-thumbnail.jpg', // Đường dẫn mặc định
        instructor: 'Giảng viên',
        duration: '8 tuần',
        level: 'intermediate',
        totalModules: courseChapters.length,
        completedModules: Math.floor(response.data.completionrate / 10) || 0,
        isEnrolled: true,
        rating: 4.5,
        tags: ['programming', 'beginner'],
        modules: courseChapters.map((chapter: any, index: number) => ({
          id: chapter.chapterid.toString(),
          title: chapter.name,
          duration: `${chapter.estimatedtime} giờ`,
          isCompleted: (chapter.completionrate || 0) >= 100,
          content: 'Nội dung chi tiết của chương học sẽ được cập nhật sau'
        }))
      };
      
      if (!course) {
        throw new Error('Không tìm thấy khóa học');
      }
      
      return course;
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
      // Trong thực tế, cần có API endpoint riêng cho chức năng này
      // Hiện tại, chỉ cập nhật UI mà không gọi API
      
      // Giả lập kết quả trả về
      return {
        courseId,
        completedModules: 5, // Giả định số module đã hoàn thành
        message: 'Cập nhật tiến độ thành công'
      };
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
      // Sử dụng API thực tế
      const url = `${API_BASE_URL}${API_ENDPOINTS.COURSES.ENROLL_COURSE.replace(':id', courseId)}`;
      const response = await axios.post(url);
      
      // Giả lập kết quả trả về nếu API chưa hoàn thiện
      return {
        courseId,
        message: 'Đăng ký khóa học thành công'
      };
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