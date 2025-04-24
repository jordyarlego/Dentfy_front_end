import api from "../../../lib/axios";
import { AxiosError } from "axios";

export interface CasoData {
  titulo: string;
  descricao: string;
  responsavel: string;
  status: "Em andamento" | "Finalizado" | "Arquivado";
  tipo: "Vitima" | "Desaparecido" | "Outro";
  dataAbertura: string;
  dataFechamento?: string;
  sexo: "Masculino" | "Feminino" | "Outro";
  local: string;
}

export interface Evidencia {
  _id: string;
  nome: string;
  tipo: string;
  descricao: string;
  coletadoPor: string;
  arquivo: string;
  dataAdicao: string;
  laudo?: string;
  mimeType?: string;
}

// Criar novo caso
export async function criarCaso(data: CasoData) {
  try {
    const token = localStorage.getItem("token");
    const response = await api.post("/api/cases", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    throw new Error(
      axiosError.response?.data?.message || "Erro ao criar o caso."
    );
  }
}

// Buscar todos os casos
export async function buscarCasos() {
  try {
    const token = localStorage.getItem("token");
    const response = await api.get("/api/cases", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    throw new Error(
      axiosError.response?.data?.message || "Erro ao buscar os casos."
    );
  }
}

// Buscar caso por ID
export async function buscarCasoPorId(id: string) {
  try {
    const token = localStorage.getItem("token");
    const response = await api.get(`/api/cases/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    throw new Error(
      axiosError.response?.data?.message || "Erro ao buscar o caso."
    );
  }
}

// Atualizar caso
export async function atualizarCaso(id: string, data: Partial<CasoData>) {
  try {
    const token = localStorage.getItem("token");
    const response = await api.put(`/api/cases/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    throw new Error(
      axiosError.response?.data?.message || "Erro ao atualizar o caso."
    );
  }
}

// Deletar caso
export async function deletarCaso(id: string) {
  try {
    const token = localStorage.getItem("token");
    const response = await api.delete(`/api/cases/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    throw new Error(
      axiosError.response?.data?.message || "Erro ao deletar o caso."
    );
  }
}

// Adicionar evidência ao caso
export async function adicionarEvidencia(casoId: string, evidencia: Omit<Evidencia, '_id'>) {
  try {
    const token = localStorage.getItem("token");
    const response = await api.post(`/api/cases/${casoId}/evidencias`, evidencia, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    throw new Error(
      axiosError.response?.data?.message || "Erro ao adicionar evidência."
    );
  }
}

// Atualizar evidência
export async function atualizarEvidencia(casoId: string, evidenciaId: string, data: Partial<Evidencia>) {
  try {
    const token = localStorage.getItem("token");
    const response = await api.put(`/api/cases/${casoId}/evidencias/${evidenciaId}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    throw new Error(
      axiosError.response?.data?.message || "Erro ao atualizar evidência."
    );
  }
}

// Deletar evidência
export async function deletarEvidencia(casoId: string, evidenciaId: string) {
  try {
    const token = localStorage.getItem("token");
    const response = await api.delete(`/api/cases/${casoId}/evidencias/${evidenciaId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    throw new Error(
      axiosError.response?.data?.message || "Erro ao deletar evidência."
    );
  }
}
