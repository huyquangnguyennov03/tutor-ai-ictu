import { Navigate } from "react-router-dom"
import { useAppSelector } from "@/redux/hooks"
import { selectAuthenticated } from "@/redux/slices/authSlice"

/**
 * Simple component to handle redirection from the root path (/)
 * If user is authenticated, redirect to app dashboard
 * Otherwise, redirect to login page
 */
const HomeRedirect = () => {
  const isAuthenticated = useAppSelector(selectAuthenticated)
  
  if (isAuthenticated) {
    return <Navigate to="/app" replace />
  }
  
  return <Navigate to="/login" replace />
}

export default HomeRedirect