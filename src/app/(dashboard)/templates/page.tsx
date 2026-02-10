"use client";

import { useState, useEffect, useCallback } from "react";
import DataTable, { type Column } from "@/components/ui/DataTable";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/Badge";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { useToast } from "@/components/ui/Toast";
import TemplateFormModal from "@/features/templates/components/TemplateFormModal";
import CategoryManagerModal from "@/features/templates/components/CategoryManagerModal";
import { templatesService } from "@/services/templates.service";
import { templateCategoriesService } from "@/services/templateCategories.service";
import { Plus, Pencil, Trash2, Search, Tags } from "lucide-react";
import { smsSegments } from "@/lib/utils";
import type { TemplateOut, TemplateCategoriaOut } from "@/types/database";

export default function TemplatesPage() {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<TemplateOut[]>([]);
  const [categories, setCategories] = useState<TemplateCategoriaOut[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editTemplate, setEditTemplate] = useState<TemplateOut | null>(null);
  const [categoryManagerOpen, setCategoryManagerOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<TemplateOut | null>(null);

  const loadData = useCallback(async () => {
    try {
      const [t, c] = await Promise.all([
        templatesService.list(),
        templateCategoriesService.list(),
      ]);
      setTemplates(t);
      setCategories(c);
    } catch {
      toast("error", "Erro ao carregar templates");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await templatesService.delete(deleteTarget.id_template);
      toast("success", "Template eliminado");
      setDeleteTarget(null);
      loadData();
    } catch {
      toast("error", "Erro ao eliminar template");
    }
  };

  let filtered = templates;
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter((t) => t.nome_template.toLowerCase().includes(q) || (t.descricao && t.descricao.toLowerCase().includes(q)));
  }
  if (filterCategory) {
    filtered = filtered.filter((t) => t.categoria === filterCategory);
  }

  const columns: Column<TemplateOut>[] = [
    {
      key: "nome",
      label: "Template",
      render: (t) => (
        <div>
          <p className="font-semibold text-ink">{t.nome_template}</p>
          <p className="text-xs text-muted truncate max-w-xs mt-0.5">{t.descricao}</p>
        </div>
      ),
    },
    {
      key: "categoria_nome",
      label: "Categoria",
      render: (t) => t.categoria_nome ? <Badge variant="default">{t.categoria_nome}</Badge> : <span className="text-muted">-</span>,
    },
    {
      key: "sms",
      label: "SMS",
      render: (t) => <span className="text-muted">{smsSegments(t.descricao || "")}</span>,
    },
    {
      key: "actions",
      label: "Accoes",
      className: "w-24",
      render: (t) => (
        <div className="flex gap-1">
          <button onClick={() => { setEditTemplate(t); setFormOpen(true); }} className="p-2 rounded-lg text-muted hover:text-ink hover:bg-black/5 dark:hover:bg-white/5 transition" title="Editar">
            <Pencil className="h-4 w-4" />
          </button>
          <button onClick={() => setDeleteTarget(t)} className="p-2 rounded-lg text-muted hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition" title="Eliminar">
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
          <h1 className="text-3xl font-bold text-ink mb-1">Templates</h1>
          <p className="text-muted">{templates.length} template(s)</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" onClick={() => setCategoryManagerOpen(true)} icon={<Tags className="h-4 w-4" />}>
            Categorias
          </Button>
          <Button onClick={() => { setEditTemplate(null); setFormOpen(true); }} icon={<Plus className="h-4 w-4" />}>
            Novo Template
          </Button>
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Pesquisar templates..." className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-surface text-ink text-sm outline-none focus:border-brand-500" />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-surface text-ink text-sm outline-none"
        >
          <option value="">Todas as categorias</option>
          {categories.map((c) => (
            <option key={c.id_categoria} value={c.nome_categoria}>{c.nome_categoria}</option>
          ))}
        </select>
      </div>

      <DataTable columns={columns} data={filtered} keyExtractor={(t) => t.id_template} emptyMessage="Nenhum template encontrado" loading={loading} />

      <TemplateFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        template={editTemplate}
        onSaved={loadData}
        onOpenCategoryManager={() => setCategoryManagerOpen(true)}
      />

      <CategoryManagerModal open={categoryManagerOpen} onClose={() => setCategoryManagerOpen(false)} onChanged={loadData} />

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete} title="Eliminar Template" message={`Tem a certeza que deseja eliminar "${deleteTarget?.nome_template}"?`} confirmLabel="Eliminar" />
    </div>
  );
}