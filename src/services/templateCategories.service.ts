import api from "@/lib/api";
import type { TemplateCategoriaOut, TemplateCategoriaCreate, TemplateCategoriaUpdate } from "@/types/database";

export const templateCategoriesService = {
  list: () =>
    api.get<TemplateCategoriaOut[]>("/sms/template-categorias").then((r) => r.data),

  create: (data: TemplateCategoriaCreate) =>
    api.post<TemplateCategoriaOut>("/sms/template-categorias", data).then((r) => r.data),

  update: (id: number, data: TemplateCategoriaUpdate) =>
    api.put<TemplateCategoriaOut>(`/sms/template-categorias/${id}`, data).then((r) => r.data),

  delete: (id: number) =>
    api.delete(`/sms/template-categorias/${id}`).then((r) => r.data),
};