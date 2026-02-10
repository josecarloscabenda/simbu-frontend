// ============ Permissoes ============
export interface PermissaoOut {
  id_permissao: number;
  nome_grupo: string;
}

// ============ Auth ============
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export interface UtilizadorOut {
  id_utilizador: number;
  utilizador: string;
  nome_completo?: string | null;
  email: string;
  telefone?: string | null;
  empresa?: string | null;
  activo: number;
  id_permissao: number;
  permissao_nome?: string | null;
  last_login?: string | null;
  data_criacao?: string | null;
}

export interface UtilizadorCreateIn {
  utilizador: string;
  password: string;
  nome_completo?: string | null;
  email: string;
  telefone?: string | null;
  empresa?: string | null;
  activo?: number;
  id_permissao: number;
}

export interface ProfileUpdateIn {
  nome_completo?: string | null;
  email?: string | null;
  telefone?: string | null;
  empresa?: string | null;
}

export interface ChangePasswordIn {
  password_actual: string;
  password_nova: string;
}

// ============ Contacto ============
export interface ContactoOut {
  id_contacto: number;
  nome: string;
  sobrenome?: string | null;
  telefone: string;
  movel?: string | null;
  email?: string | null;
  tipo_pessoa?: string | null;
  designacao?: string | null;
  nif?: string | null;
  localizacao?: string | null;
  montante_desejado?: string | null;
  sector_actividade?: string | null;
  descricao_projecto?: string | null;
  data_criacao: string;
}

export interface ContactoCreate {
  nome: string;
  telefone: string;
  sobrenome?: string | null;
  movel?: string | null;
  email?: string | null;
  tipo_pessoa?: string | null;
  designacao?: string | null;
  nif?: string | null;
  localizacao?: string | null;
  montante_desejado?: string | null;
  sector_actividade?: string | null;
  descricao_projecto?: string | null;
}

export interface ContactoUpdate {
  nome?: string | null;
  sobrenome?: string | null;
  telefone?: string | null;
  movel?: string | null;
  email?: string | null;
  tipo_pessoa?: string | null;
  designacao?: string | null;
  nif?: string | null;
  localizacao?: string | null;
  montante_desejado?: string | null;
  sector_actividade?: string | null;
  descricao_projecto?: string | null;
}

// ============ Grupo ============
export interface GrupoOut {
  id_grupo: number;
  nome_grupo: string;
  descricao_grupo?: string | null;
}

export interface GrupoCreate {
  nome_grupo: string;
}

export interface GrupoUpdate {
  nome_grupo?: string | null;
  descricao_grupo?: string | null;
}

// ============ Template ============
export interface TemplateOut {
  id_template: number;
  nome_template: string;
  descricao?: string | null;
  categoria?: string | null;
  id_categoria?: number | null;
  categoria_nome?: string | null;
  data_criacao?: string | null;
}

export interface TemplateCreate {
  nome: string;
  descricao: string;
  categoria: string;
}

export interface TemplateUpdate {
  nome?: string | null;
  descricao?: string | null;
  categoria?: string | null;
}

// ============ Template Categoria ============
export interface TemplateCategoriaOut {
  id_categoria: number;
  nome_categoria: string;
  data_criacao?: string | null;
}

export interface TemplateCategoriaCreate {
  nome_categoria: string;
}

export interface TemplateCategoriaUpdate {
  nome_categoria: string;
}

// ============ Campanha ============
export interface CampanhaOut {
  id_campanha: number;
  nome_campanha: string;
  sms_texto: string;
  sms_ativo: number;
  email_ativo: number;
  data_criacao?: string | null;
  id_template?: number | null;
}

export interface SMSCampaignPayload {
  nome: string;
  texto: string;
  to: string[];
  id_template?: number | null;
  send_now?: boolean;
}

export interface CampaignUpdatePayload {
  sms_texto: string;
}

// ============ Agendamento ============
export interface AgendamentoOut {
  id_agendamento: number;
  data_hora: string;
  id_campanha: number;
  id_grupo: number;
  enviado: boolean;
  id_template?: number | null;
  campanha_nome?: string | null;
  grupo_nome?: string | null;
}

export interface AgendamentoCreate {
  id_campanha: number;
  id_grupo: number;
  data_hora: string;
}

// ============ Mensagens SMS ============
export interface MensagemSMSOut {
  id_mensagem: number;
  id_campanha?: number | null;
  id_contacto?: number | null;
  id_agendamento?: number | null;
  numero_destino: string;
  mensagem: string;
  status: "pending" | "sent" | "delivered" | "failed";
  message_id?: string | null;
  custo?: string | null;
  erro?: string | null;
  data_envio?: string | null;
  data_actualizacao?: string | null;
  campanha_nome?: string | null;
  contacto_nome?: string | null;
}

export interface MensagemSMSPaginatedOut {
  total: number;
  page: number;
  per_page: number;
  items: MensagemSMSOut[];
}

export interface MensagemSMSFilters {
  skip?: number;
  limit?: number;
  status?: string | null;
  id_campanha?: number | null;
  id_contacto?: number | null;
  data_inicio?: string | null;
  data_fim?: string | null;
}

// ============ Dashboard ============
export interface DashboardKpiPair {
  current: number;
  previous: number;
}

export interface DashboardData {
  today_indicators: {
    active_sms_campaigns: number;
    sms_sent_today: number;
    email_sent_today: number;
    overall_delivery_rate: number;
  };
  kpis: {
    campaigns: DashboardKpiPair;
    sms_sent: DashboardKpiPair;
    delivery_rate_pct: DashboardKpiPair;
    active_contacts: DashboardKpiPair;
    lifetime: {
      total_delivered: number;
      total_failed: number;
      total_pending: number;
      total_scheduled_campaigns: number;
      success_rate: number;
    };
  };
  totals: {
    contactos: number;
    grupos: number;
    templates: number;
    campanhas: number;
    agendamentos_pendentes: number;
    agendamentos_enviados: number;
  };
  chart: unknown[];
  recent_schedules: {
    campanha: string;
    data_hora: string;
    enviado: boolean;
  }[];
  recent_logs: unknown[];
}

// ============ Settings ============
export interface ConfiguracaoSMS {
  provider?: string | null;
  api_username?: string | null;
  api_key?: string | null;
  limite_diario?: number | null;
  taxa_por_minuto?: number | null;
}

export interface PreferenciaNotificacao {
  notif_campanhas?: number | null;
  relatorios_semanais?: number | null;
  alertas_email?: number | null;
  alertas_sms?: number | null;
}

export interface PreferenciaAparencia {
  tema?: string | null;
  fuso_horario?: string | null;
}

// ============ Campaign Preview ============
export interface CampaignPreview {
  total_contactos: number;
  mensagens: Array<{
    contacto: string;
    mensagem: string;
  }>;
}

// ============ Misc ============
export interface LinkContactsRequest {
  id_contactos: number[];
}

export interface MessageOut {
  message: string;
}