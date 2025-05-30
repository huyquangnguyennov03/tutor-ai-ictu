import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_PUBLIC_API_BASE_URL || "http://localhost:5000";

// Hàng đợi chờ refresh token
let isRefreshing = false;
let failedQueue: any = [];

// Biến lưu interval
let refreshInterval: NodeJS.Timeout | null = null;

const processQueue = (error: any, token = null) => {
  failedQueue.forEach((prom: any) => {
    if (token) {
      prom.resolve(token);
    } else {
      prom.reject(error);
    }
  });
  failedQueue = [];
};

// Tạo instance Axios
const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

const axiosInstancePublic = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Hàm kiểm tra môi trường client
const isClient = typeof window !== "undefined";

// Hàm làm mới token
const refreshToken = async () => {
  try {
    const res = await axiosInstancePublic.post("/api/auth/refresh-token");
    if (res.status !== 201) {
      // Giả sử dùng status 200 theo đề xuất trước
      throw new Error("Refresh token failed");
    }
    return res;
  } catch (error) {
    if (isClient && window.location.pathname !== "/login") {
      window.location.href = "/login";
    }
    throw error;
  }
};

// Hàm thiết lập interval để refresh token định kỳ
const startTokenRefresh = () => {
  if (!isClient || refreshInterval) return; // Không làm gì trên server hoặc nếu interval đã tồn tại

  const REFRESH_INTERVAL = 57 * 60 * 1000; // 57 phút (3420 giây)
  refreshInterval = setInterval(async () => {
    try {
      console.log("Auto refreshing token...");
      await refreshToken();
    } catch (error) {
      console.error("Periodic refresh token failed:", error);
    }
  }, REFRESH_INTERVAL);
};

// Hàm hủy interval
const stopTokenRefresh = () => {
  if (!isClient || !refreshInterval) return;
  clearInterval(refreshInterval);
  refreshInterval = null;
};

// Interceptor request (không cần kiểm tra exp)
axiosInstance.interceptors.request.use(
  async (config) => {
    // Nếu đang refresh, chờ cho đến khi hoàn tất
    if (isClient && isRefreshing) {
      await new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      });
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor response (dự phòng cho lỗi 401)
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry && isClient) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => axiosInstance(originalRequest));
      }

      isRefreshing = true;

      return new Promise((resolve, reject) => {
        refreshToken()
          .then(() => {
            processQueue(null);
            resolve(axiosInstance(originalRequest));
          })
          .catch((err) => {
            processQueue(err, null);
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }

    return Promise.reject(error);
  }
);

// Hàm fetchWithAutoRefresh
async function fetchWithAutoRefresh(
  input: RequestInfo,
  init?: RequestInit
): Promise<Response> {
  let response = await fetch(input, {
    ...init,
    credentials: "include",
  });

  if (response.status === 401 && isClient) {
    try {
      await refreshToken();
      response = await fetch(input, {
        ...init,
        credentials: "include",
      });
    } catch (err) {
      console.error("Refresh token failed:", err);
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
      throw err;
    }
  }

  return response;
}

// Hàm đăng nhập
const login = async (credentials: any) => {
  try {
    const res = await axiosInstancePublic.post("/api/auth/login", credentials);
    if (res.status === 201 && isClient) {
      startTokenRefresh(); // Bắt đầu refresh định kỳ sau khi đăng nhập
    }
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Hàm đăng xuất (tùy chọn, nếu cần)
const logOut = async () => {
  if (isClient) {
    const res = await axiosInstancePublic.get("/api/auth/logout");
    stopTokenRefresh(); // Hủy interval khi đăng xuất
    return res.data;
  }
};

// Khởi tạo refresh định kỳ khi ứng dụng bắt đầu
if (isClient) {
  startTokenRefresh();
}

export {
  axiosInstance,
  axiosInstancePublic,
  fetchWithAutoRefresh,
  login,
  logOut,
};
