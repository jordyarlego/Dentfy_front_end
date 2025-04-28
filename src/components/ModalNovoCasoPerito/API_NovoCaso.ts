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
  tipo: "imagem" | "texto";
  dataColeta: string;
  coletadoPor: string;
  caso: string;
  imagemURL?: string;
  conteudoTexto?: string;
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
    const formData = new FormData();
    
    // Adiciona os campos da evidência ao FormData
    formData.append('tipo', evidencia.tipo);
    formData.append('dataColeta', new Date().toISOString());
    formData.append('coletadoPor', evidencia.coletadoPor);
    formData.append('caso', casoId);
    
    // Adiciona o arquivo se existir
    if (evidencia.tipo === "imagem" && evidencia.arquivo) {
      formData.append('imagem', evidencia.arquivo);
    } else if (evidencia.tipo === "texto" && evidencia.conteudoTexto) {
      formData.append('conteudoTexto', evidencia.conteudoTexto);
    }

    const response = await api.post(`/api/evidence/upload`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
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
    const formData = new FormData();
    
    // Adiciona os campos da evidência ao FormData
    if (data.tipo) formData.append('tipo', data.tipo);
    if (data.dataColeta) formData.append('dataColeta', data.dataColeta);
    if (data.coletadoPor) formData.append('coletadoPor', data.coletadoPor);
    formData.append('caso', casoId);
    
    // Adiciona o arquivo se existir
    if (data.tipo === "imagem" && data.arquivo) {
      formData.append('imagem', data.arquivo);
    } else if (data.tipo === "texto" && data.conteudoTexto) {
      formData.append('conteudoTexto', data.conteudoTexto);
    }

    const response = await api.put(`/api/evidence/${evidenciaId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
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
    const response = await api.delete(`/api/evidence/${evidenciaId}`, {
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

// Buscar evidências por caso
export async function buscarEvidenciasPorCaso(casoId: string) {
  try {
    const token = localStorage.getItem("token");
    const response = await api.get(`/api/evidence/${casoId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    throw new Error(
      axiosError.response?.data?.message || "Erro ao buscar evidências."
    );
  }
}
