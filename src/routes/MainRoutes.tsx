import { lazy, useTransition, useEffect, useState } from "react"
import { Navigate, Outlet } from "react-router-dom"

// project import
import Loadable from "@/components/Loadable"
import Dashboard from "@/layout/Dashboard"
import { useAppSelector } from "@/redux/hooks"
import { selectAuthenticated } from "@/redux/slices/authSlice"
import Loader from "@/components/Loader"

// Protected route component
const ProtectedRoute = () => {
  const isAuthenticated = useAppSelector(selectAuthenticated)
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  
  useEffect(() => {
    // Giả lập thời gian kiểm tra xác thực
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [])
  
  // Sử dụng useEffect để thực hiện chuyển hướng với startTransition
  useEffect(() => {
    if (!isLoading) {
      startTransition(() => {
        // Không cần làm gì ở đây, chỉ đánh dấu rằng chúng ta đang trong quá trình chuyển đổi
      })
    }
  }, [isLoading, startTransition])
  
  // Hiển thị loading trong khi kiểm tra xác thực hoặc đang chuyển đổi
  if (isLoading || isPending) {
    return <Loader />
  }
  
  // Chỉ chuyển hướng sau khi đã kiểm tra xong
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

// Component to redirect to dashboard regardless of user role
const RoleBasedRedirect = () => {
  // Luôn chuyển hướng đến trang chủ, không phân biệt vai trò
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