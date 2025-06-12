import api from "../lib/axios";

export interface LaudoData {
  titulo: string;
  texto: string;
  evidencia: {
    _id: string;
    tipo: string;
    nome: string;
    dataColeta: string;
    coletadoPor: string;
  };
  peritoResponsavel: {
    _id: string;
    nome: string;
    registro: string;
  };
  assinado?: boolean;
  dataAssinatura?: string;
}

export interface Laudo extends LaudoData {
  _id: string;
  dataCriacao: string;
  dataAtualizacao: string;
}

interface JwtPayload {
  id: string;
  nome: string;
  role: string;
  exp: number;
}

export function parseJwt(token: string): JwtPayload | null {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    console.error("Erro ao decodificar token JWT", e);
    return null;
  }
}

// Criar um novo laudo
export const postLaudo = async (data: {
  titulo: string;
  texto: string;
  evidence: string;
  peritoResponsavel: string;
}): Promise<Laudo> => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.post<Laudo>("/api/laudos", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao criar laudo:", error);
    throw error;
  }
};

// Listar todos os laudos do perito
export const getLaudos = async (): Promise<Laudo[]> => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.get<Laudo[]>("/api/laudos", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar laudos:", error);
    throw error;
  }
};

export interface CriarLaudoDTO {
  titulo: string;
  texto: string;
  evidence: string;
  peritoResponsavel: string;
}

export interface AtualizarLaudoDTO extends Partial<Omit<LaudoData, "_id">> {}

// Atualizar um laudo existente com melhor tipagem
export const putLaudo = async (
  id: string,
  dados: AtualizarLaudoDTO
): Promise<Laudo> => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.put<Laudo>(`/api/laudos/${id}`, dados, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Erro ao atualizar laudo:", error.response?.data || error);
    throw error;
  }
};

// Deletar um laudo
export const deleteLaudo = async (id: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.delete(`/api/laudos/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao deletar laudo:", error);
    throw error;
  }
};

// Exportar laudo em PDF com melhor tratamento de erro
export const getLaudoPDF = async (id: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.get(`/api/laudos/${id}/pdf`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/pdf",
      },
      responseType: "blob",
    });

    // Verificar se o response tem dados e é do tipo correto
    if (response.data && response.data.type === "application/pdf") {
      const blob = new Blob([response.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `laudo_${id}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      console.log("✅ PDF gerado com sucesso!");
      return response.data;
    } else {
      throw new Error("Formato de resposta inválido");
    }
  } catch (error: any) {
    // Melhor tratamento do erro
    if (error.response?.status === 400) {
      console.error(
        "❌ Erro 400: Requisição inválida ao gerar PDF",
        error.response?.data
      );
      throw new Error(
        "Não foi possível gerar o PDF. Verifique se o laudo está assinado."
      );
    }
    console.error("❌ Erro ao exportar laudo em PDF:", error);
    throw error;
  }
};

// Assinar digitalmente o laudo
export const assinarLaudo = async (id: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.post(
      `/api/laudos/${id}/assinar`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao assinar laudo:", error);
    throw error;
  }
};

// Buscar laudo por ID
export const getLaudoById = async (id: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.get(`/api/laudos/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar laudo:", error);
    throw error;
  }
};

// Buscar laudos por evidência com tratamento melhorado
export const getLaudosByEvidencia = async (
  evidenciaId: string
): Promise<Laudo[]> => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.get(`/api/laudos/por-evidencia/${evidenciaId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = response.data;

    if (Array.isArray(data)) {
      return data;
    }

    if (Array.isArray(data.laudos)) {
      return data.laudos;
    }

    console.warn("Resposta inesperada ao buscar laudos:", data);
    return [];
  } catch (error: any) {
    console.error(
      "Erro ao buscar laudos por evidência:",
      error.response?.data || error
    );
    return [];
  }
};

// Nova rota para buscar histórico de assinaturas
export const getLaudoSignatureHistory = async (id: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.get(`/api/laudos/${id}/assinaturas`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error(
      "Erro ao buscar histórico de assinaturas:",
      error.response?.data || error
    );
    throw error;
  }
};

// Nova rota para validar assinatura
export const validateLaudoSignature = async (
  id: string,
  assinaturaId: string
) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.post(
      `/api/laudos/${id}/validar-assinatura/${assinaturaId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Erro ao validar assinatura:", error.response?.data || error);
    throw error;
  }
};

// Buscar laudos por caso
export const getLaudosByCaso = async (casoId: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.get(`/api/laudos/por-caso/${casoId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar laudos do caso:", error);
    throw error;
  }
};

// Adicionar revisor ao laudo
export const addRevisorLaudo = async (id: string, revisorId: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.post(
      `/api/laudos/${id}/revisor/${revisorId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Erro ao adicionar revisor:", error);
    throw error;
  }
};

// Remover revisor do laudo
export const removeRevisorLaudo = async (id: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.delete(`/api/laudos/${id}/revisor`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao remover revisor:", error);
    throw error;
  }
};
