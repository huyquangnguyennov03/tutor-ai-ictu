// src/redux/slices/assignmentManagementSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from '../store';
import axios from 'axios';
import { API_ENDPOINTS, API_BASE_URL } from '@/common/constants/apis';

// Define types
export interface Material {
  name: string;
  url: string;
}

export interface Assignment {
  id: string;
  title: string;
  description?: string;
  course: string;
  chapter: string;
  deadline: string;
  score?: number;
  materials?: Material[];
  isCompleted: boolean;
}

export interface SubmissionData {
  id: string;
  formData: FormData;
}

interface AssignmentState {
  assignments: Assignment[];
  selectedAssignment: Assignment | null;
  activeTab: 'current' | 'completed';
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Initial state
const initialState: AssignmentState = {
  assignments: [],
  selectedAssignment: null,
  activeTab: 'current',
  status: 'idle',
  error: null
};

// Async thunks
export const fetchAssignments = createAsyncThunk(
  'assignments/fetchAssignments',
  async (_, { rejectWithValue }) => {
    try {
      // Sử dụng API thực tế
      const response = await axios.get(`${API_BASE_URL}${API_ENDPOINTS.ASSIGNMENTS.GET_ASSIGNMENTS}`);
      
      // Chuyển đổi dữ liệu từ API thành định dạng phù hợp với ứng dụng
      const assignments = response.data.map((item: any) => ({
        id: item.assignmentid.toString(),
        title: item.name,
        course: item.courseid.toString(),
        chapter: '',  // Cần bổ sung thông tin này từ API nếu có
        deadline: item.deadline,
        score: 0,
        isCompleted: item.status === 'HOÀN THÀNH'
      }));
      
      return assignments;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Đã xảy ra lỗi khi tải danh sách bài tập');
    }
  }
);

export const fetchAssignmentDetail = createAsyncThunk(
  'assignments/fetchAssignmentDetail',
  async (id: string, { rejectWithValue }) => {
    try {
      // Sử dụng API thực tế
      const url = `${API_BASE_URL}${API_ENDPOINTS.ASSIGNMENTS.GET_ASSIGNMENT_DETAILS.replace(':id', id)}`;
      const response = await axios.get(url);
      const data = response.data;
      
      if (!data) {
        throw new Error('Không tìm thấy bài tập');
      }
      
      // Chuyển đổi dữ liệu từ API thành định dạng phù hợp với ứng dụng
      const assignment: Assignment = {
        id: data.assignmentid.toString(),
        title: data.name,
        description: data.description || '',
        course: data.courseid.toString(),
        chapter: data.chapter || '',
        deadline: data.deadline,
        score: data.score || 0,
        materials: data.materials || [],
        isCompleted: data.status === 'HOÀN THÀNH'
      };
      
      return assignment;
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Đã xảy ra lỗi khi tải chi tiết bài tập');
    }
  }
);

export const submitAssignment = createAsyncThunk(
  'assignments/submitAssignment',
  async ({ id, formData }: SubmissionData, { rejectWithValue }) => {
    try {
      // Sử dụng API thực tế
      const url = `${API_BASE_URL}${API_ENDPOINTS.ASSIGNMENTS.SUBMIT_ASSIGNMENT.replace(':id', id)}`;
      const response = await axios.post(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      // Trả về kết quả từ API
      return {
        id,
        ...response.data
      };
    } catch (error) {
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      return rejectWithValue('Đã xảy ra lỗi khi nộp bài tập');
    }
  }
);

// Create slice
const assignmentManagementSlice = createSlice({
  name: 'assignmentManagement',
  initialState,
  reducers: {
    selectAssignment: (state, action: PayloadAction<string>) => {
      const assignment = state.assignments.find(a => a.id === action.payload);
      state.selectedAssignment = assignment || null;
    },
    setActiveTab: (state, action: PayloadAction<'current' | 'completed'>) => {
      state.activeTab = action.payload;
      state.selectedAssignment = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    markAsCompleted: (state, action: PayloadAction<string>) => {
      const assignmentIndex = state.assignments.findIndex(a => a.id === action.payload);
      if (assignmentIndex !== -1) {
        state.assignments[assignmentIndex].isCompleted = true;
        // Nếu bài tập đang được chọn là bài tập vừa hoàn thành, cập nhật selectedAssignment
        if (state.selectedAssignment?.id === action.payload) {
          state.selectedAssignment = { ...state.assignments[assignmentIndex] };
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch assignments
      .addCase(fetchAssignments.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.assignments = action.payload;
        state.error = null;

        // If there are assignments for the current tab, select the first one
        const filtered = state.activeTab === 'current'
          ? action.payload.filter(a => !a.isCompleted)
          : action.payload.filter(a => a.isCompleted);

        if (filtered.length > 0) {
          state.selectedAssignment = filtered[0];
        } else {
          state.selectedAssignment = null;
        }
      })
      .addCase(fetchAssignments.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // Fetch assignment detail
      .addCase(fetchAssignmentDetail.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAssignmentDetail.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.selectedAssignment = action.payload;
        state.error = null;
      })
      .addCase(fetchAssignmentDetail.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })

      // Submit assignment
      .addCase(submitAssignment.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(submitAssignment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.error = null;
        
        // Cập nhật trạng thái bài tập thành đã hoàn thành
        const assignmentId = action.payload.id;
        const assignmentIndex = state.assignments.findIndex(a => a.id === assignmentId);
        
        if (assignmentIndex !== -1) {
          // Đánh dấu bài tập là đã hoàn thành
          state.assignments[assignmentIndex].isCompleted = true;
          // Gán điểm mặc định (có thể thay đổi sau khi giáo viên chấm)
          state.assignments[assignmentIndex].score = 0;
          
          // Cập nhật selectedAssignment nếu cần
          if (state.selectedAssignment?.id === assignmentId) {
            state.selectedAssignment = { ...state.assignments[assignmentIndex] };
          }
        }
      })
      .addCase(submitAssignment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  }
});

// Export actions
export const { 
  selectAssignment, 
  setActiveTab, 
  clearError, 
  markAsCompleted 
} = assignmentManagementSlice.actions;

// Export selectors
export const selectAllAssignments = (state: RootState) =>
  state.assignmentManagement.assignments.filter(a => !a.isCompleted);

export const selectCompletedAssignments = (state: RootState) =>
  state.assignmentManagement.assignments.filter(a => a.isCompleted);

export const selectSelectedAssignment = (state: RootState) =>
  state.assignmentManagement.selectedAssignment;

export const selectActiveTab = (state: RootState) =>
  state.assignmentManagement.activeTab;

export const selectStatus = (state: RootState) =>
  state.assignmentManagement.status;

export const selectError = (state: RootState) =>
  state.assignmentManagement.error;

export const selectAssignments = (state: RootState) =>
  state.assignmentManagement.assignments;

// Export reducer
export default assignmentManagementSlice.reducer;