import { useState, useEffect } from 'react';
import api from "../lib/axios";
import { AxiosError } from 'axios';

interface ResumoDashboard {
  casosEmAndamento: number;
  casosFinalizados: number;
  casosArquivados: number;
}

interface CasoTipo {
  tipo: string;
  quantidade: number;
}

interface StatusItem {
  status: string;
  total: number;
}

interface TipoItem {
  tipo: string;
  total: number;
}

interface SexoItem {
  sexo: string;
  total: number;
}

interface EtniaItem {
  etnia: string;
  total: number;
}

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

function removerAcentos(texto: string): string {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function ajustarEtniaParaEnvio(etnia: string): string {
  const mapaEtnia: Record<string, string> = {
    indigena: 'Indígena',
    pardo: 'Pardo',
    preto: 'Preto',
    branco: 'Branco',
    outro: 'Outro',
    todos: 'todos'
  };
const etniaNormalizada = removerAcentos(etnia).toLowerCase();
  return mapaEtnia[etniaNormalizada] || etnia;
}
// Hook para casos por tipo com filtros
export function useCasosPorTipo(filtroPeriodo: string = 'todos', filtroSexo: string = 'todos', filtroEtnia: string = 'todos') {
  const [casosPorTipo, setCasosPorTipo] = useState<CasoTipo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await api.get("/api/dashboard/resumo", {
          params: { 
            periodo: filtroPeriodo, 
            sexo: filtroSexo,
            etnia: ajustarEtniaParaEnvio(filtroEtnia)
          },
          headers: { Authorization: `Bearer ${token}` }
        });

        const { porTipo } = response.data;

        const dados = porTipo.map((item: TipoItem) => ({
          tipo: item.tipo,
          quantidade: item.total
        }));

        setCasosPorTipo(dados);
      } catch (error) {
        console.error('Erro ao buscar casos por tipo:', error);
        setCasosPorTipo([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [filtroPeriodo, filtroSexo, filtroEtnia]);

  return { casosPorTipo, isLoading };
}


// Hook para resumo do dashboard com filtros
export function useResumoDashboard(filtroPeriodo: string = 'todos', filtroSexo: string = 'todos', filtroEtnia: string = 'todos') {
  const [dados, setDados] = useState<ResumoDashboard>({
    casosEmAndamento: 0,
    casosFinalizados: 0,
    casosArquivados: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      console.log('Buscando resumo com filtros:', { filtroPeriodo, filtroSexo, filtroEtnia });
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await api.get<{ porStatus: StatusItem[] }>("/api/dashboard/resumo", {
          params: {
            periodo: filtroPeriodo,
            sexo: filtroSexo,
            etnia: ajustarEtniaParaEnvio(filtroEtnia)
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log('Resposta da API (resumo):', response.data);

        const { porStatus } = response.data;
        const normalizar = (texto: string) => texto.toLowerCase().trim();

        const andamento = porStatus.find((s: StatusItem) => normalizar(s.status).includes('andamento'))?.total || 0;
        const finalizados = porStatus.find((s: StatusItem) => normalizar(s.status).includes('finalizado'))?.total || 0;
        const arquivados = porStatus.find((s: StatusItem) => normalizar(s.status).includes('arquivado'))?.total || 0;

        const novosDados = {
          casosEmAndamento: andamento,
          casosFinalizados: finalizados,
          casosArquivados: arquivados,
        };

        console.log('Dados processados (resumo):', novosDados);
        setDados(novosDados);
      } catch (err) {
        console.error('Erro ao atualizar dados do dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [filtroPeriodo, filtroSexo, filtroEtnia]);

  return { ...dados, isLoading };
}

// Hook para casos por sexo com filtros
export function useCasosPorSexo(filtroPeriodo: string = 'todos', filtroSexo: string = 'todos', filtroEtnia: string = 'todos') {
  const [casosPorSexo, setCasosPorSexo] = useState({ masculino: 0, feminino: 0, outro: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await api.get("/api/dashboard/resumo", {
          params: {
            periodo: filtroPeriodo,
            sexo: filtroSexo,
            etnia: ajustarEtniaParaEnvio(filtroEtnia)
          },
          headers: { Authorization: `Bearer ${token}` }
        });

        const { porSexo } = response.data;

        const dados = porSexo.reduce((acc: any, item: any) => {
          const sexo = item.sexo?.toLowerCase() || 'outro';
          const total = item.total || 0;

          if (sexo === 'masculino') acc.masculino += total;
          else if (sexo === 'feminino') acc.feminino += total;
          else acc.outro += total;

          return acc;
        }, { masculino: 0, feminino: 0, outro: 0 });
        setCasosPorSexo(dados);
      } catch (error) {
        console.error('Erro ao buscar casos por sexo:', error);
        setCasosPorSexo({ masculino: 0, feminino: 0, outro: 0 });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [filtroPeriodo, filtroSexo, filtroEtnia]); // agora escuta todos

  return { ...casosPorSexo, isLoading };
}
// Hook para casos por etnia com filtros
export function useCasosPorEtnia(
  filtroPeriodo: string = 'todos',
  filtroSexo: string = 'todos',
  filtroEtnia: string = 'todos'  
) {
  const [casosPorEtnia, setCasosPorEtnia] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('token');
      const etniaParam = ajustarEtniaParaEnvio(filtroEtnia);

      console.log('Parâmetros da requisição:', {
        periodo: filtroPeriodo,
        sexo: filtroSexo,
        etnia: etniaParam
      });

      const response = await api.get("/api/dashboard/resumo", {
        params: {
          periodo: filtroPeriodo,
          sexo: filtroSexo,
          etnia: etniaParam,
        },
        headers: { Authorization: `Bearer ${token}` }
      });

      console.log('Resposta da API por etnia:', response.data);

      const { porEtnia = [] } = response.data;

      const dados: Record<string, number> = {};

      porEtnia.forEach((item: EtniaItem) => {
        const etnia = item.etnia || 'Outro';
        const total = item.total || 0;

        if (total > 0) {
          dados[etnia] = total;
        }
      });

      setCasosPorEtnia(dados);
    } catch (error) {
      console.error('Erro ao buscar casos por etnia:', error);
      setCasosPorEtnia({});
    } finally {
      setIsLoading(false);
    }
  };

  fetchData();
}, [filtroPeriodo, filtroSexo, filtroEtnia]);
  return { casosPorEtnia, isLoading };
}


