// rootReducer.ts
import { combineReducers } from "@reduxjs/toolkit"
// import userAuthReducer from "./slices/userAuthSlice"
import authReducer from "./slices/authSlice";
import usersReducer from "./slices/userSlice"
import searchReducer from "@/redux/slices/searchSlice"
import studentProgressReducer from "@/redux/slices/studentProgressSlice"
import teacherDashboardReducer from "@/redux/slices/teacherDashboardSlice"
import teacherStudentChatReducer from "@/redux/slices/teacherStudentChatSlice"
import chatTutorReducer from "@/redux/slices/chatTutorSlice"
import assignmentManagementReducer from "@/redux/slices/assignmentManagementSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  user: usersReducer,
  search: searchReducer,
  studentProgress: studentProgressReducer,
  teacherDashboard: teacherDashboardReducer,
  chat: teacherStudentChatReducer,
  chatTutor: chatTutorReducer,
  assignmentManagement: assignmentManagementReducer
})

export default rootReducer
export type RootState = ReturnType<typeof rootReducer>