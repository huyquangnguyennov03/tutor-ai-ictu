import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axiosInstance from '@/utils/axiosInstance';
import { API_ENDPOINTS } from '@/common/constants/apis';
import { API_STATUS } from "@/common/constants/status"

interface MetaInterface {
  itemsPerPage: number;
  totalItems: number;
  currentPage: number;
  totalPages: number;
  sortBy: string[][];
}

interface Links {
  previous?: string;
  current: string;
  next?: string;
  last?: string;
}

export interface UserShortInfoInterface {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  name: string;
}

interface UsersState {
  data: UserShortInfoInterface[];
  meta: MetaInterface | null;
  links: Links | null;
  status: API_STATUS;
  error: string | null;
}

const initialState: UsersState = {
  data: [],
  meta: null,
  links: null,
  status: API_STATUS.IDLE,
  error: null
};

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(API_ENDPOINTS.USER.FETCH_USERS);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data.message || error.message);
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUsers(state) {
      return {
        ...initialState
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = API_STATUS.LOADING;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<UserShortInfoInterface[]>) => {
        state.status = API_STATUS.SUCCEEDED;
        state.data = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action: PayloadAction<any>) => {
        state.status = API_STATUS.FAILED;
        state.error = action.payload || 'Failed to fetch users';
      });
  },
  selectors: {
    selectUsers: state => state.data,
  },
});

export const { resetUsers } = userSlice.actions;
export const { selectUsers} = userSlice.selectors

export default userSlice.reducer;