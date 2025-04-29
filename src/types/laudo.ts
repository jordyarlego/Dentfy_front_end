export interface Laudo {
  _id: string;
  titulo: string;
  texto: string;
  evidence: string; // ID da evidência
  peritoResponsavel: string; // ID do perito
  assinado: boolean;
  dataAssinatura?: string;
  dataCriacao: string;
  dataAtualizacao: string;
}

export interface LaudoFormData {
  titulo: string;
  texto: string;
  evidence: string;
  peritoResponsavel: string;
} 