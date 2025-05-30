import { lazy } from "react"
import { Navigate, Outlet } from "react-router-dom"

// project import
import Loadable from "@/components/Loadable"
import Dashboard from "@/layout/Dashboard"
import { useAppSelector } from "@/redux/hooks"
import { selectAuthenticated, selectRole, selectUserInfo } from "@/redux/slices/authSlice"
import { Roles } from "@/common/constants/roles"

// Protected route component
const ProtectedRoute = () => {
  const isAuthenticated = useAppSelector(selectAuthenticated)
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  
  return <Outlet />
}

const DashboardDefault = Loadable(lazy(() => import("@/pages/dashboard/index")))
const LearningProcess = Loadable(lazy(() => import("@/pages/learningProcess/")))
const CourseProgress = Loadable(lazy(() => import("@/pages/CDashboard/Index")))
const Chat = Loadable(lazy(() => import("@/pages/chat/Index")))
const ChatTutor = Loadable(lazy(() => import("@/pages/chatTutor/Index")))
const Assignment = Loadable(lazy(() => import("@/pages/assignment/AssignmentManagement")))
const LearningPath = Loadable(lazy(() => import("@/pages/learningPath")))
const GameFi = Loadable(lazy(() => import("@/pages/gameFi/Index")))

// Component to redirect based on user role
const RoleBasedRedirect = () => {
  const userRole = useAppSelector(selectRole)
  const userInfo = useAppSelector(selectUserInfo)

  if (userRole === Roles.TEACHER) {
    return <Navigate to="/app/tong-quan-tien-do" replace />
  } else if (userRole === Roles.STUDENT) {
    // Sử dụng sub từ userInfo làm studentId nếu có
    // const studentId = userInfo?.sub || "current"
    const studentId = "C01001"
    return <Navigate to={`/app/tien-do-hoc-tap/${studentId}`} replace />
  }

  // Default fallback
  return <DashboardDefault />
}

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: "app", // Add a prefix for all protected routes
  element: <ProtectedRoute />,
  children: [
    {
      element: <Dashboard />,
      children: [
        {
          path: "", // Default route for /app
          element: <RoleBasedRedirect />,
        },
        {
          path: "dashboard",
          element: <RoleBasedRedirect />,
        },
        {
          path: "trang-chu",
          element: <RoleBasedRedirect />,
        },
        {
          path: "tien-do-hoc-tap/:studentId",
          element: <LearningProcess />,
        },
        {
          path: "tong-quan-tien-do",
          element: <CourseProgress />,
        },
        {
          path: "chat",
          element: <Chat />,
        },
        {
          path: "chat-tutor",
          element: <ChatTutor />,
        },
        {
          path: "assignment",
          element: <Assignment/>
        },
        {
          path: "learning-path",
          element: <LearningPath/>
        },
        {
          path: "game-fi",
          element: <GameFi/>
        }
      ]
    }
  ],
}

export default MainRoutes