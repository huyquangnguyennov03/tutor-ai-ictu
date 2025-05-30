import { createBrowserRouter, Navigate } from "react-router-dom"
import { lazy, createElement } from "react"

// project import
import MainRoutes from "./MainRoutes"
import Loadable from "@/components/Loadable"

// Lazy load pages
const LoginPage = Loadable(lazy(() => import("@/contexts/login/page")))
const LogoutPage = Loadable(lazy(() => import("@/contexts/logout/page")))
const RegisterPage = Loadable(lazy(() => import("@/contexts/register/page")))
const VerifyAccountPage = Loadable(lazy(() => import("@/contexts/verify-account/page")))

// ==============================|| ROUTING RENDER ||============================== //

// Define auth routes
const authRoutes = [
  {
    path: "login",
    element: createElement(LoginPage),
  },
  {
    path: "register",
    element: createElement(RegisterPage),
  },
  {
    path: "logout",
    element: createElement(LogoutPage),
  },
  {
    path: "verify-account",
    element: createElement(VerifyAccountPage),
  },
]

// Create redirect components for legacy URLs
const createRedirectComponent = (to: string) => {
  const RedirectComponent = () => {
    return createElement(Navigate, { to, replace: true });
  };
  return RedirectComponent;
};

// Combine all routes into a single root route to avoid path conflicts
const rootRoute = {
  path: "/",
  children: [
    // We'll handle root redirect in App.tsx
    {
      path: "",
      // This will be a simple component that checks auth state and redirects
      element: createElement(lazy(() => import("@/components/HomeRedirect"))),
    },
    // Add auth routes (public)
    ...authRoutes,
    // Add protected routes
    MainRoutes,
    {
      path: "trang-chu",
       element: createElement(createRedirectComponent("/app/trang-chu")),
     },
    
    // Legacy URL redirects - redirect old URLs to new structure with /app prefix
    {
      path: "game-fi",
      element: createElement(createRedirectComponent("/app/game-fi")),
    },
    {
      path: "tien-do-hoc-tap/:studentId",
      element: createElement(createRedirectComponent("/app/tien-do-hoc-tap/:studentId")),
    },
    {
      path: "tong-quan-tien-do",
      element: createElement(createRedirectComponent("/app/tong-quan-tien-do")),
    },
    {
      path: "chat",
      element: createElement(createRedirectComponent("/app/chat")),
    },
    {
      path: "chat-tutor",
      element: createElement(createRedirectComponent("/app/chat-tutor")),
    },
    {
      path: "assignment",
      element: createElement(createRedirectComponent("/app/assignment")),
    },
    {
      path: "learning-path",
      element: createElement(createRedirectComponent("/app/learning-path")),
    }
  ]
}

const router = createBrowserRouter([rootRoute], {
  basename: import.meta.env.VITE_APP_BASE_NAME,
})

export default router