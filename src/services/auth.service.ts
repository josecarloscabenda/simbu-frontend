import api from "@/lib/api";
import type {
  LoginRequest,
  LoginResponse,
  UtilizadorCreateIn,
  UtilizadorOut,
  ProfileUpdateIn,
  ChangePasswordIn,
} from "@/types/database";

export const authService = {
  login: (data: LoginRequest) =>
    api.post<LoginResponse>("/auth/login", data).then((r) => r.data),

  register: (data: Omit<UtilizadorCreateIn, "id_permissao"> & { id_permissao?: number }) =>
    api.post<UtilizadorOut>("/admin/users", { ...data, id_permissao: data.id_permissao ?? 1 }).then((r) => r.data),

  me: () =>
    api.get<UtilizadorOut>("/auth/me").then((r) => r.data),

  updateProfile: (data: ProfileUpdateIn) =>
    api.put<UtilizadorOut>("/auth/me", data).then((r) => r.data),

  changePassword: (data: ChangePasswordIn) =>
    api.put("/auth/change-password", data).then((r) => r.data),

  logout: () =>
    api.post("/auth/logout").catch(() => {}),
};