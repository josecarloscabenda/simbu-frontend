import api from "@/lib/api";
import type { UtilizadorOut, UtilizadorCreateIn, PermissaoOut } from "@/types/database";

export const adminService = {
  // Utilizadores
  listUsers: () =>
    api.get<UtilizadorOut[]>("/admin/users").then((r) => r.data),

  createUser: (data: UtilizadorCreateIn) =>
    api.post<UtilizadorOut>("/admin/users", data).then((r) => r.data),

  deactivateUser: (id: number) =>
    api.delete(`/admin/users/${id}`).then((r) => r.data),

  // Permissoes
  listPermissions: () =>
    api.get<PermissaoOut[]>("/admin/permissions").then((r) => r.data),

  createPermission: (nomeGrupo: string) =>
    api.post<PermissaoOut>(`/admin/permissions?nome_grupo=${encodeURIComponent(nomeGrupo)}`).then((r) => r.data),
};
