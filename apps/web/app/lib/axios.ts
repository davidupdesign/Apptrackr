import axios from "axios";

// creating an axios instance with the backend url as the base
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://localhost:3000",
});

// request interceptor runs before every request
// automatically attaches the jwt token from localstorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
