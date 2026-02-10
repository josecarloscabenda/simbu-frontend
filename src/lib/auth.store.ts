import { create } from "zustand";
import type { UtilizadorOut } from "@/types/database";

interface AuthState {
  user: UtilizadorOut | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: UtilizadorOut, token: string) => void;
  setUser: (user: UtilizadorOut) => void;
  logout: () => void;
  initialize: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setAuth: (user, token) => {
    localStorage.setItem("simbu_token", token);
    localStorage.setItem("simbu_user", JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  setUser: (user) => {
    localStorage.setItem("simbu_user", JSON.stringify(user));
    set({ user });
  },

  logout: () => {
    localStorage.removeItem("simbu_token");
    localStorage.removeItem("simbu_user");
    set({ user: null, token: null, isAuthenticated: false });
  },

  initialize: () => {
    const token = localStorage.getItem("simbu_token");
    const userStr = localStorage.getItem("simbu_user");
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ user, token, isAuthenticated: true });
      } catch {
        set({ user: null, token: null, isAuthenticated: false });
      }
    }
  },
}));