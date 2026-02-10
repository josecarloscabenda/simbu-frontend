"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import TextArea from "@/components/ui/TextArea";
import Select from "@/components/ui/Select";
import { useToast } from "@/components/ui/Toast";
import { templatesService } from "@/services/templates.service";
import { templateCategoriesService } from "@/services/templateCategories.service";
import { smsSegments } from "@/lib/utils";
import { Plus, Info } from "lucide-react";
import type { TemplateOut, TemplateCategoriaOut } from "@/types/database";

interface TemplateFormModalProps {
  open: boolean;
  onClose: () => void;
  template?: TemplateOut | null;
  onSaved: () => void;
  onOpenCategoryManager: () => void;
}

const variables = [
  "{nome}", "{sobrenome}", "{telefone}", "{email}", "{nif}",
  "{designacao}", "{localizacao}", "{sector_actividade}",
  "{montante_desejado}", "{data}",
];

export default function TemplateFormModal({ open, onClose, template, onSaved, onOpenCategoryManager }: TemplateFormModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [nome, setNome] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [idCategoria, setIdCategoria] = useState("");
  const [categories, setCategories] = useState<TemplateCategoriaOut[]>([]);

  useEffect(() => {
    if (open) {
      templateCategoriesService.list().then(setCategories).catch(() => {});
    }
  }, [open]);

  useEffect(() => {
    if (template) {
      setNome(template.nome_template || "");
      setConteudo(template.descricao || "");
      setIdCategoria(template.categoria || "");
    } else {
      setNome("");
      setConteudo("");
      setIdCategoria("");
    }
  }, [template, open]);

  const insertVariable = (v: string) => {
    setConteudo((prev) => prev + v);
  };

  const segments = smsSegments(conteudo);

  const handleSubmit = async () => {
    if (!nome.trim() || !conteudo.trim()) {
      toast("error", "Nome e conteudo sao obrigatorios");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        nome: nome.trim(),
        descricao: conteudo.trim(),
        categoria: idCategoria || "",
      };
      if (template) {
        await templatesService.update(template.id_template, payload);
        toast("success", "Template actualizado");
      } else {
        await templatesService.create(payload);
        toast("success", "Template criado");
      }
      onSaved();
      onClose();
    } catch {
      toast("error", "Erro ao guardar template");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={template ? "Editar Template" : "Novo Template"}
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit} loading={loading}>
            {template ? "Guardar" : "Criar Template"}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input label="Nome do Template *" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Boas-vindas" />

        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <label className="text-sm font-semibold text-ink">Categoria</label>
            <button
              type="button"
              onClick={onOpenCategoryManager}
              className="p-1 rounded-lg text-brand-500 hover:bg-brand-500/10 transition"
              title="Gerir categorias"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
          <Select
            value={idCategoria}
            onChange={setIdCategoria}
            options={categories.map((c) => ({ value: c.nome_categoria, label: c.nome_categoria }))}
            placeholder="Seleccionar categoria..."
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-ink mb-1.5">Conteudo da Mensagem *</label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {variables.map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => insertVariable(v)}
                className="px-2 py-1 text-xs font-mono rounded-lg bg-brand-500/10 text-brand-700 dark:text-brand-400 hover:bg-brand-500/20 transition"
              >
                {v}
              </button>
            ))}
          </div>
          <TextArea
            value={conteudo}
            onChange={(e) => setConteudo(e.target.value)}
            placeholder="Escreva a mensagem do template..."
            rows={5}
          />
          <div className="mt-1.5 flex items-center justify-between text-xs text-muted">
            <div className="flex items-center gap-1.5">
              <span>{conteudo.length} caracteres</span>
              <span className="text-black/20 dark:text-white/20">|</span>
              <span className="flex items-center gap-1">
                {segments} SMS necessario(s)
                <span className="relative group">
                  <Info className="h-3 w-3 text-muted cursor-help" />
                  <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 w-48 px-2 py-1 bg-ink text-surface text-xs rounded-lg opacity-0 group-hover:opacity-100 transition pointer-events-none text-center">
                    Mensagens com mais de 160 caracteres sao divididas em segmentos de 153 caracteres
                  </span>
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}