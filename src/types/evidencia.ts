export interface Evidencia {
  _id: string;
  nome: string;
  tipo: string;
  descricao: string;
  coletadoPor: string;
  arquivo: string;
  dataAdicao: string;
  mimeType?: string;
  imagemURL?: string;
  laudo?: string;
}

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

export interface ModalGerarLaudoEvidenciaProps {
  isOpen: boolean;
  onClose: () => void;
  evidencia: Evidencia;
  onLaudoSaved?: () => void;
} 