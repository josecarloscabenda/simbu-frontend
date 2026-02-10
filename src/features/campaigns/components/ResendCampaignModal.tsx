"use client";

import { useState, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/button";
import Select from "@/components/ui/Select";
import Input from "@/components/ui/input";
import { useToast } from "@/components/ui/Toast";
import { campaignsService } from "@/services/campaigns.service";
import { groupsService } from "@/services/groups.service";
import { schedulesService } from "@/services/schedules.service";
import { Send, Clock } from "lucide-react";
import type { CampanhaOut, GrupoOut } from "@/types/database";

interface ResendCampaignModalProps {
  open: boolean;
  onClose: () => void;
  campaign: CampanhaOut | null;
  onSent: () => void;
}

export default function ResendCampaignModal({ open, onClose, campaign, onSent }: ResendCampaignModalProps) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [groups, setGroups] = useState<GrupoOut[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState("");
  const [sendMode, setSendMode] = useState<"now" | "schedule">("now");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  useEffect(() => {
    if (open) {
      groupsService.list().then(setGroups).catch(() => {});
      setSelectedGroupId("");
      setSendMode("now");
      setScheduleDate("");
      setScheduleTime("");
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!campaign || !selectedGroupId) return;
    setLoading(true);
    try {
      const groupId = parseInt(selectedGroupId);
      if (sendMode === "now") {
        await campaignsService.resend(campaign.id_campanha, groupId);
        toast("success", "Campanha reenviada!");
      } else {
        const dataHora = `${scheduleDate}T${scheduleTime}:00`;
        await schedulesService.create({
          id_campanha: campaign.id_campanha,
          id_grupo: groupId,
          data_hora: dataHora,
        });
        toast("success", "Reenvio agendado!");
      }
      onSent();
      onClose();
    } catch {
      toast("error", "Erro ao reenviar campanha");
    } finally {
      setLoading(false);
    }
  };

  const canSubmit = selectedGroupId && (sendMode === "now" || (scheduleDate && scheduleTime));

  return (
    <Modal open={open} onClose={onClose} title="Reenviar Campanha" size="md">
      {campaign && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-black/[0.02] dark:bg-white/[0.02]">
            <p className="text-sm font-semibold text-ink">{campaign.nome_campanha}</p>
            <p className="text-xs text-muted mt-1 line-clamp-2">{campaign.sms_texto}</p>
          </div>

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

          <div>
            <label className="block text-sm font-semibold text-ink mb-2">Modo de Envio</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setSendMode("now")}
                className={`p-3 rounded-xl border-2 text-center transition ${
                  sendMode === "now"
                    ? "border-brand-500 bg-brand-500/5"
                    : "border-black/10 dark:border-white/10"
                }`}
              >
                <Send className="h-5 w-5 mx-auto text-brand-500 mb-1" />
                <p className="text-sm font-semibold text-ink">Enviar Agora</p>
              </button>
              <button
                onClick={() => setSendMode("schedule")}
                className={`p-3 rounded-xl border-2 text-center transition ${
                  sendMode === "schedule"
                    ? "border-brand-500 bg-brand-500/5"
                    : "border-black/10 dark:border-white/10"
                }`}
              >
                <Clock className="h-5 w-5 mx-auto text-yellow-500 mb-1" />
                <p className="text-sm font-semibold text-ink">Agendar</p>
              </button>
            </div>
          </div>

          {sendMode === "schedule" && (
            <div className="grid grid-cols-2 gap-4">
              <Input label="Data" type="date" value={scheduleDate} onChange={(e) => setScheduleDate(e.target.value)} />
              <Input label="Hora" type="time" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} />
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={onClose} className="flex-1">Cancelar</Button>
            <Button onClick={handleSubmit} disabled={!canSubmit} loading={loading} className="flex-1">
              {sendMode === "now" ? "Reenviar Agora" : "Agendar Reenvio"}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}