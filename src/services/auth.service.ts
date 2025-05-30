import {
  axiosInstance,
  axiosInstancePublic,
  logOut,
  login,
} from "@/utils/axios.instance";

export const registerUser = async (userData: any) => {
  const response = await axiosInstance.post("/api/auth/register", userData);
  return response.data;
};

export const loginUser = async (credentials: any) => {
  const res = await login(credentials);
  return res;
};

export const logout = async () => {
  try {
    const response = await logOut();
    // Xóa thông tin người dùng khỏi localStorage nếu cần
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    return response;
  } catch (error) {
    console.error('Lỗi khi đăng xuất:', error);
    // Xóa thông tin người dùng khỏi localStorage ngay cả khi API lỗi
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
    return null;
  }
};

export const verifyAccount = async (token: string) => {
  const response = await axiosInstancePublic.post(`/api/auth/verify`, {
    token,
  });
  return response.data;
};

export const checkAuth = async () => {
  const response = await axiosInstance.get("/api/auth/check-auth", {
    withCredentials: true, // đảm bảo gửi cookie nếu cần
  });
  return response.data;
};
