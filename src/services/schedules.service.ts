import api from "@/lib/api";
import type { AgendamentoOut, AgendamentoCreate } from "@/types/database";

export const schedulesService = {
  list: () =>
    api.get<AgendamentoOut[]>("/sms/agendamentos").then((r) => r.data),

  get: (id: number) =>
    api.get<AgendamentoOut>(`/sms/agendamentos/${id}`).then((r) => r.data),

  create: (data: AgendamentoCreate) =>
    api.post<AgendamentoOut>("/sms/schedule", data).then((r) => r.data),

  delete: (id: number) =>
    api.delete(`/sms/agendamentos/${id}`).then((r) => r.data),
};