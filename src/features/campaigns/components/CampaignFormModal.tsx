"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import TextArea from "@/components/ui/TextArea";
import Badge from "@/components/ui/Badge";
import { useToast } from "@/components/ui/Toast";
import { campaignsService } from "@/services/campaigns.service";
import { templatesService } from "@/services/templates.service";
import Select from "@/components/ui/Select";
import { smsSegments } from "@/lib/utils";
import type { CampanhaOut, TemplateOut } from "@/types/database";

interface CampaignFormModalProps {
  open: boolean;
  onClose: () => void;
  campaign?: CampanhaOut | null;
  onSaved: () => void;
}

export default function CampaignFormModal({ open, onClose, campaign, onSaved }: CampaignFormModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [nome, setNome] = useState("");
  const [smsTexto, setSmsTexto] = useState("");
  const [idTemplate, setIdTemplate] = useState("");
  const [templates, setTemplates] = useState<TemplateOut[]>([]);

  useEffect(() => {
    if (open) {
      templatesService.list().then(setTemplates).catch(() => {});
    }
  }, [open]);

  useEffect(() => {
    if (campaign) {
      setNome(campaign.nome_campanha || "");
      setSmsTexto(campaign.sms_texto || "");
      setIdTemplate(campaign.id_template?.toString() || "");
    } else {
      setNome("");
      setSmsTexto("");
      setIdTemplate("");
    }
  }, [campaign, open]);

  const handleTemplateSelect = (templateId: string) => {
    setIdTemplate(templateId);
    if (templateId) {
      const t = templates.find((t) => t.id_template.toString() === templateId);
      if (t) setSmsTexto(t.descricao || "");
    }
  };

  const handleSubmit = async () => {
    if (!campaign) return;
    if (!nome.trim()) {
      toast("error", "Nome e obrigatorio");
      return;
    }
    setLoading(true);
    try {
      await campaignsService.update(campaign.id_campanha, {
        sms_texto: smsTexto.trim(),
      });
      toast("success", "Campanha actualizada");
      onSaved();
      onClose();
    } catch {
      toast("error", "Erro ao actualizar campanha");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Editar Campanha"
      size="lg"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSubmit} loading={loading}>Guardar</Button>
        </>
      }
    >
      <div className="space-y-4">
        <Input label="Nome da Campanha *" value={nome} onChange={(e) => setNome(e.target.value)} />

        {campaign && (
          <div>
            <label className="block text-sm font-semibold text-ink mb-1.5">Canais</label>
            <div className="flex gap-2">
              {campaign.sms_ativo === 1 && <Badge variant="info">SMS</Badge>}
              {campaign.email_ativo === 1 && <Badge variant="info">Email</Badge>}
            </div>
          </div>
        )}

        <Select
          label="Template"
          value={idTemplate}
          onChange={handleTemplateSelect}
          options={templates.map((t) => ({ value: t.id_template.toString(), label: t.nome_template }))}
          placeholder="Seleccionar template..."
        />

        <div>
          <TextArea
            label="Mensagem SMS *"
            value={smsTexto}
            onChange={(e) => setSmsTexto(e.target.value)}
            rows={5}
            placeholder="Texto da mensagem..."
          />
          <p className="mt-1 text-xs text-muted">
            {smsTexto.length} caracteres | {smsSegments(smsTexto)} SMS
          </p>
        </div>
      </div>
    </Modal>
  );
}