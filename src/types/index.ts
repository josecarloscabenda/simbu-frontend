export interface User {
  id: string;
  nome: string;
  email: string;
  empresa: string;
  telefone: string;
  role: "admin" | "user";
  createdAt: Date;
}

export interface Campaign {
  id: string;
  nome: string;
  tipo: "sms" | "email" | "ambos";
  status: "rascunho" | "agendada" | "ativa" | "concluida" | "cancelada";
  grupoId: string;
  mensagem: string;
  agendamento: {
    tipo: "imediato" | "agendado";
    data?: Date;
  };
  estatisticas: {
    enviados: number;
    entregues: number;
    falhas: number;
    aberturas?: number;
    cliques?: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Contact {
  id: string;
  nome: string;
  email?: string;
  telefone?: string;
  grupos: string[];
  customFields: Record<string, string | number | boolean | null>;
  createdAt: Date;
}

export interface ContactGroup {
  id: string;
  nome: string;
  descricao?: string;
  totalContactos: number;
  createdAt: Date;
}
