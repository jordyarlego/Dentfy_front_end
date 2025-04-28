import api from "../lib/axios";

interface LaudoData {
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

interface Laudo {
  _id: string;
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
  assinado: boolean;
  dataAssinatura?: string;
  dataCriacao: string;
  dataAtualizacao: string;
}


export function parseJwt(token: string): any {
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
}) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.post("/api/laudos", data, {
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
export const getLaudos = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.get("/api/laudos", {
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

// Atualizar um laudo existente
export const putLaudo = async (id: string, data: { titulo: string; texto: string }) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.put(`/api/laudos/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar laudo:", error);
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

// Exportar laudo em PDF
export const getLaudoPDF = async (id: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.get(`/api/laudos/${id}/pdf`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: 'blob',
    });
    
    // Criar URL do blob e iniciar download
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `laudo_${id}.pdf`;
    link.click();
    window.URL.revokeObjectURL(url);
    
    return response.data;
  } catch (error) {
    console.error("Erro ao exportar laudo em PDF:", error);
    throw error;
  }
};

// Assinar digitalmente o laudo
export const assinarLaudo = async (id: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.post(`/api/laudos/${id}/assinar`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
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

// Buscar laudos por evidência
export const getLaudosByEvidencia = async (evidenciaId: string) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.get(`/api/laudos/evidencia/${evidenciaId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar laudos da evidência:", error);
    throw error;
  }
}; 