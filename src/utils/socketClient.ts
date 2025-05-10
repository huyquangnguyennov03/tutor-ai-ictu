import type { Socket } from 'socket.io-client';
import { io } from 'socket.io-client';
import { store } from '@/redux/store';

// Hàm khởi tạo kết nối Socket.IO
export const createSocketConnection = (params: object = {}): Socket => {
  const token = store.getState().auth.token;
  return io(`${import.meta.env.VITE_SOCKET_URL}`, {
    query: params,
    extraHeaders: {
      Authorization: `Bearer ${token}`, // Thêm token vào header Authorization
    },
  });
};
