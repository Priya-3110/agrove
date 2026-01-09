import axios from "axios";

export const api = axios.create({
  baseURL: "https://agrove-1hya.onrender.com/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = token;
  }
  return config;
});
