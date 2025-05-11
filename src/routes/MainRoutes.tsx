import { lazy } from "react"
// import { AuthProvider } from "@/contexts/AuthProvider"

// project import
import Loadable from "@/components/Loadable"
import Dashboard from "@/layout/Dashboard"

const DashboardDefault = Loadable(lazy(() => import("@/pages/dashboard/index")))
const LearningProcess = Loadable(lazy(() => import("@/pages/learningProcess/")))
const CourseProgress = Loadable(lazy(() => import("@/pages/CDashboard/Index")))
const Chat = Loadable(lazy(() => import("@/pages/chat/Index")))
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
    }
  ],
}

export default MainRoutes