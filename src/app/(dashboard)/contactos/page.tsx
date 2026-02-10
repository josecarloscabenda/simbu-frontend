"use client";

import { useState, useEffect, useCallback } from "react";
import DataTable, { type Column } from "@/components/ui/DataTable";
import Button from "@/components/ui/button";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import ContactFormModal from "@/features/contacts/components/ContactFormModal";
import { contactsService } from "@/services/contacts.service";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import type { ContactoOut } from "@/types/database";

export default function ContactsPage() {
  const { toast } = useToast();
  const [contacts, setContacts] = useState<ContactoOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editContact, setEditContact] = useState<ContactoOut | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContactoOut | null>(null);

  const loadContacts = useCallback(async () => {
    try {
      const data = await contactsService.list();
      setContacts(data);
    } catch {
      toast("error", "Erro ao carregar contactos");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { loadContacts(); }, [loadContacts]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await contactsService.delete(deleteTarget.id_contacto);
      toast("success", "Contacto eliminado");
      setDeleteTarget(null);
      loadContacts();
    } catch {
      toast("error", "Erro ao eliminar contacto");
    }
  };

  const filtered = search
    ? contacts.filter((c) => {
        const q = search.toLowerCase();
        return (
          c.nome.toLowerCase().includes(q) ||
          (c.sobrenome && c.sobrenome.toLowerCase().includes(q)) ||
          (c.email && c.email.toLowerCase().includes(q)) ||
          (c.telefone && c.telefone.includes(q))
        );
      })
    : contacts;

  const columns: Column<ContactoOut>[] = [
    {
      key: "nome",
      label: "Nome",
      render: (c) => <p className="font-semibold text-ink">{c.nome} {c.sobrenome || ""}</p>,
    },
    {
      key: "telefone",
      label: "Telefone",
      render: (c) => <span className="text-muted">{c.telefone || "-"}</span>,
    },
    {
      key: "correio_electronico",
      label: "Email",
      render: (c) => <span className="text-muted">{c.email || "-"}</span>,
    },
    {
      key: "actions",
      label: "Accoes",
      className: "w-24",
      render: (c) => (
        <div className="flex gap-1">
          <button onClick={() => { setEditContact(c); setFormOpen(true); }} className="p-2 rounded-lg text-muted hover:text-ink hover:bg-black/5 dark:hover:bg-white/5 transition" title="Editar">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={() => setDeleteTarget(c)} className="p-2 rounded-lg text-muted hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition" title="Eliminar">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ink mb-1">Contactos</h1>
          <p className="text-muted">{contacts.length} contacto(s) registado(s)</p>
        </div>
        <Button onClick={() => { setEditContact(null); setFormOpen(true); }} icon={<Plus className="h-4 w-4" />}>
          Novo Contacto
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Pesquisar por nome, sobrenome, email ou telefone..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-surface text-ink text-sm outline-none focus:border-brand-500" />
      </div>

      <DataTable columns={columns} data={filtered} keyExtractor={(c) => c.id_contacto} emptyMessage="Nenhum contacto encontrado" loading={loading} />

      <ContactFormModal open={formOpen} onClose={() => setFormOpen(false)} contact={editContact} onSaved={loadContacts} />

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Eliminar Contacto" message={`Tem a certeza que deseja eliminar "${deleteTarget?.nome}"?`} confirmLabel="Eliminar" />
    </div>
  );
}