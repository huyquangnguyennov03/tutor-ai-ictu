import axios from "axios";
import { store } from "@/redux/store";

// Tạo instance của Axios cho Core API
export const AxiosCoreInstance = axios.create({
  baseURL: `${import.meta.env.VITE_CORE_API_URL}`,
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json"
  }
});

// Thêm interceptor để gắn token từ localStorage
AxiosCoreInstance.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.auth.saleUpToken; // Lấy token từ Redux state
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})
