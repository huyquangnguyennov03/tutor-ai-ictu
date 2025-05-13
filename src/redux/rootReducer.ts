// rootReducer.ts
import { combineReducers } from "@reduxjs/toolkit"
// import userAuthReducer from "./slices/userAuthSlice"
import authReducer from "./slices/authSlice";
import usersReducer from "./slices/userSlice"
import searchReducer from "@/redux/slices/searchSlice"
import studentProgressReducer from "@/redux/slices/studentProgressSlice"
import teacherDashboardReducer from "@/redux/slices/teacherDashboardSlice"
import teacherStudentChatReducer from "@/redux/slices/teacherStudentChatSlice"

const rootReducer = combineReducers({
  auth: authReducer,
  user: usersReducer,
  search: searchReducer,
  studentProgress: studentProgressReducer,
  teacherDashboard: teacherDashboardReducer,
  chat: teacherStudentChatReducer
})

export default rootReducer
export type RootState = ReturnType<typeof rootReducer>