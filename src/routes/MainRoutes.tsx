import { lazy } from "react"
// import { AuthProvider } from "@/contexts/AuthProvider"

// project import
import Loadable from "@/components/Loadable"
import Dashboard from "@/layout/Dashboard"

const DashboardDefault = Loadable(lazy(() => import("@/pages/dashboard/index")))
const LearningProcess = Loadable(lazy(() => import("@/pages/learningProcess/")))
const CourseProgress = Loadable(lazy(() => import("@/pages/CDashboard/Index")))
const Chat = Loadable(lazy(() => import("@/pages/chat/Index")))
const ChatTutor = Loadable(lazy(() => import("@/pages/chatTutor/Index")))
const Assignment = Loadable(lazy(() => import("@/pages/assignment/AssignmentManagement")))
const LearningPath = Loadable(lazy(() => import("@/pages/learningPath")))
// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: "/",
  element: <Dashboard />,
  children: [
    {
      path: "/",
      element: <DashboardDefault />,
    },
    {
      path: "trang-chu",
      children: [
        {
          path: "",
          element: <DashboardDefault />,
        },
      ],
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
    }
  ],
}

export default MainRoutes