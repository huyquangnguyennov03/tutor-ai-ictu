// src/redux/slices/learningPathSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import axios from 'axios';
import { API_ENDPOINTS, API_BASE_URL } from '@/common/constants/apis';
import { apiService } from '@/services/apiService';

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

// Hàm hỗ trợ để xác định icon dựa trên tên khóa học
function getCourseIcon(courseName: string): 'book' | 'layers' | 'code' | 'school' {
  const lowerCaseName = (courseName || '').toLowerCase();
  if (lowerCaseName.includes('c programming')) {
    return 'code';
  } else if (lowerCaseName.includes('java')) {
    return 'layers';
  } else if (lowerCaseName.includes('python')) {
    return 'school';
  } else if (lowerCaseName.includes('web')) {
    return 'layers';
  } else {
    return 'book';
  }
}

// Hàm chuyển đổi dữ liệu khóa học từ API sang định dạng ứng dụng
function mapCourseData(course: any): Course {
  return {
    id: course.courseid?.toString() || course.id?.toString() || '0',
    title: course.coursename || course.title || 'Khóa học không tên',
    description: course.description || `Khóa học ${course.coursename || course.title} ${course.semester ? `- ${course.semester}` : ''} ${course.credits ? `(${course.credits} tín chỉ)` : ''}`,
    thumbnail: course.thumbnail || '/images/course-thumbnail.jpg',
    instructor: course.instructor || 'Giảng viên',
    duration: course.duration?.toString() || '8',
    level: course.difficulty || course.level || 'intermediate',
    totalModules: course.totalModules || 10,
    completedModules: course.completedModules || 0,
    isEnrolled: course.isEnrolled || course.status === 'ACTIVE',
    rating: course.rating || 4.5,
    tags: course.tags || [course.category || 'programming'],
    icon: getCourseIcon(course.coursename || course.title)
  };
}

// Async thunk để lấy lộ trình học tập (tất cả trong một API call)
export const fetchLearningPathAsync = createAsyncThunk(
  'learningPath/fetchLearningPath',
  async (studentId: string = '1', { rejectWithValue }) => {
    try {
      // Sử dụng apiService để lấy lộ trình học tập
      const learningPathData = await apiService.fetchLearningPath(studentId);
      
      // Chuyển đổi dữ liệu từ API thành định dạng phù hợp với ứng dụng
      const allCourses = (learningPathData.allCourses || []).map(mapCourseData);
      const currentCourses = (learningPathData.currentCourses || []).map(mapCourseData);
      const recommendedCourses = (learningPathData.recommendedCourses || []).map(mapCourseData);
      
      return {
        allCourses,
        currentCourses,
        recommendedCourses
      };
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Đã xảy ra lỗi khi tải lộ trình học tập');
    }
  }
);

// Giữ lại các thunk cũ để tương thích ngược, nhưng sử dụng API mới
export const fetchAllCoursesAsync = createAsyncThunk(
  'learningPath/fetchAllCourses',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      // Sử dụng API mới
      const result = await dispatch(fetchLearningPathAsync('1')).unwrap();
      return result.allCourses;
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
  async (_, { dispatch, rejectWithValue }) => {
    try {
      // Sử dụng API mới
      const result = await dispatch(fetchLearningPathAsync('1')).unwrap();
      return result.currentCourses;
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
  async (_, { dispatch, rejectWithValue }) => {
    try {
      // Sử dụng API mới
      const result = await dispatch(fetchLearningPathAsync('1')).unwrap();
      return result.recommendedCourses;
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
        chapter.courseid?.toString() === courseId
      );
      
      // Nếu không có dữ liệu chi tiết khóa học, lấy từ danh sách khóa học
      const coursesUrl = `${API_BASE_URL}${API_ENDPOINTS.COURSES.GET_COURSES}`;
      const coursesResponse = await axios.get(coursesUrl);
      const courseData = coursesResponse.data.find((c: any) => c.courseid.toString() === courseId);
      
      if (!courseData) {
        throw new Error('Không tìm thấy khóa học');
      }
      
      // Tạo danh sách modules mặc định nếu không có dữ liệu chương học
      const defaultModules = Array.from({ length: 10 }, (_, i) => ({
        id: `${courseId}-${i+1}`,
        title: `Bài ${i+1}: Nội dung sẽ được cập nhật`,
        description: 'Nội dung chi tiết sẽ được cập nhật',
        duration: 60,
        isCompleted: i < 3, // Giả định 3 bài đầu đã hoàn thành
        type: 'video' as 'video' | 'quiz' | 'reading' | 'assignment',
        contentUrl: `/courses/${courseId}/modules/${i+1}`
      }));
      
      // Chuyển đổi dữ liệu từ API thành định dạng phù hợp với ứng dụng
      const course: Course = {
        id: courseData.courseid.toString(),
        title: courseData.coursename || 'Khóa học không tên',
        description: `Khóa học ${courseData.coursename} - ${courseData.semester} (${courseData.credits} tín chỉ)`,
        thumbnail: '/images/course-thumbnail.jpg', // Đường dẫn mặc định
        instructor: 'Giảng viên',
        duration: '8',
        level: 'Intermediate',
        totalModules: courseChapters.length || 10,
        completedModules: 3, // Giả định tiến độ
        isEnrolled: courseData.status === 'ACTIVE',
        rating: 4.5,
        tags: ['programming', 'beginner'],
        icon: getCourseIcon(courseData.coursename),
        modules: courseChapters.length > 0 
          ? courseChapters.map((chapter: any, index: number) => ({
              id: chapter.chapterid.toString(),
              title: chapter.name || `Bài ${index+1}`,
              description: chapter.description || 'Nội dung chi tiết sẽ được cập nhật',
              duration: chapter.estimatedtime || 60,
              isCompleted: index < 3, // Giả định 3 bài đầu đã hoàn thành
              type: 'video' as 'video' | 'quiz' | 'reading' | 'assignment',
              contentUrl: `/courses/${courseId}/modules/${index+1}`
            }))
          : defaultModules
      };
      
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
      // Fetch learning path (new API)
      .addCase(fetchLearningPathAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchLearningPathAsync.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.courses = action.payload.allCourses;
        state.inProgressCourses = action.payload.currentCourses;
        state.recommendedCourses = action.payload.recommendedCourses;
        state.error = null;
      })
      .addCase(fetchLearningPathAsync.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      
      // Fetch all courses (compatibility)
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
      
      // Fetch in progress courses (compatibility)
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
      
      // Fetch recommended courses (compatibility)
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