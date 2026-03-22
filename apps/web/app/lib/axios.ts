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

// response interceptor runs after every response
// catches 401 (unauthorized) and logs the user out
api.interceptors.response.use(
  (response) => response, // pass through successful responses
  (error) => {
    if (error.response?.status === 401) {
      // clearing token and cookie
      localStorage.removeItem("token");
      document.cookie = "token=; path=/; max-age=0";
      // redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
