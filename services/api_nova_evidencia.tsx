import api from "../lib/axios";
import { AxiosError } from "axios";

interface CriarEvidenciaAPI {
  tipo: "imagem" | "texto";
  dataColeta: string;
  coletadoPor: string;
  descricao: string;
  caso: string;
  arquivo?: File;
  responsavel: string;
}

export interface Evidencia {
  _id: string;
  tipo: string;
  dataColeta: string;
  coletadoPor: string; 
  descricao: string;
  caso: string; 
  imagemURL?: string;
}

export {};

export const postEvidencia = async (dados: CriarEvidenciaAPI) => {
  try {
    const formData = new FormData();
    
    formData.append('tipo', dados.tipo);
    formData.append('dataColeta', dados.dataColeta);
    formData.append('coletadoPor', dados.coletadoPor);
    formData.append('descricao', dados.descricao);
    formData.append('caso', dados.caso);
    formData.append('responsavel', dados.responsavel);

    if (dados.arquivo) {
      formData.append('imagem', dados.arquivo);
    }

    const response = await api.post<Evidencia>("/api/evidences", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Erro detalhado:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
    }
    throw error;
  }
};

// Visualizar evidencia
export const getEvidenciaByCaseId = async (casoId: string): Promise<Evidencia[]> => {
  try {
    const response = await api.get<Evidencia[]>(`/api/evidences/${casoId}`);
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar evidências:", error);
    throw error;
  }
};

// Atualizar evidencias
export const putEvidencia = async (id: string, data: Partial<Evidencia>): Promise<Evidencia> => {
  try {
    const response = await api.patch<Evidencia>(`/api/evidences/${id}`, data);
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar evidência:", error);
    throw error;
  }
};

// Deletar evidencias
export const deleteEvidencia = async (id: string): Promise<void> => {
  try {
    await api.delete(`/api/evidences/${id}`);
  } catch (error) {
    console.error("Erro ao deletar evidência:", error);
    throw error;
  }
};