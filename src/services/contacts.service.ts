import api from "@/lib/api";
import type { ContactoOut, ContactoCreate, ContactoUpdate } from "@/types/database";

export const contactsService = {
  list: () =>
    api.get<ContactoOut[]>("/management/contactos").then((r) => r.data),

  get: (id: number) =>
    api.get<ContactoOut>(`/management/contactos/${id}`).then((r) => r.data),

  create: (data: ContactoCreate) =>
    api.post<ContactoOut>("/management/contactos", data).then((r) => r.data),

  update: (id: number, data: ContactoUpdate) =>
    api.put<ContactoOut>(`/management/contactos/${id}`, data).then((r) => r.data),

  delete: (id: number) =>
    api.delete(`/management/contactos/${id}`).then((r) => r.data),
};