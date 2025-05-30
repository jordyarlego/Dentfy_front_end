import api from "../lib/axios";

export interface apiVitima {
  nomeCompleto: string;
  dataNascimento: string; // formato ISO: YYYY-MM-DD
  sexo: "Masculino" | "Feminino" | "Outro";
  cpf: string;
  nic: string;
  etnia: "Preto" | "Pardo" | "Branco" | "Amarelo" | "Indígena";
  caso?: string;
}

export async function PostVitima(data: apiVitima) {
  console.log("Vítima adicionada:");
  try {
    const token = localStorage.getItem("token");

    const response = await api.post("/api/periciados", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao criar vítima", error);
    throw error;
  }
}

export async function GetVitimas() {
  try {
    const token = localStorage.getItem("token");

    const response = await api.get("/api/periciados", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao carregar vítimas", error);
    throw error;
  }
}

export async function GetVitimaById(caseId: string) {
  try {
    const token = localStorage.getItem("token");

    const response = await api.get(`/api/periciados/por-caso/${caseId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao buscar vítima por ID", error);
    throw error;
  }
}

export async function PutVitima(id: string, data: apiVitima) {
  console.log("Atualizando vítima:", id);
  try {
    const token = localStorage.getItem("token");

    const response = await api.put(`/api/periciados/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar vítima", error);
    throw error;
  }
}

export async function DeleteVitima(id: string) {
  console.log("Deletando vítima:", id);
  try {
    const token = localStorage.getItem("token");

    const response = await api.delete(`/api/periciados/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao deletar vítima", error);
    throw error;
  }
}
