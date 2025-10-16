import axios from "axios";

export const apiClient = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Response Interceptor
apiClient.interceptors.response.use(
  response => response.data,
  error => Promise.reject(error)
);
