import type { PayloadAction } from "@reduxjs/toolkit"
import { createSlice, createAsyncThunk, createAction } from "@reduxjs/toolkit"
import axiosInstance from "@/utils/axiosInstance"
import { API_ENDPOINTS } from "@/common/constants/apis"
import type { VpsConfiguration } from "@/common/interfaces/vps.interface"

interface VpsState {
  computers: VpsConfiguration[]
  currentComputer: VpsConfiguration | null
  loading: boolean
  error: string | null
  message: string | null 
  success: boolean | null 
}

const initialState: VpsState = {
  computers: [],
  currentComputer: null,
  loading: false,
  error: null,
  message: null, 
  success: false 
}

export const fetchProviderVps = createAsyncThunk(
  "vps/fetchProviderVps",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.VPS.FETCH_PROVIDER_VPS,
      )
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch Provider VPS",
      )
    }
  },
)

export const fetchProviderVpsDetail = createAsyncThunk(
  "vps/fetchProviderVpsDetail",
  async (computerId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `${API_ENDPOINTS.VPS.FETCH_PROVIDER_VPS}/${computerId}`,
      )
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch Provider VPS",
      )
    }
  },
)

export const addProviderVps = createAsyncThunk(
  "vps/addProviderVps",
  async (vpsData: Partial<VpsConfiguration>, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.VPS.ADD_PROVIDER_VPS,
        vpsData,
      )
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add Provider VPS",
      )
    }
  },
)

export const updateProviderVps = createAsyncThunk(
  "vps/updateProviderVps",
  async (
    { vpsId, vpsData }: { vpsId: string; vpsData: Partial<VpsConfiguration> },
    { rejectWithValue },
  ) => {
    try {
      const response = await axiosInstance.patch(
        `${API_ENDPOINTS.VPS.EDIT_PROVIDER_VPS}/${vpsId}`,
        vpsData,
      )
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add Provider VPS",
      )
    }
  },
)

export const deleteProviderVps = createAsyncThunk(
  "vps/deleteProviderVps",
  async (vpsId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `${API_ENDPOINTS.VPS.DELETE_PROVIDER_VPS}/${vpsId}`,
      )
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete Provider VPS",
      )
    }
  },
)

export const fetchAdminVps = createAsyncThunk(
  "vps/fetchAdminVps",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        API_ENDPOINTS.VPS.FETCH_ADMIN_VPS,
      )
      return response.data
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch Admin VPS",
      )
    }
  },
)

export const addAdminVps = createAsyncThunk(
  "vps/addAdminVps",
  async (vpsData: Partial<VpsConfiguration>, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        API_ENDPOINTS.VPS.ADD_ADMIN_VPS,
        vpsData,
      )
      return {
        data: response.data,
        message: "Thêm VPS thành công!"
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add VPS",
      )
    }
  },
)
export const updateAdminVps = createAsyncThunk(
  "vps/updateAdminVps",
  async (
    { vpsId, vpsData }: { vpsId: string; vpsData: Partial<VpsConfiguration> },
    { rejectWithValue },
  ) => {
    try {
      const response = await axiosInstance.patch(
        `${API_ENDPOINTS.VPS.EDIT_ADMIN_VPS}/${vpsId}`,
        vpsData,
      )
      return {
        data: response.data,
        message: "Cập nhật VPS thành công!" 
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update VPS",
      )
    }
  },
)
export const deleteAdminVps = createAsyncThunk(
  "vps/deleteAdminVps",
  async (vpsId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.delete(
        `${API_ENDPOINTS.VPS.DELETE_ADMIN_VPS}/${vpsId}`,
      )
      return  { message: response.data.message || "Đã xóa VPS thành công!" }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete VPS",
      )
    }
  },
)

const vpsSlice = createSlice({
  name: "vps",
  initialState,
  reducers: {
    setCurrentComputer: (
      state,
      action: PayloadAction<VpsConfiguration | null>,
    ) => {
      state.currentComputer = action.payload
    },
    clearError: state => {
      state.error = null
    },
    clearMessage: state => { 
      state.message = null
      state.success = false
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchProviderVps.pending, state => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchProviderVps.fulfilled, (state, action) => {
      state.loading = false
      state.computers = action.payload
    })
    builder.addCase(fetchProviderVps.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    builder.addCase(addProviderVps.pending, state => {
      state.loading = true
      state.error = null
    })
    builder.addCase(addProviderVps.fulfilled, (state, action) => {
      state.loading = false
      state.computers.push(action.payload)
    })
    builder.addCase(addProviderVps.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    builder.addCase(updateProviderVps.pending, state => {
      state.loading = true
      state.error = null
    })
    builder.addCase(updateProviderVps.fulfilled, (state, action) => {
      state.loading = false
      const updatedVps = action.payload
      const index = state.computers.findIndex(vps => vps.id === updatedVps.id)
      if (index !== -1) {
        state.computers[index] = updatedVps
      }
    })
    builder.addCase(updateProviderVps.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    builder.addCase(deleteProviderVps.pending, state => {
      state.loading = true
      state.error = null
    })
    builder.addCase(deleteProviderVps.fulfilled, (state, action) => {
      state.loading = false
      state.computers = state.computers.filter(vps => vps.id !== action.meta.arg)
    })
    builder.addCase(deleteProviderVps.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    builder.addCase(fetchAdminVps.pending, state => {
      state.loading = true
      state.error = null
    })
    builder.addCase(fetchAdminVps.fulfilled, (state, action) => {
      state.loading = false
      state.computers = action.payload
    })
    builder.addCase(fetchAdminVps.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
    })

    builder.addCase(addAdminVps.pending, state => {
      state.loading = true
      state.error = null
      state.message = null
      state.success = false
    })
    builder.addCase(addAdminVps.fulfilled, (state, action) => {
      state.loading = false
      state.computers.push(action.payload.data)
      state.message = action.payload.message 
      state.success = true
    })
    builder.addCase(addAdminVps.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
      state.success = false
    })

    builder.addCase(updateAdminVps.pending, state => {
      state.loading = true
      state.error = null
      state.message = null
      state.success = false
    })
    builder.addCase(updateAdminVps.fulfilled, (state, action) => {
      state.loading = false
      const updatedVps = action.payload.data
      const index = state.computers.findIndex(vps => vps.id === updatedVps.id)
      if (index !== -1) {
        state.computers[index] = updatedVps
      }
      state.message = action.payload.message
      state.success = true
    })
    builder.addCase(updateAdminVps.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
      state.success = false
    })

    builder.addCase(deleteAdminVps.pending, state => {
      state.loading = true
      state.error = null
      state.message = null
      state.success = false
    })
    builder.addCase(deleteAdminVps.fulfilled, (state, action) => {
      state.loading = false
      state.computers = state.computers.filter(vps => vps.id !== action.meta.arg) 
      state.message = action.payload.message 
      state.success = true
    })
    builder.addCase(deleteAdminVps.rejected, (state, action) => {
      state.loading = false
      state.error = action.payload as string
      state.success = false
    })

    builder.addCase(clearMessage, (state) => {
      state.message = null
      state.success = false
    })
  },
  selectors: {
    selectComputers: state => state.computers,
    selectCurrentComputer: state => state.currentComputer,
    selectLoading: state => state.loading,
    selectError: state => state.error,
    selectMessage: state => state.message,
    selectSuccess: state => state.success,
  },
})
export const clearMessage = createAction('vps/clearMessage');
export const { setCurrentComputer, clearError } = vpsSlice.actions
export const {
  selectComputers,
  selectCurrentComputer,
  selectLoading,
  selectError,
  selectMessage,
  selectSuccess,
} = vpsSlice.selectors
export default vpsSlice.reducer
