import api from "../lib/axios";

interface RelatorioData {
  titulo: string;
  conteudo: string;
  caso: string;
  peritoResponsavel: string;
}

export function parseJwt(token: string): any {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    console.error("Erro ao decodificar token JWT", e);
    return null;
  }
}

export async function PostRelatorio(data: RelatorioData) {
  console.log("relatorio Enviado");
  try {
    const token = localStorage.getItem("token");

    const response = await api.post("/api/relatorio", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao criar relatório", error);
    throw error;
  }
}

// Função para listar todos os relatórios
export async function GetRelatorios() {
  try {
    const token = localStorage.getItem("token");

    const response = await api.get("/api/relatorio", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao listar relatórios", error);
    throw error;
  }
}

// Função para atualizar um relatório existente
export async function UpdateRelatorio(
  id: string,
  data: Partial<RelatorioData>
) {
  try {
    const token = localStorage.getItem("token");

    const response = await api.put(`/api/relatorio/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar relatório", error);
    throw error;
  }
}

// Função para deletar um relatório
export async function DeleteRelatorio(id: string) {
  try {
    const token = localStorage.getItem("token");

    const response = await api.delete(`/api/relatorio/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao deletar relatório", error);
    throw error;
  }
}

// Função para exportar um relatório em PDF
export async function ExportRelatorioPDF(id: string) {
  try {
    const token = localStorage.getItem("token");

    const response = await api.get(`/api/relatorio/${id}/pdf`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      responseType: "blob", // Para lidar com arquivos PDF
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao exportar relatório em PDF", error);
    throw error;
  }
}

// Função para assinar digitalmente um relatório
export async function AssinarRelatorio(id: string) {
  try {
    const token = localStorage.getItem("token");

    const response = await api.post(`/api/relatorio/${id}/assinar`, {}, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao assinar relatório", error);
    throw error;
  }
}
