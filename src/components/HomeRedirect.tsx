import React, { useTransition, useEffect } from "react"
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
  const [isPending, startTransition] = useTransition()
  
  // Hiển thị loading trong khi kiểm tra xác thực hoặc đang chuyển đổi
  if (isAuthChecking || isPending) {
    return <Loader />
  }
  
  // Sử dụng useEffect để thực hiện chuyển hướng với startTransition
  useEffect(() => {
    if (!isAuthChecking) {
      startTransition(() => {
        // Không cần làm gì ở đây, chỉ đánh dấu rằng chúng ta đang trong quá trình chuyển đổi
      })
    }
  }, [isAuthChecking, startTransition])
  
  // Chỉ chuyển hướng sau khi đã kiểm tra xong
  if (isAuthenticated) {
    return <Navigate to="/app/trang-chu" replace />
  }
  
  return <Navigate to="/login" replace />
}

export default HomeRedirect