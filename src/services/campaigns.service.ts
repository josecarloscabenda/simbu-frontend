import api from "@/lib/api";
import type { CampanhaOut, SMSCampaignPayload, CampaignUpdatePayload, CampaignPreview } from "@/types/database";

export const campaignsService = {
  list: () =>
    api.get<CampanhaOut[]>("/sms/campaigns").then((r) => r.data),

  get: (id: number) =>
    api.get<CampanhaOut>(`/sms/campaigns/${id}`).then((r) => r.data),

  create: (data: SMSCampaignPayload) =>
    api.post<CampanhaOut>("/sms/campaigns", data).then((r) => r.data),

  update: (id: number, data: CampaignUpdatePayload) =>
    api.put<CampanhaOut>(`/sms/campaigns/${id}`, data).then((r) => r.data),

  delete: (id: number) =>
    api.delete(`/sms/campaigns/${id}`).then((r) => r.data),

  sendToGroup: (campaignId: number, groupId: number) =>
    api.post(`/sms/send-group/${groupId}/campaign/${campaignId}`).then((r) => r.data),

  resend: (campaignId: number, groupId: number) =>
    api.post(`/sms/campaigns/${campaignId}/resend/${groupId}`).then((r) => r.data),

  preview: (campaignId: number, groupId: number) =>
    api.get<CampaignPreview>(`/sms/campaigns/${campaignId}/preview/${groupId}`).then((r) => r.data),
};