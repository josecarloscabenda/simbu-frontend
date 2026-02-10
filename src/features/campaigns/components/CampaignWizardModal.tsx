"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import TextArea from "@/components/ui/TextArea";
import Select from "@/components/ui/Select";
import Stepper from "@/components/ui/Stepper";
import { useToast } from "@/components/ui/Toast";
import { campaignsService } from "@/services/campaigns.service";
import { templatesService } from "@/services/templates.service";
import { groupsService } from "@/services/groups.service";
import { schedulesService } from "@/services/schedules.service";
import { smsSegments } from "@/lib/utils";
import { Plus, Copy, Clock, Send, Save } from "lucide-react";
import type { CampanhaOut, TemplateOut, GrupoOut, CampaignPreview } from "@/types/database";

interface CampaignWizardModalProps {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

const steps = [
  { label: "Tipo" },
  { label: "Detalhes" },
  { label: "Destinatarios" },
  { label: "Envio" },
];

type SendMode = "draft" | "now" | "schedule";

export default function CampaignWizardModal({ open, onClose, onSaved }: CampaignWizardModalProps) {
  const { toast } = useToast();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);

  // Step 1
  const [mode, setMode] = useState<"new" | "reuse">("new");
  const [existingCampaigns, setExistingCampaigns] = useState<CampanhaOut[]>([]);
  const [selectedCampaignId, setSelectedCampaignId] = useState("");
  const [campaignSearch, setCampaignSearch] = useState("");

  // Step 2
  const [nome, setNome] = useState("");
  const [smsTexto, setSmsTexto] = useState("");
  const [idTemplate, setIdTemplate] = useState("");
  const [templates, setTemplates] = useState<TemplateOut[]>([]);

  // Step 3
  const [groups, setGroups] = useState<GrupoOut[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [preview, setPreview] = useState<CampaignPreview | null>(null);

  // Step 4
  const [sendMode, setSendMode] = useState<SendMode>("now");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  useEffect(() => {
    if (open) {
      setStep(0);
      setMode("new");
      setNome("");
      setSmsTexto("");
      setIdTemplate("");
      setSelectedGroupId("");
      setSelectedCampaignId("");
      setCampaignSearch("");
      setPreview(null);
      setSendMode("now");
      setScheduleDate("");
      setScheduleTime("");

      Promise.all([
        campaignsService.list().then(setExistingCampaigns).catch(() => {}),
        templatesService.list().then(setTemplates).catch(() => {}),
        groupsService.list().then(setGroups).catch(() => {}),
      ]);
    }
  }, [open]);

  const handleReuseCampaign = (id: string) => {
    setSelectedCampaignId(id);
    const c = existingCampaigns.find((c) => c.id_campanha.toString() === id);
    if (c) {
      setNome(c.nome_campanha);
      setSmsTexto(c.sms_texto);
      setIdTemplate(c.id_template?.toString() || "");
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    setIdTemplate(templateId);
    if (templateId) {
      const t = templates.find((t) => t.id_template.toString() === templateId);
      if (t) setSmsTexto(t.descricao || "");
    }
  };

  const canProceed = () => {
    switch (step) {
      case 0: return mode === "new" || !!selectedCampaignId;
      case 1: return nome.trim() && smsTexto.trim();
      case 2: return !!selectedGroupId;
      case 3: return sendMode === "draft" || sendMode === "now" || (scheduleDate && scheduleTime);
      default: return false;
    }
  };

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
      // Load preview when entering step 3 (if we have a campaign to preview)
      return;
    }
    // Final submit
    await handleSubmit();
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // 1. Create campaign
      const campaign = await campaignsService.create({
        nome: nome.trim(),
        texto: smsTexto.trim(),
        to: [],
        id_template: idTemplate ? parseInt(idTemplate) : null,
        send_now: sendMode === "now",
      });

      const groupId = parseInt(selectedGroupId);

      if (sendMode === "now") {
        await campaignsService.sendToGroup(campaign.id_campanha, groupId);
        toast("success", "Campanha enviada com sucesso!");
      } else if (sendMode === "schedule") {
        const dataHora = `${scheduleDate}T${scheduleTime}:00`;
        await schedulesService.create({
          id_campanha: campaign.id_campanha,
          id_grupo: groupId,
          data_hora: dataHora,
        });
        toast("success", "Campanha agendada com sucesso!");
      } else {
        toast("success", "Campanha guardada como rascunho!");
      }

      onSaved();
      onClose();
    } catch {
      toast("error", "Erro ao criar campanha");
    } finally {
      setLoading(false);
    }
  };

  const selectedGroup = groups.find((g) => g.id_grupo.toString() === selectedGroupId);
  const filteredCampaigns = campaignSearch
    ? existingCampaigns.filter((c) => c.nome_campanha.toLowerCase().includes(campaignSearch.toLowerCase()))
    : existingCampaigns;

  return (
    <Modal open={open} onClose={onClose} title="Nova Campanha" size="2xl">
      <div className="mb-6">
        <Stepper steps={steps} currentStep={step} />
      </div>

      {/* Step 1: Type */}
      {step === 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => { setMode("new"); setSelectedCampaignId(""); }}
              className={`p-6 rounded-2xl border-2 text-left transition ${
                mode === "new"
                  ? "border-brand-500 bg-brand-500/5"
                  : "border-black/10 dark:border-white/10 hover:border-brand-500/50"
              }`}
            >
              <Plus className="h-8 w-8 text-brand-500 mb-3" />
              <h3 className="font-bold text-ink">Criar Nova</h3>
              <p className="text-sm text-muted mt-1">Comecar uma campanha do zero</p>
            </button>
            <button
              onClick={() => setMode("reuse")}
              className={`p-6 rounded-2xl border-2 text-left transition ${
                mode === "reuse"
                  ? "border-brand-500 bg-brand-500/5"
                  : "border-black/10 dark:border-white/10 hover:border-brand-500/50"
              }`}
            >
              <Copy className="h-8 w-8 text-brand-500 mb-3" />
              <h3 className="font-bold text-ink">Reutilizar Existente</h3>
              <p className="text-sm text-muted mt-1">Copiar dados de uma campanha anterior</p>
            </button>
          </div>

          {mode === "reuse" && (
            <div className="mt-4">
              <Input
                value={campaignSearch}
                onChange={(e) => setCampaignSearch(e.target.value)}
                placeholder="Pesquisar campanhas..."
              />
              <div className="mt-2 max-h-48 overflow-y-auto space-y-1">
                {filteredCampaigns.map((c) => (
                  <button
                    key={c.id_campanha}
                    onClick={() => handleReuseCampaign(c.id_campanha.toString())}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm transition ${
                      selectedCampaignId === c.id_campanha.toString()
                        ? "bg-brand-500/10 border border-brand-500"
                        : "hover:bg-black/[0.02] dark:hover:bg-white/[0.02] border border-transparent"
                    }`}
                  >
                    <p className="font-semibold text-ink">{c.nome_campanha}</p>
                    <p className="text-muted text-xs mt-0.5 truncate">{c.sms_texto}</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 2: Details */}
      {step === 1 && (
        <div className="space-y-4">
          <Input label="Nome da Campanha *" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Promocao Verao 2026" />

          <Select
            label="Template"
            value={idTemplate}
            onChange={handleTemplateSelect}
            options={templates.map((t) => ({ value: t.id_template.toString(), label: t.nome_template }))}
            placeholder="Seleccionar template (opcional)..."
          />

          <div>
            <TextArea
              label="Mensagem SMS *"
              value={smsTexto}
              onChange={(e) => setSmsTexto(e.target.value)}
              rows={4}
              placeholder="Escreva a mensagem..."
            />
            <p className="mt-1 text-xs text-muted">{smsTexto.length} caracteres | {smsSegments(smsTexto)} SMS</p>
          </div>
        </div>
      )}

      {/* Step 3: Recipients */}
      {step === 2 && (
        <div className="space-y-4">
          <Select
            label="Grupo de Destinatarios *"
            value={selectedGroupId}
            onChange={setSelectedGroupId}
            options={groups.map((g) => ({
              value: g.id_grupo.toString(),
              label: g.nome_grupo,
            }))}
            placeholder="Seleccionar grupo..."
          />

          {selectedGroup && (
            <div className="p-4 rounded-xl bg-brand-500/5 border border-brand-500/20">
              <p className="text-sm font-semibold text-ink">
                {selectedGroup.nome_grupo}
              </p>
              {selectedGroup.descricao_grupo && (
                <p className="text-sm text-muted mt-1">{selectedGroup.descricao_grupo}</p>
              )}
            </div>
          )}

          {preview && preview.mensagens.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-ink mb-2">Pre-visualizacao</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {preview.mensagens.slice(0, 5).map((m, i) => (
                  <div key={i} className="p-3 rounded-xl bg-black/[0.02] dark:bg-white/[0.02]">
                    <p className="text-xs text-muted mb-1">{m.contacto}</p>
                    <p className="text-sm text-ink">{m.mensagem}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 4: Send */}
      {step === 3 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => setSendMode("draft")}
              className={`p-4 rounded-2xl border-2 text-center transition ${
                sendMode === "draft"
                  ? "border-brand-500 bg-brand-500/5"
                  : "border-black/10 dark:border-white/10 hover:border-brand-500/50"
              }`}
            >
              <Save className="h-6 w-6 mx-auto text-muted mb-2" />
              <p className="text-sm font-semibold text-ink">Rascunho</p>
              <p className="text-xs text-muted mt-1">Guardar para depois</p>
            </button>
            <button
              onClick={() => setSendMode("now")}
              className={`p-4 rounded-2xl border-2 text-center transition ${
                sendMode === "now"
                  ? "border-brand-500 bg-brand-500/5"
                  : "border-black/10 dark:border-white/10 hover:border-brand-500/50"
              }`}
            >
              <Send className="h-6 w-6 mx-auto text-brand-500 mb-2" />
              <p className="text-sm font-semibold text-ink">Enviar Agora</p>
              <p className="text-xs text-muted mt-1">Enviar imediatamente</p>
            </button>
            <button
              onClick={() => setSendMode("schedule")}
              className={`p-4 rounded-2xl border-2 text-center transition ${
                sendMode === "schedule"
                  ? "border-brand-500 bg-brand-500/5"
                  : "border-black/10 dark:border-white/10 hover:border-brand-500/50"
              }`}
            >
              <Clock className="h-6 w-6 mx-auto text-yellow-500 mb-2" />
              <p className="text-sm font-semibold text-ink">Agendar</p>
              <p className="text-xs text-muted mt-1">Escolher data e hora</p>
            </button>
          </div>

          {sendMode === "schedule" && (
            <div className="grid grid-cols-2 gap-4">
              <Input label="Data" type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} />
              <Input label="Hora" type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} />
            </div>
          )}

          {/* Summary */}
          <div className="p-4 rounded-xl bg-black/[0.02] dark:bg-white/[0.02] space-y-2">
            <h4 className="text-sm font-semibold text-ink">Resumo</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-muted">Campanha:</span>
              <span className="text-ink font-medium">{nome}</span>
              <span className="text-muted">Mensagem:</span>
              <span className="text-ink font-medium truncate">{smsTexto.substring(0, 50)}...</span>
              <span className="text-muted">Grupo:</span>
              <span className="text-ink font-medium">{selectedGroup?.nome_grupo || "-"}</span>
              <span className="text-muted">Envio:</span>
              <span className="text-ink font-medium">
                {sendMode === "draft" ? "Rascunho" : sendMode === "now" ? "Imediato" : `${scheduleDate} ${scheduleTime}`}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-6 pt-4 border-t border-black/5 dark:border-white/10">
        <Button variant="secondary" onClick={step === 0 ? onClose : () => setStep(step - 1)}>
          {step === 0 ? "Cancelar" : "Voltar"}
        </Button>
        <Button onClick={handleNext} disabled={!canProceed()} loading={loading}>
          {step === 3
            ? sendMode === "draft"
              ? "Guardar Rascunho"
              : sendMode === "now"
              ? "Enviar Agora"
              : "Agendar Campanha"
            : "Seguinte"}
        </Button>
      </div>
    </Modal>
  );
}