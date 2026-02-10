"use client";

import { useState, useEffect } from "react";
import Card from "@/components/ui/card";
import Badge from "@/components/ui/Badge";
import { dashboardService } from "@/services/dashboard.service";
import { formatDate } from "@/lib/utils";
import { Megaphone, MessageSquare, Users, FileText, Calendar, TrendingUp } from "lucide-react";
import type { DashboardData } from "@/types/database";

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dashboardService
      .getData()
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-ink mb-2">Dashboard</h1>
          <p className="text-muted">Visao geral das suas campanhas e estatisticas</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-surface rounded-2xl border border-black/5 dark:border-white/10 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const kpis = data?.kpis;
  const totals = data?.totals;
  const today = data?.today_indicators;

  const stats = [
    { label: "Total Campanhas", value: kpis?.campaigns.current ?? 0, icon: Megaphone, color: "text-brand-500", bg: "bg-brand-500/10" },
    { label: "SMS Enviados", value: kpis?.sms_sent.current ?? 0, icon: MessageSquare, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Agendamentos", value: kpis?.lifetime.total_scheduled_campaigns ?? 0, icon: Calendar, color: "text-yellow-500", bg: "bg-yellow-500/10" },
    { label: "Taxa de Entrega", value: `${(kpis?.delivery_rate_pct.current ?? 0).toFixed(1)}%`, icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10" },
  ];

  const summaryCards = [
    { label: "Contactos", value: totals?.contactos ?? 0, icon: Users },
    { label: "Grupos", value: totals?.grupos ?? 0, icon: Users },
    { label: "Templates", value: totals?.templates ?? 0, icon: FileText },
    { label: "Agend. Pendentes", value: totals?.agendamentos_pendentes ?? 0, icon: Calendar },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-ink mb-2">Dashboard</h1>
        <p className="text-muted">Visao geral das suas campanhas e estatisticas</p>
      </div>

      {/* Today indicators */}
      {today && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-brand-500/5 border border-brand-500/20">
            <p className="text-xs text-muted mb-1">Campanhas SMS activas</p>
            <p className="text-2xl font-bold text-ink">{today.active_sms_campaigns}</p>
          </div>
          <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20">
            <p className="text-xs text-muted mb-1">SMS enviados hoje</p>
            <p className="text-2xl font-bold text-ink">{today.sms_sent_today}</p>
          </div>
          
          <div className="p-4 rounded-2xl bg-green-500/5 border border-green-500/20">
            <p className="text-xs text-muted mb-1">Taxa de entrega geral</p>
            <p className="text-2xl font-bold text-ink">{today.overall_delivery_rate.toFixed(1)}%</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <div className="flex items-center justify-between mb-1">
              <div className={`p-3 rounded-xl ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            <p className="text-2xl text-ink mb-1">{stat.value}</p>
            <p className="text-sm text-muted">{stat.label}</p>
          </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {summaryCards.map((item) => (
          <div key={item.label} className="flex items-center gap-3 p-4 rounded-2xl bg-surface border border-black/5 dark:border-white/10">
            <item.icon className="h-5 w-5 text-muted" />
            <div>
              <p className="text-xl font-bold text-ink">{item.value}</p>
              <p className="text-xs text-muted">{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      <Card padding={false}>
        <div className="p-6 border-b border-black/5 dark:border-white/10">
          <h2 className="text-xl font-bold text-ink">Agendamentos Recentes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-black/5 dark:border-white/5">
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">Campanha</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">Data Envio</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-muted uppercase">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5 dark:divide-white/5">
              {(data?.recent_schedules || []).map((s, i) => (
                <tr key={i} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02]">
                  <td className="px-6 py-4 text-sm font-medium text-ink">{s.campanha}</td>
                  <td className="px-6 py-4 text-sm text-muted">{formatDate(s.data_hora)}</td>
                  <td className="px-6 py-4">
                    <Badge variant={s.enviado ? "success" : "warning"}>{s.enviado ? "Enviado" : "Pendente"}</Badge>
                  </td>
                </tr>
              ))}
              {(!data?.recent_schedules || data.recent_schedules.length === 0) && (
                <tr><td colSpan={3} className="px-6 py-8 text-center text-sm text-muted">Nenhum agendamento recente</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
