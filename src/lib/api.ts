import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:9000",
  headers: { "Content-Type": "application/json" },
});

// Intercepta as requisições para adicionar o token de autenticação, se disponível, e intercepta as respostas para lidar com erros de autenticação (401) redirecionando para a página de login.
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("simbu_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Intercepta as respostas para lidar com erros de autenticação (401) redirecionando para a página de login e limpando o armazenamento local.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("simbu_token");
      localStorage.removeItem("simbu_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;