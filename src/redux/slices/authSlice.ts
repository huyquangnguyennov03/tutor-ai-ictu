import type { PayloadAction } from "@reduxjs/toolkit"
import { createAppSlice } from "@/redux/createAppSlice"
import type { Roles } from "@/common/constants/roles"

export interface userInfoInterface {
  email: string;
  email_verified: boolean;
  family_name: string;
  given_name: string;
  name: string;
  preferred_username: string;
  sub: string;
}

export interface UserSliceState {
  authenticated: boolean
  token: string | null
  role: Roles | null
  userInfo: userInfoInterface | null
  saleUpToken: string | null,
}

const initialState: UserSliceState = {
  authenticated: false,
  token: null,
  role:  null,
  userInfo:  null,
  saleUpToken: null,
}

const authSlice = createAppSlice({
  name: "auth",
  initialState,
  reducers: {

    setSaleUpToken(state, action: PayloadAction<string | null>) {  // Sử dụng ServiceInterface
      return {
        ...state,
        saleUpToken: action.payload,
      }
    },

    setToken(state, action: PayloadAction<string | null>) {  // Sử dụng ServiceInterface
      return {
        ...state,
        token: action.payload,
      }
    },
    setUserInfo(state, action: PayloadAction<UserSliceState>) {  // Sử dụng ServiceInterface
      return {
        ...action.payload
      }
    },
    clearUserInfo(state) {
      return {
        ...initialState
      }
    },
  },

  selectors: {
    selectAuthenticated: state => state.authenticated,
    selectRole: state => state.role,
    selectUserInfo: state => state.userInfo,
  },
})

export const { setToken, setUserInfo,setSaleUpToken, clearUserInfo } = authSlice.actions

export const { selectAuthenticated, selectRole, selectUserInfo } = authSlice.selectors

export default authSlice.reducer;