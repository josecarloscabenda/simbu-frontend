// Combina classes CSS, filtrando valores falsy (como undefined, null ou false) e unindo os restantes com um espaço. Útil para aplicar classes condicionalmente.
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(" ");
}

// Formata uma data ISO para o formato "dd/mm/yyyy hh:mm" em português de Angola. Retorna "-" se a data for nula ou indefinida.
export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("pt-AO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

// Formata uma string de data e hora para o formato "dd/mm/yyyy hh:mm" em português de Angola. Retorna "-" se a string for nula ou indefinida.
export function formatDateTime(dateStr: string | null | undefined): string {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleString("pt-AO", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Calcula o número de segmentos SMS necessários para um texto, considerando queo limite é de 160 caracteres para o primeiro segmento e 153 para os seguintes (devido ao uso de UDH). Retorna 0 para texto vazio ou nulo.
export function smsSegments(text: string): number {
  if (!text) return 0;
  if (text.length <= 160) return 1;
  return Math.ceil(text.length / 153);
}