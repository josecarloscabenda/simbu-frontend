"use client";

import { useState, useEffect, useCallback } from "react";
import DataTable, { type Column } from "@/components/ui/DataTable";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/Badge";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import GroupFormModal from "@/features/groups/components/GroupFormModal";
import GroupContactsModal from "@/features/groups/components/GroupContactsModal";
import { groupsService } from "@/services/groups.service";
import { Plus, Pencil, Trash2, UserPlus, Search } from "lucide-react";
import type { GrupoOut } from "@/types/database";

export default function GroupsPage() {
  const { toast } = useToast();
  const [groups, setGroups] = useState<GrupoOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editGroup, setEditGroup] = useState<GrupoOut | null>(null);
  const [contactsModalGroup, setContactsModalGroup] = useState<GrupoOut | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<GrupoOut | null>(null);

  const loadGroups = useCallback(async () => {
    try {
      const data = await groupsService.list();
      setGroups(data);
    } catch {
      toast("error", "Erro ao carregar grupos");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { loadGroups(); }, [loadGroups]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await groupsService.delete(deleteTarget.id_grupo);
      toast("success", "Grupo eliminado");
      setDeleteTarget(null);
      loadGroups();
    } catch {
      toast("error", "Erro ao eliminar grupo");
    }
  };

  const filtered = search
    ? groups.filter((g) => g.nome_grupo.toLowerCase().includes(search.toLowerCase()))
    : groups;

  const columns: Column<GrupoOut>[] = [
    {
      key: "nome",
      label: "Nome",
      render: (g) => (
        <div>
          <p className="font-semibold text-ink">{g.nome_grupo}</p>
          {g.descricao_grupo && <p className="text-xs text-muted mt-0.5">{g.descricao_grupo}</p>}
        </div>
      ),
    },
    {
      key: "id_grupo",
      label: "ID",
      render: (g) => <Badge variant="neutral">{g.id_grupo}</Badge>,
    },
    {
      key: "actions",
      label: "Accoes",
      className: "w-36",
      render: (g) => (
        <div className="flex gap-1">
          <button onClick={() => setContactsModalGroup(g)} className="p-2 rounded-lg text-muted hover:text-brand-600 hover:bg-brand-500/10 transition" title="Gerir Contactos">
            <UserPlus className="h-4 w-4" />
          </button>
          <button onClick={() => { setEditGroup(g); setFormOpen(true); }} className="p-2 rounded-lg text-muted hover:text-ink hover:bg-black/5 dark:hover:bg-white/5 transition" title="Editar">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={() => setDeleteTarget(g)} className="p-2 rounded-lg text-muted hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition" title="Eliminar">
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
          <h1 className="text-3xl font-bold text-ink mb-1">Grupos</h1>
          <p className="text-muted">{groups.length} grupo(s)</p>
        </div>
        <Button onClick={() => { setEditGroup(null); setFormOpen(true); }} icon={<Plus className="h-4 w-4" />}>
          Novo Grupo
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Pesquisar grupos..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-surface text-ink text-sm outline-none focus:border-brand-500" />
      </div>

      <DataTable columns={columns} data={filtered} keyExtractor={(g) => g.id_grupo} emptyMessage="Nenhum grupo encontrado" loading={loading} />

      <GroupFormModal open={formOpen} onClose={() => setFormOpen(false)} group={editGroup} onSaved={loadGroups} />
      <GroupContactsModal open={!!contactsModalGroup} onClose={() => setContactsModalGroup(null)} group={contactsModalGroup} onChanged={loadGroups} />

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Eliminar Grupo" message={`Tem a certeza que deseja eliminar o grupo "${deleteTarget?.nome_grupo}"?`} confirmLabel="Eliminar" />
    </div>
  );
}