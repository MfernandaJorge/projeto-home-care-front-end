import axios from "axios";
import { logout } from "../utils/logout/logout";

const host = window.location.hostname;

const api = axios.create({
  baseURL: `http://${host}:8080/api`,
  validateStatus: (status) => status >= 200 && status < 300,
});

// Configura token.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Tratamento de erros.
api.interceptors.response.use(
  (response) => {
    // Sem error, apenas retorna a resposta.
    return response;
  },
  (error) => {
    if (error.response?.status === 403) {
      logout();
    }
    return PromiseRejectionEvent;
  }
);

export default api;