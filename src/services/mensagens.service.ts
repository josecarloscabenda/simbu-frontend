import api from "@/lib/api";
import type { MensagemSMSOut, MensagemSMSPaginatedOut, MensagemSMSFilters } from "@/types/database";

function buildParams(filters?: MensagemSMSFilters): string {
  if (!filters) return "";
  const params = new URLSearchParams();
  if (filters.skip != null) params.set("skip", filters.skip.toString());
  if (filters.limit != null) params.set("limit", filters.limit.toString());
  if (filters.status) params.set("status", filters.status);
  if (filters.id_campanha != null) params.set("id_campanha", filters.id_campanha.toString());
  if (filters.id_contacto != null) params.set("id_contacto", filters.id_contacto.toString());
  if (filters.data_inicio) params.set("data_inicio", filters.data_inicio);
  if (filters.data_fim) params.set("data_fim", filters.data_fim);
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export const mensagensService = {
  list: (filters?: MensagemSMSFilters) =>
    api.get<MensagemSMSPaginatedOut>(`/sms/mensagens${buildParams(filters)}`).then((r) => r.data),

  get: (id: number) =>
    api.get<MensagemSMSOut>(`/sms/mensagens/${id}`).then((r) => r.data),

  listByCampaign: (idCampanha: number, filters?: MensagemSMSFilters) =>
    api.get<MensagemSMSPaginatedOut>(`/sms/campaigns/${idCampanha}/mensagens${buildParams(filters)}`).then((r) => r.data),

  listByContact: (idContacto: number, filters?: MensagemSMSFilters) =>
    api.get<MensagemSMSPaginatedOut>(`/sms/contactos/${idContacto}/mensagens${buildParams(filters)}`).then((r) => r.data),
};
