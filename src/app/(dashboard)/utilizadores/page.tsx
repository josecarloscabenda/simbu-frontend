"use client";

import { useState, useEffect, useCallback } from "react";
import DataTable, { type Column } from "@/components/ui/DataTable";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/Badge";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import UserFormModal from "@/features/admin/components/UserFormModal";
import { adminService } from "@/services/admin.service";
import { useAuthStore } from "@/lib/auth.store";
import { formatDate } from "@/lib/utils";
import { Plus, Trash2, Search, ShieldCheck } from "lucide-react";
import type { UtilizadorOut, PermissaoOut } from "@/types/database";

export default function UtilizadoresPage() {
  const { toast } = useToast();
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState<UtilizadorOut[]>([]);
  const [permissions, setPermissions] = useState<PermissaoOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<UtilizadorOut | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [u, p] = await Promise.all([
        adminService.listUsers(),
        adminService.listPermissions(),
      ]);
      setUsers(u);
      setPermissions(p);
    } catch {
      toast("error", "Erro ao carregar utilizadores");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleDeactivate = async () => {
    if (!deleteTarget) return;
    try {
      await adminService.deactivateUser(deleteTarget.id_utilizador);
      toast("success", "Utilizador desactivado");
      setDeleteTarget(null);
      loadData();
    } catch {
      toast("error", "Erro ao desactivar utilizador");
    }
  };

  const filtered = search
    ? users.filter((u) => {
        const q = search.toLowerCase();
        return (
          u.utilizador.toLowerCase().includes(q) ||
          (u.nome_completo && u.nome_completo.toLowerCase().includes(q)) ||
          u.email.toLowerCase().includes(q)
        );
      })
    : users;

  const columns: Column<UtilizadorOut>[] = [
    {
      key: "utilizador",
      label: "Utilizador",
      render: (u) => (
        <div>
          <p className="font-semibold text-ink">{u.nome_completo || u.utilizador}</p>
          <p className="text-xs text-muted">@{u.utilizador}</p>
        </div>
      ),
    },
    {
      key: "email",
      label: "Email",
      render: (u) => <span className="text-muted">{u.email}</span>,
    },
    {
      key: "permissao",
      label: "Permissao",
      render: (u) => (
        <Badge variant={u.permissao_nome?.toUpperCase() === "ADMIN" ? "default" : "neutral"}>
          {u.permissao_nome || "-"}
        </Badge>
      ),
    },
    {
      key: "activo",
      label: "Estado",
      render: (u) => (
        <Badge variant={u.activo === 1 ? "success" : "danger"}>
          {u.activo === 1 ? "Activo" : "Inactivo"}
        </Badge>
      ),
    },
    {
      key: "data_criacao",
      label: "Criado em",
      render: (u) => <span className="text-muted">{u.data_criacao ? formatDate(u.data_criacao) : "-"}</span>,
    },
    {
      key: "actions",
      label: "Accoes",
      className: "w-20",
      render: (u) => {
        const isSelf = currentUser?.id_utilizador === u.id_utilizador;
        const isRoot = u.utilizador === "root" || u.utilizador === "admin";
        if (isSelf || isRoot) return <span />;
        return (
          <button
            onClick={() => setDeleteTarget(u)}
            className="p-2 rounded-lg text-muted hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition"
            title="Desactivar"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        );
      },
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="h-6 w-6 text-brand-500" />
            <h1 className="text-3xl font-bold text-ink">Utilizadores</h1>
          </div>
          <p className="text-muted">{users.length} utilizador(es) registado(s)</p>
        </div>
        <Button onClick={() => setFormOpen(true)} icon={<Plus className="h-4 w-4" />}>
          Novo Utilizador
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Pesquisar utilizadores..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-surface text-ink text-sm outline-none focus:border-brand-500"
        />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        keyExtractor={(u) => u.id_utilizador}
        emptyMessage="Nenhum utilizador encontrado"
        loading={loading}
      />

      <UserFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSaved={loadData}
        permissions={permissions}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeactivate}
        title="Desactivar Utilizador"
        message={`Tem a certeza que deseja desactivar "${deleteTarget?.nome_completo || deleteTarget?.utilizador}"? O utilizador ficara inactivo mas nao sera apagado.`}
        confirmLabel="Desactivar"
      />
    </div>
  );
}
