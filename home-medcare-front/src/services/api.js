import axios from "axios";
import { logout } from "../utils/logout/logout";

const host = window.location.hostname;

const api = axios.create({
  baseURL: `http://${host}:8080/api`,
  validateStatus: (status) => status >= 200 && status < 300,
});

// === SISTEMA DE LOADING GLOBAL ===
let requestCount = 0;

function showLoading() {
  requestCount++;
  document.body.classList.add("loading");
}

function hideLoading() {
  requestCount--;
  if (requestCount <= 0) {
    requestCount = 0;
    document.body.classList.remove("loading");
  }
}

// === INTERCEPTOR DE REQUEST ===
api.interceptors.request.use(
  (config) => {
    showLoading();

    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    hideLoading();
    return Promise.reject(error);
  }
);

// === INTERCEPTOR DE RESPONSE ===
api.interceptors.response.use(
  (response) => {
    hideLoading();
    return response;
  },
  (error) => {
    hideLoading();

    const url = error.config?.url;

    if (url?.includes("/auth/login")) {
      return Promise.reject(error);
    }

    if (error.response?.status === 403) {
      logout();
    }

    return Promise.reject(error);
  }
);

export default api;