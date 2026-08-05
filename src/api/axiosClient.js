import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Thêm Interceptor để tự động gắn Token vào mọi Request gửi đi
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Tùy chọn: Thêm Interceptor cho Response để hứng lỗi chung (ví dụ: Token hết hạn)
axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Nếu lỗi 401 Unauthorized (Token hết hạn hoặc sai)
    if (error.response && error.response.status === 401) {
      console.error(
        "Token đã hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.",
      );
      // Có thể thêm logic tự động logout hoặc clear localStorage ở đây
      // localStorage.removeItem('token');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
