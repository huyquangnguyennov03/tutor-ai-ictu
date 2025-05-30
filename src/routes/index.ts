import { createBrowserRouter } from "react-router-dom"
import { lazy, createElement } from "react"

// project import
import MainRoutes from "./MainRoutes"
import Loadable from "@/components/Loadable"

// Lazy load pages
const LoginPage = Loadable(lazy(() => import("@/contexts/login/page")))
const LogoutPage = Loadable(lazy(() => import("@/contexts/logout/page")))
const RegisterPage = Loadable(lazy(() => import("@/contexts/register/page")))
const VerifyAccountPage = Loadable(lazy(() => import("@/contexts/verify-account/page")))

// Auth routes
const AuthRoutes = {
  path: "/",
  children: [
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
  ],
}

// ==============================|| ROUTING RENDER ||============================== //

const router = createBrowserRouter([AuthRoutes, MainRoutes], {
  basename: import.meta.env.VITE_APP_BASE_NAME,
})

export default router