// Função assíncrona para buscar os dados do dashboard
import api from "../lib/axios";

export async function AxiosDashboardData() {
  try {
    const response = await api.get("/api/dashboard/resumo");
    // O response.data conterá o objeto com porStatus e porTipo
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard:", error);
    throw error;
  }
}
//mas falta conectar essa chamada a dashboard
