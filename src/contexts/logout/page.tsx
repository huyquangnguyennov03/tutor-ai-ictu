import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { logout } from '@/services/auth.service'
import Swal from 'sweetalert2'
import { useAppDispatch } from '@/redux/hooks'
import { setToken, setUserInfo } from '@/redux/slices/authSlice'
import { useAuthStore } from '@/store/auth'

export default function Logout() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { setUser } = useAuthStore()
  const [loading, setLoading] = useState(false)
  
  useEffect(() => {
    async function logoutUser() {
      try {
        setLoading(true)
        await logout()
        
        // Xóa thông tin người dùng trong Redux
        dispatch(setToken(null))
        dispatch(setUserInfo({
          authenticated: false,
          token: null,
          role: null,
          userInfo: null,
          saleUpToken: null,
        }))
        
        // Xóa thông tin người dùng trong Zustand
        setUser(null)
        
        navigate('/login')
      } catch (error) {
        console.error('Lỗi khi đăng xuất:', error)
        navigate('/login')
      } finally {
        setLoading(false)
      }
    }
    logoutUser()
  }, [])
  useEffect(() => {
    if (loading) {
      Swal.fire({
        title: 'Logging out...',
        text: 'Please wait while we log you out',
        icon: 'info',
        allowOutsideClick: false,
        showConfirmButton: false,
      })
    }
    if (!loading) {
      Swal.close()
    }
    return () => {
      Swal.close()
    }
  }, [loading])
  return <div>Logout</div>
}
