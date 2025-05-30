import React, { createContext, useContext, useEffect, ReactNode, useState } from 'react';
import { useAuthStore } from '@/store/auth';
import { checkAuth } from '@/services/auth.service';
import { useAppDispatch } from '@/redux/hooks';
import { setToken, setUserInfo } from '@/redux/slices/authSlice';
import { Roles } from '@/common/constants/roles';

interface AuthContextType {
  isAuthenticated: boolean;
  isServerAvailable: boolean;
  checkAuthentication: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { user, isLoggedIn, setUser } = useAuthStore();
  const dispatch = useAppDispatch();
  const [isServerAvailable, setIsServerAvailable] = useState<boolean>(true);

  const checkAuthentication = async (): Promise<boolean> => {
    try {
      const response = await checkAuth();
      setIsServerAvailable(true); // Server đã phản hồi thành công
      
      if (response && response.email) {
        // Cập nhật Zustand store
        setUser({
          fullName: response.fullName || response.name,
          email: response.email,
          role: response.role,
          sub: response.sub,
        });

        // Cập nhật Redux store
        dispatch(setToken(response.token || null));
        dispatch(setUserInfo({
          authenticated: true,
          token: response.token || null,
          role: response.role as Roles,
          userInfo: {
            email: response.email,
            email_verified: response.email_verified || true,
            family_name: response.family_name || '',
            given_name: response.given_name || '',
            name: response.fullName || response.name,
            preferred_username: response.preferred_username || response.email,
            sub: response.sub,
          },
          saleUpToken: null,
        }));
        return true;
      }
      return false;
    } catch (error: any) {
      console.error('Lỗi khi kiểm tra xác thực:', error);
      
      // Kiểm tra lỗi kết nối mạng
      if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
        setIsServerAvailable(false);
        console.warn('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng hoặc server.');
      }
      
      return false;
    }
  };

  useEffect(() => {
    checkAuthentication();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated: isLoggedIn, 
      isServerAvailable,
      checkAuthentication 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth phải được sử dụng trong AuthProvider');
  }
  return context;
};