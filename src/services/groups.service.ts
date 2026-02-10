import api from "@/lib/api";
import type { GrupoOut, GrupoCreate, GrupoUpdate, ContactoOut, LinkContactsRequest } from "@/types/database";

export const groupsService = {
  list: () =>
    api.get<GrupoOut[]>("/management/grupos").then((r) => r.data),

  get: (id: number) =>
    api.get<GrupoOut>(`/management/grupos/${id}`).then((r) => r.data),

  create: (data: GrupoCreate) =>
    api.post<GrupoOut>("/management/grupos", data).then((r) => r.data),

  update: (id: number, data: GrupoUpdate) =>
    api.put<GrupoOut>(`/management/grupos/${id}`, data).then((r) => r.data),

  delete: (id: number) =>
    api.delete(`/management/grupos/${id}`).then((r) => r.data),

  // Contact association
  getContacts: (groupId: number) =>
    api.get<ContactoOut[]>(`/management/grupos/${groupId}/contactos`).then((r) => r.data),

  linkContact: (groupId: number, contactId: number) =>
    api.post(`/management/link/${contactId}/${groupId}`).then((r) => r.data),

  linkMultiple: (groupId: number, contactIds: number[]) =>
    api.post(`/management/link-multiple/${groupId}`, { id_contactos: contactIds } as LinkContactsRequest).then((r) => r.data),

  unlinkContact: (groupId: number, contactId: number) =>
    api.delete(`/management/unlink/${contactId}/${groupId}`).then((r) => r.data),
};