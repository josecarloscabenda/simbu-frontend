"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { useToast } from "@/components/ui/Toast";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { templateCategoriesService } from "@/services/templateCategories.service";
import { Plus, Pencil, Trash2, Check, X } from "lucide-react";
import type { TemplateCategoriaOut } from "@/types/database";

interface CategoryManagerModalProps {
  open: boolean;
  onClose: () => void;
  onChanged: () => void;
}

export default function CategoryManagerModal({ open, onClose, onChanged }: CategoryManagerModalProps) {
  const { toast } = useToast();
  const [categories, setCategories] = useState<TemplateCategoriaOut[]>([]);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editName, setEditName] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<TemplateCategoriaOut | null>(null);
  const [loading, setLoading] = useState(false);

  const loadCategories = async () => {
    try {
      const data = await templateCategoriesService.list();
      setCategories(data);
    } catch {
      toast("error", "Erro ao carregar categorias");
    }
  };

  useEffect(() => {
    if (open) loadCategories();
  }, [open]);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setLoading(true);
    try {
      await templateCategoriesService.create({ nome_categoria: newName.trim() });
      setNewName("");
      toast("success", "Categoria criada");
      await loadCategories();
      onChanged();
    } catch {
      toast("error", "Erro ao criar categoria");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (id: number) => {
    if (!editName.trim()) return;
    try {
      await templateCategoriesService.update(id, { nome_categoria: editName.trim() });
      setEditingId(null);
      toast("success", "Categoria actualizada");
      await loadCategories();
      onChanged();
    } catch {
      toast("error", "Erro ao actualizar categoria");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await templateCategoriesService.delete(deleteTarget.id_categoria);
      toast("success", "Categoria eliminada");
      setDeleteTarget(null);
      await loadCategories();
      onChanged();
    } catch {
      toast("error", "Erro ao eliminar categoria");
    }
  };

  return (
    <>
      <Modal open={open} onClose={onClose} title="Gerir Categorias" size="md">
        {/* Add new */}
        <div className="flex gap-2 mb-4">
          <Input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Nova categoria..."
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          />
          <Button onClick={handleCreate} loading={loading} icon={<Plus className="h-4 w-4" />} size="md">
            Adicionar
          </Button>
        </div>

        {/* List */}
        <div className="space-y-1 max-h-80 overflow-y-auto">
          {categories.map((cat) => (
            <div key={cat.id_categoria} className="flex items-center gap-2 px-3 py-2.5 rounded-xl hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
              {editingId === cat.id_categoria ? (
                <>
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 px-2 py-1 rounded-lg border border-black/10 dark:border-white/10 text-sm bg-surface text-ink outline-none"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && handleUpdate(cat.id_categoria)}
                  />
                  <button onClick={() => handleUpdate(cat.id_categoria)} className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20">
                    <Check className="h-4 w-4" />
                  </button>
                  <button onClick={() => setEditingId(null)} className="p-1.5 rounded-lg text-muted hover:bg-black/5 dark:hover:bg-white/5">
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <>
                  <span className="flex-1 text-sm text-ink font-medium">{cat.nome_categoria}</span>
                  <button
                    onClick={() => { setEditingId(cat.id_categoria); setEditName(cat.nome_categoria); }}
                    className="p-1.5 rounded-lg text-muted hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleteTarget(cat)}
                    className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </>
              )}
            </div>
          ))}
          {categories.length === 0 && (
            <p className="text-center text-muted py-8 text-sm">Nenhuma categoria criada</p>
          )}
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Eliminar Categoria"
        message={`Tem a certeza que deseja eliminar a categoria "${deleteTarget?.nome_categoria}"?`}
        confirmLabel="Eliminar"
      />
    </>
  );
}