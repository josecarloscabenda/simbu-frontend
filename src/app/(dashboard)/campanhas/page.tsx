"use client";

import { useState, useEffect, useCallback } from "react";
import DataTable, { type Column } from "@/components/ui/DataTable";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/Badge";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import CampaignWizardModal from "@/features/campaigns/components/CampaignWizardModal";
import CampaignFormModal from "@/features/campaigns/components/CampaignFormModal";
import ResendCampaignModal from "@/features/campaigns/components/ResendCampaignModal";
import { campaignsService } from "@/services/campaigns.service";
import { Plus, Pencil, Trash2, RefreshCw, Search } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { CampanhaOut } from "@/types/database";

export default function CampaignsPage() {
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<CampanhaOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [wizardOpen, setWizardOpen] = useState(false);
  const [editCampaign, setEditCampaign] = useState<CampanhaOut | null>(null);
  const [resendCampaign, setResendCampaign] = useState<CampanhaOut | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<CampanhaOut | null>(null);

  const loadCampaigns = useCallback(async () => {
    try {
      const data = await campaignsService.list();
      setCampaigns(data);
    } catch {
      toast("error", "Erro ao carregar campanhas");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { loadCampaigns(); }, [loadCampaigns]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await campaignsService.delete(deleteTarget.id_campanha);
      toast("success", "Campanha eliminada");
      setDeleteTarget(null);
      loadCampaigns();
    } catch {
      toast("error", "Erro ao eliminar campanha");
    }
  };

  const filtered = search
    ? campaigns.filter((c) => c.nome_campanha.toLowerCase().includes(search.toLowerCase()))
    : campaigns;

  const columns: Column<CampanhaOut>[] = [
    {
      key: "nome_campanha",
      label: "Campanha",
      render: (c) => (
        <div>
          <p className="font-semibold text-ink">{c.nome_campanha}</p>
          <p className="text-xs text-muted truncate max-w-xs">{c.sms_texto}</p>
        </div>
      ),
    },
    {
      key: "canais",
      label: "Canais",
      render: (c) => (
        <div className="flex gap-1">
          {c.sms_ativo === 1 && <Badge variant="info">SMS</Badge>}
          {c.email_ativo === 1 && <Badge variant="info">Email</Badge>}
        </div>
      ),
    },
    {
      key: "data_criacao",
      label: "Data",
      render: (c) => <span className="text-muted">{formatDate(c.data_criacao)}</span>,
    },
    {
      key: "actions",
      label: "Accoes",
      className: "w-36",
      render: (c) => (
        <div className="flex gap-1">
          <button onClick={() => setResendCampaign(c)} className="p-2 rounded-lg text-muted hover:text-brand-600 hover:bg-brand-500/10 transition" title="Reenviar">
            <RefreshCw className="h-4 w-4" />
          </button>
          <button onClick={() => setEditCampaign(c)} className="p-2 rounded-lg text-muted hover:text-ink hover:bg-black/5 dark:hover:bg-white/5 transition" title="Editar">
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
          <h1 className="text-3xl font-bold text-ink mb-1">Campanhas</h1>
          <p className="text-muted">{campaigns.length} campanha(s)</p>
        </div>
        <Button onClick={() => setWizardOpen(true)} icon={<Plus className="h-4 w-4" />}>
          Nova Campanha
        </Button>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Pesquisar campanhas..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-surface text-ink text-sm outline-none focus:border-brand-500" />
      </div>

      <DataTable columns={columns} data={filtered} keyExtractor={(c) => c.id_campanha} emptyMessage="Nenhuma campanha encontrada" loading={loading} />

      <CampaignWizardModal open={wizardOpen} onClose={() => setWizardOpen(false)} onSaved={loadCampaigns} />
      <CampaignFormModal open={!!editCampaign} onClose={() => setEditCampaign(null)} campaign={editCampaign} onSaved={loadCampaigns} />
      <ResendCampaignModal open={!!resendCampaign} onClose={() => setResendCampaign(null)} campaign={resendCampaign} onSent={loadCampaigns} />

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Eliminar Campanha" message={`Tem a certeza que deseja eliminar "${deleteTarget?.nome_campanha}"?`} confirmLabel="Eliminar" />
    </div>
  );
}