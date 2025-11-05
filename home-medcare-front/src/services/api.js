import axios from 'axios';

const host = window.location.hostname; // Captura o host atual (pode ser localhost, IP ou domínio).

const api = axios.create({
  baseURL: `http://${host}:8080/api`, // Monta dinamicamente a URL base da API.
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;