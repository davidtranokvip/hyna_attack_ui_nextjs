import axios from "axios";
import { getTokenFromCookie, removeTokenCookie } from "./cookies";

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export const axiosInstancePublic = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

export const axiosInstance = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const hyna_token = getTokenFromCookie();
    if (hyna_token) {
      config.headers["Authorization"] = `Bearer ${hyna_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      removeTokenCookie()
      window.location.href = "/login";
    }
    return Promise.reject(error.response.data.message);
  }
);
