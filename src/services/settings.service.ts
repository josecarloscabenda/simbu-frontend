import api from "@/lib/api";
import type {
  ConfiguracaoSMS,
  PreferenciaNotificacao,
  PreferenciaAparencia,
} from "@/types/database";

export const settingsService = {
  // SMS Configuration
  getSmsConfig: () =>
    api.get<ConfiguracaoSMS>("/settings/sms-config").then((r) => r.data),

  updateSmsConfig: (data: ConfiguracaoSMS) =>
    api.put<ConfiguracaoSMS>("/settings/sms-config", data).then((r) => r.data),

  // Notifications
  getNotifications: () =>
    api.get<PreferenciaNotificacao>("/settings/notificacoes").then((r) => r.data),

  updateNotifications: (data: PreferenciaNotificacao) =>
    api.put<PreferenciaNotificacao>("/settings/notificacoes", data).then((r) => r.data),

  // Appearance
  getAppearance: () =>
    api.get<PreferenciaAparencia>("/settings/aparencia").then((r) => r.data),

  updateAppearance: (data: PreferenciaAparencia) =>
    api.put<PreferenciaAparencia>("/settings/aparencia", data).then((r) => r.data),
};