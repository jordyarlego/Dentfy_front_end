import { useState, useEffect } from 'react';
import api from "../lib/axios";

// Busca os dados crus da API
export async function AxiosDashboardData() {
  try {
    const response = await api.get("/api/dashboard/resumo");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar dados do dashboard:", error);
    throw error;
  }
}

// Hook embutido: casos por tipo
export function useCasosPorTipo() {
  const [casosPorTipo, setCasosPorTipo] = useState<{ tipo: string; quantidade: number }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { porTipo } = await AxiosDashboardData();

        const novosDados = porTipo
          .filter((item: any) => item.tipo !== null)
          .map((item: any) => ({
            tipo: item.tipo,
            quantidade: item.total,
          }))
          .sort((a: any, b: any) => a.tipo.localeCompare(b.tipo));

        const dadosAtuaisOrdenados = [...casosPorTipo].sort((a, b) => a.tipo.localeCompare(b.tipo));

        if (JSON.stringify(novosDados) !== JSON.stringify(dadosAtuaisOrdenados)) {
          setCasosPorTipo(novosDados);
        }
      } catch (err) {
        console.error('Erro ao buscar dados por tipo:', err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [casosPorTipo]);

  return { casosPorTipo };
}

// Hook embutido: resumo dashboard
export function useResumoDashboard() {
  const [dados, setDados] = useState({
    casosEmAndamento: 0,
    casosFinalizados: 0,
    casosArquivados: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { porStatus } = await AxiosDashboardData();

        const normalizar = (texto: string) => texto.toLowerCase().trim();

        const andamento = porStatus.find((s: any) => normalizar(s.status).includes('andamento'))?.total || 0;
        const finalizados = porStatus.find((s: any) => normalizar(s.status).includes('finalizado'))?.total || 0;
        const arquivados = porStatus.find((s: any) => normalizar(s.status).includes('arquivado'))?.total || 0;

        if (
          andamento !== dados.casosEmAndamento ||
          finalizados !== dados.casosFinalizados ||
          arquivados !== dados.casosArquivados
        ) {
          setDados({
            casosEmAndamento: andamento,
            casosFinalizados: finalizados,
            casosArquivados: arquivados,
          });
        }
      } catch (err) {
        console.error('Erro ao atualizar dados do dashboard:', err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [dados]);

  return dados;
}