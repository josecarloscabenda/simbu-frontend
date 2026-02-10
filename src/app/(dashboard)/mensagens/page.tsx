"use client";

import { useState, useEffect, useCallback } from "react";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/button";
import { useToast } from "@/components/ui/Toast";
import { mensagensService } from "@/services/mensagens.service";
import { campaignsService } from "@/services/campaigns.service";
import { contactsService } from "@/services/contacts.service";
import { formatDate } from "@/lib/utils";
import { Search, ChevronLeft, ChevronRight, MessageSquare, Eye } from "lucide-react";
import type { MensagemSMSOut, MensagemSMSPaginatedOut, CampanhaOut, ContactoOut } from "@/types/database";

const STATUS_MAP: Record<string, { label: string; variant: "success" | "warning" | "danger" | "info" | "neutral" }> = {
  pending: { label: "Pendente", variant: "warning" },
  sent: { label: "Enviado", variant: "info" },
  delivered: { label: "Entregue", variant: "success" },
  failed: { label: "Falhou", variant: "danger" },
};

const PER_PAGE = 20;

export default function MensagensPage() {
  const { toast } = useToast();
  const [result, setResult] = useState<MensagemSMSPaginatedOut | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCampanha, setFilterCampanha] = useState("");
  const [filterContacto, setFilterContacto] = useState("");
  const [campanhas, setCampanhas] = useState<CampanhaOut[]>([]);
  const [contactos, setContactos] = useState<ContactoOut[]>([]);
  const [detailMsg, setDetailMsg] = useState<MensagemSMSOut | null>(null);

  // Load filter options once
  useEffect(() => {
    campaignsService.list().then(setCampanhas).catch(() => {});
    contactsService.list().then(setContactos).catch(() => {});
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const idCampanha = filterCampanha ? parseInt(filterCampanha) : null;
      const idContacto = filterContacto ? parseInt(filterContacto) : null;

      let data: MensagemSMSPaginatedOut;
      const baseFilters = {
        skip: (page - 1) * PER_PAGE,
        limit: PER_PAGE,
        status: filterStatus || null,
      };

      if (idCampanha) {
        data = await mensagensService.listByCampaign(idCampanha, baseFilters);
      } else if (idContacto) {
        data = await mensagensService.listByContact(idContacto, baseFilters);
      } else {
        data = await mensagensService.list(baseFilters);
      }

      setResult(data);
    } catch {
      toast("error", "Erro ao carregar mensagens");
    } finally {
      setLoading(false);
    }
  }, [page, filterStatus, filterCampanha, filterContacto, toast]);

  useEffect(() => { loadData(); }, [loadData]);

  const totalPages = result ? Math.ceil(result.total / PER_PAGE) : 0;

  // Client-side search filter on current page results
  const items = result?.items || [];
  const filtered = search
    ? items.filter((m) => {
        const q = search.toLowerCase();
        return (
          m.numero_destino.includes(q) ||
          m.mensagem.toLowerCase().includes(q) ||
          (m.campanha_nome && m.campanha_nome.toLowerCase().includes(q)) ||
          (m.contacto_nome && m.contacto_nome.toLowerCase().includes(q))
        );
      })
    : items;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-ink mb-1">Mensagens</h1>
          <p className="text-muted">
            {result ? `${result.total} mensagem(ns) no total` : "A carregar..."}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar por numero, mensagem, campanha..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-surface text-ink text-sm outline-none focus:border-brand-500"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
          className="px-3 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-surface text-ink text-sm outline-none"
        >
          <option value="">Todos os estados</option>
          <option value="pending">Pendente</option>
          <option value="sent">Enviado</option>
          <option value="delivered">Entregue</option>
          <option value="failed">Falhou</option>
        </select>
        <select
          value={filterCampanha}
          onChange={(e) => { setFilterCampanha(e.target.value); setFilterContacto(""); setPage(1); }}
          className="px-3 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-surface text-ink text-sm outline-none"
        >
          <option value="">Todas as campanhas</option>
          {campanhas.map((c) => (
            <option key={c.id_campanha} value={c.id_campanha}>{c.nome_campanha}</option>
          ))}
        </select>
        <select
          value={filterContacto}
          onChange={(e) => { setFilterContacto(e.target.value); setFilterCampanha(""); setPage(1); }}
          className="px-3 py-2.5 rounded-xl border border-black/10 dark:border-white/10 bg-surface text-ink text-sm outline-none"
        >
          <option value="">Todos os contactos</option>
          {contactos.map((c) => (
            <option key={c.id_contacto} value={c.id_contacto}>{c.nome} {c.sobrenome || ""}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-black/5 dark:border-white/5">
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">Destinatario</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">Mensagem</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">Campanha</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">Data</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase w-16">Accoes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {loading && (
                <>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i}>
                      <td colSpan={6} className="px-6 py-4">
                        <div className="h-4 bg-black/5 dark:bg-white/5 rounded animate-pulse" />
                      </td>
                    </tr>
                  ))}
                </>
              )}
              {!loading && filtered.map((m) => {
                const st = STATUS_MAP[m.status] || { label: m.status, variant: "neutral" as const };
                return (
                  <tr key={m.id_mensagem} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-ink">{m.numero_destino}</p>
                      {m.contacto_nome && <p className="text-xs text-muted">{m.contacto_nome}</p>}
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-ink truncate max-w-xs">{m.mensagem}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted">
                      {m.campanha_nome || "-"}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={st.variant}>{st.label}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted">
                      {m.data_envio ? formatDate(m.data_envio) : "-"}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => setDetailMsg(m)}
                        className="p-2 rounded-lg text-muted hover:text-ink hover:bg-black/5 dark:hover:bg-white/5 transition"
                        title="Ver detalhes"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <MessageSquare className="h-10 w-10 text-muted/50 mx-auto mb-3" />
                    <p className="text-sm text-muted">Nenhuma mensagem encontrada</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-black/5 dark:border-white/5">
            <p className="text-sm text-muted">
              Pagina {page} de {totalPages} ({result?.total} registos)
            </p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                icon={<ChevronLeft className="h-4 w-4" />}
              >
                Anterior
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => p + 1)}
                icon={<ChevronRight className="h-4 w-4" />}
              >
                Seguinte
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Detail Modal */}
      {detailMsg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={() => setDetailMsg(null)}>
          <div className="bg-surface rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-ink">Detalhes da Mensagem</h3>
              <button onClick={() => setDetailMsg(null)} className="text-muted hover:text-ink text-xl">&times;</button>
            </div>
            <div className="space-y-3">
              <DetailRow label="ID" value={`#${detailMsg.id_mensagem}`} />
              <DetailRow label="Destinatario" value={detailMsg.numero_destino} />
              {detailMsg.contacto_nome && <DetailRow label="Contacto" value={detailMsg.contacto_nome} />}
              {detailMsg.campanha_nome && <DetailRow label="Campanha" value={detailMsg.campanha_nome} />}
              <div>
                <p className="text-xs text-muted mb-1">Mensagem</p>
                <p className="text-sm text-ink bg-black/[0.03] dark:bg-white/[0.03] p-3 rounded-xl">{detailMsg.mensagem}</p>
              </div>
              <DetailRow label="Estado">
                <Badge variant={STATUS_MAP[detailMsg.status]?.variant || "neutral"}>
                  {STATUS_MAP[detailMsg.status]?.label || detailMsg.status}
                </Badge>
              </DetailRow>
              {detailMsg.erro && (
                <div>
                  <p className="text-xs text-muted mb-1">Erro</p>
                  <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 p-3 rounded-xl">{detailMsg.erro}</p>
                </div>
              )}
              {detailMsg.custo && <DetailRow label="Custo" value={detailMsg.custo} />}
              {detailMsg.message_id && <DetailRow label="Message ID" value={detailMsg.message_id} />}
              <DetailRow label="Data Envio" value={detailMsg.data_envio ? formatDate(detailMsg.data_envio) : "-"} />
              {detailMsg.data_actualizacao && <DetailRow label="Ultima Actualizacao" value={formatDate(detailMsg.data_actualizacao)} />}
            </div>
            <div className="mt-6">
              <Button variant="secondary" onClick={() => setDetailMsg(null)} className="w-full">Fechar</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function DetailRow({ label, value, children }: { label: string; value?: string; children?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <p className="text-xs text-muted whitespace-nowrap">{label}</p>
      {children || <p className="text-sm text-ink text-right">{value}</p>}
    </div>
  );
}
