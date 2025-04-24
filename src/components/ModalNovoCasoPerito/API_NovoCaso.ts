import api from "../../../lib/axios";
import { AxiosError } from "axios";

interface CasoData {
  titulo: string;
  descricao: string;
  responsavel: string;
  status: "Em andamento" | "Finalizado" | "Arquivado";
  tipo: "Vitima" | "Desaparecido" | "Outros";
  dataAbertura: string;
  sexo: "Masculino" | "Feminino";
  local: string;
}

export async function criarCaso(data: CasoData) {
  console.log("Dados enviados para criação:", data);
  try {
    const token = localStorage.getItem("token");

    const response = await api.post("/api/cases", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Erro original na request:", error);

    const axiosError = error as AxiosError<{ message?: string }>;

    if (axiosError.response) {
      console.error("Status do erro:", axiosError.response.status);
      console.error("Resposta de erro:", axiosError.response.data);
    }

    throw new Error(
      axiosError.response?.data?.message || "Erro ao criar o caso."
    );
  }
}
