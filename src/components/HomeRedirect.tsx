import { Navigate } from "react-router-dom"
import { useAppSelector } from "@/redux/hooks"
import { selectAuthenticated } from "@/redux/slices/authSlice"
import Loader from "./Loader"
import { useAuth } from "@/contexts/auth"

/**
 * Simple component to handle redirection from the root path (/)
 * If user is authenticated, redirect to app dashboard
 * Otherwise, redirect to login page
 */
const HomeRedirect = () => {
  const isAuthenticated = useAppSelector(selectAuthenticated)
  const { isAuthChecking } = useAuth()
  
  // Hiển thị loading trong khi kiểm tra xác thực
  if (isAuthChecking) {
    return <Loader />
  }
  
  // Chỉ chuyển hướng sau khi đã kiểm tra xong
  if (isAuthenticated) {
    return <Navigate to="/app/trang-chu" replace />
  }
  
  return <Navigate to="/login" replace />
}

export default HomeRedirect