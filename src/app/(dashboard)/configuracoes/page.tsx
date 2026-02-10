"use client";

import { useState, useEffect } from "react";
import Card from "@/components/ui/card";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/Select";
import Tabs from "@/components/ui/Tabs";
import { useToast } from "@/components/ui/Toast";
import ThemeToggle from "@/components/theme/theme-togle";
import ChangePasswordModal from "@/features/settings/components/ChangePasswordModal";
import { authService } from "@/services/auth.service";
import { settingsService } from "@/services/settings.service";
import { useAuthStore } from "@/lib/auth.store";
import {
  User, Shield, Bell, Palette, Globe, Wifi,
  Save, Key,
} from "lucide-react";
import type {
  ConfiguracaoSMS, PreferenciaNotificacao, PreferenciaAparencia,
} from "@/types/database";

export default function SettingsPage() {
  const { toast } = useToast();
  const { user, setUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<string>("perfil");
  const [loading, setLoading] = useState(false);
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  // Profile
  const [profile, setProfile] = useState({ nome_completo: "", telefone: "", empresa: "" });

  // Notifications (integers: 0 or 1)
  const [notifs, setNotifs] = useState<PreferenciaNotificacao>({
    notif_campanhas: 1,
    relatorios_semanais: 1,
    alertas_email: 0,
    alertas_sms: 0,
  });

  // Appearance / Preferences
  const [prefs, setPrefs] = useState<PreferenciaAparencia>({ fuso_horario: "Africa/Luanda" });

  // API Config
  const [apiConfig, setApiConfig] = useState<ConfiguracaoSMS>({
    provider: "",
    api_username: "",
    api_key: "",
    limite_diario: 1000,
    taxa_por_minuto: 10,
  });

  useEffect(() => {
    // Load profile from auth store
    if (user) {
      setProfile({
        nome_completo: user.nome_completo || "",
        telefone: user.telefone || "",
        empresa: user.empresa || "",
      });
    }

    // Load settings
    settingsService.getNotifications().then(setNotifs).catch(() => {});
    settingsService.getAppearance().then(setPrefs).catch(() => {});
    settingsService.getSmsConfig().then(setApiConfig).catch(() => {});
  }, [user]);

  const saveProfile = async () => {
    setLoading(true);
    try {
      const updated = await authService.updateProfile(profile);
      setUser(updated);
      toast("success", "Perfil actualizado");
    } catch {
      toast("error", "Erro ao guardar perfil");
    } finally {
      setLoading(false);
    }
  };

  const saveNotifications = async () => {
    setLoading(true);
    try {
      await settingsService.updateNotifications(notifs);
      toast("success", "Notificacoes actualizadas");
    } catch {
      toast("error", "Erro ao guardar notificacoes");
    } finally {
      setLoading(false);
    }
  };

  const savePreferences = async () => {
    setLoading(true);
    try {
      await settingsService.updateAppearance(prefs);
      toast("success", "Preferencias actualizadas");
    } catch {
      toast("error", "Erro ao guardar preferencias");
    } finally {
      setLoading(false);
    }
  };

  const saveApiConfig = async () => {
    setLoading(true);
    try {
      await settingsService.updateSmsConfig(apiConfig);
      toast("success", "Configuracao SMS actualizada");
    } catch {
      toast("error", "Erro ao guardar configuracao");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { key: "perfil", label: "Perfil", icon: <User className="h-4 w-4" /> },
    { key: "seguranca", label: "Seguranca", icon: <Shield className="h-4 w-4" /> },
    { key: "notificacoes", label: "Notificacoes", icon: <Bell className="h-4 w-4" /> },
    { key: "aparencia", label: "Aparencia", icon: <Palette className="h-4 w-4" /> },
    { key: "preferencias", label: "Preferencias", icon: <Globe className="h-4 w-4" /> },
    { key: "api", label: "API SMS", icon: <Wifi className="h-4 w-4" /> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-ink mb-1">Configuracoes</h1>
        <p className="text-muted">Gerir a sua conta e preferencias</p>
      </div>

      <Tabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} variant="pills" />

      {/* Perfil */}
      {activeTab === "perfil" && (
        <Card>
          <h2 className="text-lg font-bold text-ink mb-4">Informacao do Perfil</h2>
          <div className="space-y-4 max-w-lg">
            <Input label="Email" value={user?.email || ""} disabled />
            <Input label="Nome Completo" value={profile.nome_completo} onChange={(e) => setProfile({ ...profile, nome_completo: e.target.value })} />
            <Input label="Telefone" value={profile.telefone} onChange={(e) => setProfile({ ...profile, telefone: e.target.value })} />
            <Input label="Empresa" value={profile.empresa} onChange={(e) => setProfile({ ...profile, empresa: e.target.value })} />
            <Button onClick={saveProfile} loading={loading} icon={<Save className="h-4 w-4" />}>Guardar</Button>
          </div>
        </Card>
      )}

      {/* Seguranca */}
      {activeTab === "seguranca" && (
        <Card>
          <h2 className="text-lg font-bold text-ink mb-4">Seguranca</h2>
          <div className="space-y-4 max-w-lg">
            <div className="flex items-center justify-between p-4 rounded-xl border border-black/5 dark:border-white/10">
              <div>
                <p className="text-sm font-semibold text-ink">Alterar Senha</p>
                <p className="text-xs text-muted">Actualize a sua senha regularmente</p>
              </div>
              <Button variant="secondary" onClick={() => setPasswordModalOpen(true)} icon={<Key className="h-4 w-4" />} size="sm">
                Alterar
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Notificacoes */}
      {activeTab === "notificacoes" && (
        <Card>
          <h2 className="text-lg font-bold text-ink mb-4">Preferencias de Notificacao</h2>
          <div className="space-y-3 max-w-lg">
            {([
              { key: "notif_campanhas" as const, label: "Notificacoes de campanhas" },
              { key: "relatorios_semanais" as const, label: "Relatorios semanais" },
              { key: "alertas_email" as const, label: "Alertas por email" },
              { key: "alertas_sms" as const, label: "Alertas por SMS" },
            ]).map(({ key, label }) => (
              <label key={key} className="flex items-center justify-between p-3 rounded-xl hover:bg-black/[0.02] dark:hover:bg-white/[0.02] cursor-pointer">
                <span className="text-sm font-medium text-ink">{label}</span>
                <input
                  type="checkbox"
                  checked={(notifs[key] ?? 0) === 1}
                  onChange={(e) => setNotifs({ ...notifs, [key]: e.target.checked ? 1 : 0 })}
                  className="rounded border-black/20 dark:border-white/20 text-brand-500 focus:ring-brand-500"
                />
              </label>
            ))}
            <Button onClick={saveNotifications} loading={loading} icon={<Save className="h-4 w-4" />}>Guardar</Button>
          </div>
        </Card>
      )}

      {/* Aparencia */}
      {activeTab === "aparencia" && (
        <Card>
          <h2 className="text-lg font-bold text-ink mb-4">Aparencia</h2>
          <div className="max-w-lg">
            <div className="flex items-center justify-between p-4 rounded-xl border border-black/5 dark:border-white/10">
              <div>
                <p className="text-sm font-semibold text-ink">Tema</p>
                <p className="text-xs text-muted">Alternar entre modo claro e escuro</p>
              </div>
              <ThemeToggle />
            </div>
          </div>
        </Card>
      )}

      {/* Preferencias */}
      {activeTab === "preferencias" && (
        <Card>
          <h2 className="text-lg font-bold text-ink mb-4">Preferencias</h2>
          <div className="space-y-4 max-w-lg">
            <Select
              label="Fuso Horario"
              value={prefs.fuso_horario || "Africa/Luanda"}
              onChange={(v) => setPrefs({ ...prefs, fuso_horario: v })}
              options={[
                { value: "Africa/Luanda", label: "Africa/Luanda (WAT)" },
                { value: "UTC", label: "UTC" },
                { value: "Europe/Lisbon", label: "Europe/Lisboa (WET)" },
              ]}
            />
            <Button onClick={savePreferences} loading={loading} icon={<Save className="h-4 w-4" />}>Guardar</Button>
          </div>
        </Card>
      )}

      {/* API SMS */}
      {activeTab === "api" && (
        <Card>
          <h2 className="text-lg font-bold text-ink mb-4">Configuracao SMS API</h2>
          <div className="space-y-4 max-w-lg">
            <Select
              label="Provedor SMS"
              value={apiConfig.provider || ""}
              onChange={(v) => setApiConfig({ ...apiConfig, provider: v })}
              options={[
                { value: "twilio", label: "Twilio" },
                { value: "nexmo", label: "Nexmo / Vonage" },
                { value: "africas_talking", label: "Africa's Talking" },
                { value: "outro", label: "Outro" },
              ]}
              placeholder="Seleccionar provedor..."
            />
            <Input label="API Username" value={apiConfig.api_username || ""} onChange={(e) => setApiConfig({ ...apiConfig, api_username: e.target.value })} placeholder="Username da API" />
            <Input label="API Key" type="password" value={apiConfig.api_key || ""} onChange={(e) => setApiConfig({ ...apiConfig, api_key: e.target.value })} placeholder="Chave da API" />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Limite Diario" type="number" value={apiConfig.limite_diario?.toString() || ""} onChange={(e) => setApiConfig({ ...apiConfig, limite_diario: parseInt(e.target.value) || 0 })} />
              <Input label="Taxa por Minuto" type="number" value={apiConfig.taxa_por_minuto?.toString() || ""} onChange={(e) => setApiConfig({ ...apiConfig, taxa_por_minuto: parseInt(e.target.value) || 0 })} />
            </div>
            <Button onClick={saveApiConfig} loading={loading} icon={<Save className="h-4 w-4" />}>Guardar</Button>
          </div>
        </Card>
      )}

      <ChangePasswordModal open={passwordModalOpen} onClose={() => setPasswordModalOpen(false)} />
    </div>
  );
}
