import React, { useTransition, useEffect, useState } from "react"
import { Navigate } from "react-router-dom"
import { useAppSelector } from "@/redux/hooks"
import { selectAuthenticated } from "@/redux/slices/authSlice"
import Loader from "./Loader"

/**
 * Simple component to handle redirection from the root path (/)
 * If user is authenticated, redirect to app dashboard
 * Otherwise, redirect to login page
 */
const HomeRedirect = () => {
  const isAuthenticated = useAppSelector(selectAuthenticated)
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  
  // Giả lập thời gian kiểm tra xác thực
  useEffect(() => {
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
  if (isAuthenticated) {
    return <Navigate to="/app/trang-chu" replace />
  }
  
  return <Navigate to="/login" replace />
}

export default HomeRedirect