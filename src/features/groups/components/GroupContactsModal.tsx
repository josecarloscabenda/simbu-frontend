"use client";

import { useState, useEffect, useCallback } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/button";
import Tabs from "@/components/ui/Tabs";
import { useToast } from "@/components/ui/Toast";
import { groupsService } from "@/services/groups.service";
import { contactsService } from "@/services/contacts.service";
import { Search, UserMinus, UserPlus } from "lucide-react";
import type { GrupoOut, ContactoOut } from "@/types/database";

interface GroupContactsModalProps {
  open: boolean;
  onClose: () => void;
  group: GrupoOut | null;
  onChanged: () => void;
}

export default function GroupContactsModal({ open, onClose, group, onChanged }: GroupContactsModalProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("membros");
  const [groupContacts, setGroupContacts] = useState<ContactoOut[]>([]);
  const [allContacts, setAllContacts] = useState<ContactoOut[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async () => {
    if (!group) return;
    try {
      const [gc, all] = await Promise.all([
        groupsService.getContacts(group.id_grupo),
        contactsService.list(),
      ]);
      setGroupContacts(gc);
      setAllContacts(all);
    } catch {
      toast("error", "Erro ao carregar contactos");
    }
  }, [group, toast]);

  useEffect(() => {
    if (open && group) {
      loadData();
      setSelected(new Set());
      setSearch("");
      setActiveTab("membros");
    }
  }, [open, group, loadData]);

  const groupContactIds = new Set(groupContacts.map((c) => c.id_contacto));
  const availableContacts = allContacts.filter((c) => !groupContactIds.has(c.id_contacto));

  const filterContacts = (contacts: ContactoOut[]) => {
    if (!search) return contacts;
    const q = search.toLowerCase();
    return contacts.filter(
      (c) =>
        c.nome.toLowerCase().includes(q) ||
        (c.sobrenome && c.sobrenome.toLowerCase().includes(q)) ||
        (c.email && c.email.toLowerCase().includes(q)) ||
        (c.telefone && c.telefone.includes(q))
    );
  };

  const handleRemove = async (contactId: number) => {
    if (!group) return;
    try {
      await groupsService.unlinkContact(group.id_grupo, contactId);
      toast("success", "Contacto removido do grupo");
      await loadData();
      onChanged();
    } catch {
      toast("error", "Erro ao remover contacto");
    }
  };

  const handleAddSelected = async () => {
    if (!group || selected.size === 0) return;
    setLoading(true);
    try {
      await groupsService.linkMultiple(group.id_grupo, Array.from(selected));
      toast("success", `${selected.size} contacto(s) adicionado(s)`);
      setSelected(new Set());
      await loadData();
      onChanged();
    } catch {
      toast("error", "Erro ao adicionar contactos");
    } finally {
      setLoading(false);
    }
  };

  const toggleSelect = (id: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const tabs = [
    { key: "membros", label: "Contactos do Grupo", badge: groupContacts.length },
    { key: "adicionar", label: "Adicionar Contactos", badge: availableContacts.length },
  ];

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`Gerir Contactos - ${group?.nome_grupo || ""}`}
      size="xl"
    >
      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="mt-4">
        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar contactos..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-surface text-ink text-sm outline-none focus:border-brand-500"
          />
        </div>

        {activeTab === "membros" && (
          <div className="space-y-1 max-h-80 overflow-y-auto">
            {filterContacts(groupContacts).length === 0 ? (
              <p className="text-center text-muted py-8 text-sm">Nenhum contacto neste grupo</p>
            ) : (
              filterContacts(groupContacts).map((c) => (
                <div key={c.id_contacto} className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                  <div>
                    <p className="text-sm font-semibold text-ink">{c.nome} {c.sobrenome || ""}</p>
                    <p className="text-xs text-muted">{c.telefone || c.email || "Sem contacto"}</p>
                  </div>
                  <button
                    onClick={() => handleRemove(c.id_contacto)}
                    className="p-2 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                    title="Remover do grupo"
                  >
                    <UserMinus className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "adicionar" && (
          <>
            <div className="space-y-1 max-h-64 overflow-y-auto mb-4">
              {filterContacts(availableContacts).length === 0 ? (
                <p className="text-center text-muted py-8 text-sm">Nenhum contacto disponivel</p>
              ) : (
                filterContacts(availableContacts).map((c) => (
                  <label key={c.id_contacto} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-black/[0.02] dark:hover:bg-white/[0.02] cursor-pointer">
                    <input
                      type="checkbox"
                      checked={selected.has(c.id_contacto)}
                      onChange={() => toggleSelect(c.id_contacto)}
                      className="rounded border-black/20 dark:border-white/20 text-brand-500 focus:ring-brand-500"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-ink">{c.nome} {c.sobrenome || ""}</p>
                      <p className="text-xs text-muted">{c.telefone || c.email || "Sem contacto"}</p>
                    </div>
                  </label>
                ))
              )}
            </div>
            {selected.size > 0 && (
              <Button onClick={handleAddSelected} loading={loading} icon={<UserPlus className="h-4 w-4" />}>
                Adicionar {selected.size} Seleccionado(s)
              </Button>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}