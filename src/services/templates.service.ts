import api from "@/lib/api";
import type { TemplateOut, TemplateCreate, TemplateUpdate } from "@/types/database";

export const templatesService = {
  list: () =>
    api.get<TemplateOut[]>("/sms/templates").then((r) => r.data),

  get: (id: number) =>
    api.get<TemplateOut>(`/sms/templates/${id}`).then((r) => r.data),

  create: (data: TemplateCreate) =>
    api.post<TemplateOut>("/sms/templates", data).then((r) => r.data),

  update: (id: number, data: TemplateUpdate) =>
    api.put<TemplateOut>(`/sms/templates/${id}`, data).then((r) => r.data),

  delete: (id: number) =>
    api.delete(`/sms/templates/${id}`).then((r) => r.data),
};