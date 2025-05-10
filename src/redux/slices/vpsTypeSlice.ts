import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axiosInstance from "@/utils/axiosInstance"
import { API_ENDPOINTS } from "@/common/constants/apis"
import type { VpsType } from "@/common/interfaces/vps.interface"

type NewVpsType = Omit<VpsType, "id">

interface VpsTypeState {
  data: VpsType[]
  loading: boolean
  error: string | null
  message: string | null
  success: boolean
}

export const fetchVpsTypes = createAsyncThunk<VpsType[]>(
  "vpsType/fetchVPS",
  async () => {
    const response = await axiosInstance.get(
      API_ENDPOINTS.VPS_TYPE.FETCH_VPS_TYPES,
    )
    return response.data
  },
)

export const addVpsType = createAsyncThunk<{ message: string }, NewVpsType>(
  "vpsType/addVPS",
  async (vps: NewVpsType) => {
    const response = await axiosInstance.post(
      API_ENDPOINTS.VPS_TYPE.ADD_VPS_TYPE,
      vps,
    )
    return { message: response.data.message || "Thêm VPS Type thành công!" }
  },
)

export const updateVpsType = createAsyncThunk<
  { message: string },
  { vpsId: string; vpsData: NewVpsType }
>("vpsType/updateVPS", async ({ vpsId, vpsData }) => {
  const response = await axiosInstance.patch(
    `${API_ENDPOINTS.VPS_TYPE.EDIT_VPS_TYPE}/${vpsId}`,
    vpsData,
  )
  return { message: response.data.message || "Cập nhật VPS Type thành công!" }
})

export const deleteVpsType = createAsyncThunk<{ message: string }, string>(
  "vpsType/deleteVPS",
  async (vpsId: string) => {
    const response = await axiosInstance.delete(
      `${API_ENDPOINTS.VPS_TYPE.DELETE_VPS_TYPE}/${vpsId}`,
    )
    return { message: response.data.message || "Đã xóa VPS Type thành công!" }
  },
)

const initialState: VpsTypeState = {
  data: [],
  loading: false,
  error: null,
  message: null,
  success: false,
}

const vpsTypeSlice = createSlice({
  name: "vpsType",
  initialState,
  reducers: {
    clearMessage: state => {
      state.message = null
      state.success = false
      state.error = null
    },
  },
  extraReducers: builder => {
    builder
      // Fetch VPS Types
      .addCase(fetchVpsTypes.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchVpsTypes.fulfilled, (state, action) => {
        state.loading = false
        state.data = action.payload
      })
      .addCase(fetchVpsTypes.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Lỗi khi tải dữ liệu"
        state.success = false
      })

      // Add VPS Type
      .addCase(addVpsType.pending, state => {
        state.loading = true
        state.error = null
        state.message = null
      })
      .addCase(addVpsType.fulfilled, (state, action) => {
        state.loading = false
        state.message = action.payload.message
        state.success = true
      })
      .addCase(addVpsType.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Lỗi khi thêm VPS Type"
        state.success = false
      })

      // Update VPS Type
      .addCase(updateVpsType.pending, state => {
        state.loading = true
        state.error = null
        state.message = null
      })
      .addCase(updateVpsType.fulfilled, (state, action) => {
        state.loading = false
        state.message = action.payload.message
        state.success = true
      })
      .addCase(updateVpsType.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Lỗi khi cập nhật VPS Type"
        state.success = false
      })

      // Delete VPS Type
      .addCase(deleteVpsType.pending, state => {
        state.loading = true
        state.error = null
        state.message = null
      })
      .addCase(deleteVpsType.fulfilled, (state, action) => {
        state.loading = false
        state.message = action.payload.message
        state.success = true
      })
      .addCase(deleteVpsType.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Lỗi khi xóa VPS Type"
        state.success = false
      })
  },
})

export const { clearMessage } = vpsTypeSlice.actions
export const selectVpsTypes = (state: { vpsType: VpsTypeState }) =>
  state.vpsType.data
export const selectVpsTypeLoading = (state: { vpsType: VpsTypeState }) =>
  state.vpsType.loading
export const selectVpsTypeMessage = (state: { vpsType: VpsTypeState }) =>
  state.vpsType.message
export const selectVpsTypeError = (state: { vpsType: VpsTypeState }) =>
  state.vpsType.error
export const selectVpsTypeSuccess = (state: { vpsType: VpsTypeState }) =>
  state.vpsType.success

export default vpsTypeSlice.reducer
