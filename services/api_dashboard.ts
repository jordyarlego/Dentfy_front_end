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

// Hook para casos por tipo com filtros
export function useCasosPorTipo(filtroPeriodo: string = 'todos', filtroSexo: string = 'todos') {
  const [casosPorTipo, setCasosPorTipo] = useState<CasoTipo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      console.log('Buscando dados por tipo com filtros:', { filtroPeriodo, filtroSexo });
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        console.log('Token disponível:', !!token);
        
        const response = await api.get<{ data: TipoItem[] }>("/api/dashboard/casos-por-tipo", {
          params: {
            periodo: filtroPeriodo,
            sexo: filtroSexo
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        console.log('Resposta completa da API (casos por tipo):', response);
        console.log('Status da resposta:', response.status);
        console.log('Headers da resposta:', response.headers);
        console.log('Dados da resposta:', response.data);

        if (!response.data || !response.data.data) {
          console.error('Resposta da API inválida:', response.data);
          setCasosPorTipo([]);
          return;
        }

        const novosDados = response.data.data
          .filter((item: TipoItem) => {
            console.log('Processando item:', item);
            return item.tipo !== null;
          })
          .map((item: TipoItem) => ({
            tipo: item.tipo,
            quantidade: item.total,
          }))
          .sort((a: CasoTipo, b: CasoTipo) => a.tipo.localeCompare(b.tipo));

        console.log('Dados processados (casos por tipo):', novosDados);
        setCasosPorTipo(novosDados);
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error('Erro detalhado ao buscar dados por tipo:', error);
          if (error.response) {
            console.error('Resposta de erro:', error.response.data);
            console.error('Status do erro:', error.response.status);
          }
        } else {
          console.error('Erro desconhecido:', error);
        }
        setCasosPorTipo([]);
      } finally {
        console.log('Finalizando carregamento, isLoading = false');
        setIsLoading(false);
      }
    };

    fetchData();
  }, [filtroPeriodo, filtroSexo]);

  return { casosPorTipo, isLoading };
}

// Hook para resumo do dashboard com filtros
export function useResumoDashboard(filtroPeriodo: string = 'todos', filtroSexo: string = 'todos') {
  const [dados, setDados] = useState<ResumoDashboard>({
    casosEmAndamento: 0,
    casosFinalizados: 0,
    casosArquivados: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      console.log('Buscando resumo com filtros:', { filtroPeriodo, filtroSexo });
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await api.get<{ porStatus: StatusItem[] }>("/api/dashboard/resumo", {
          params: {
            periodo: filtroPeriodo,
            sexo: filtroSexo
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
  }, [filtroPeriodo, filtroSexo]);

  return { ...dados, isLoading };
}

// Hook para casos por sexo com filtros
export function useCasosPorSexo(filtroPeriodo: string = 'todos') {
  const [casosPorSexo, setCasosPorSexo] = useState<{ masculino: number; feminino: number; outro: number }>({
    masculino: 0,
    feminino: 0,
    outro: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      console.log('Buscando dados por sexo com filtros:', { filtroPeriodo });
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await api.get<{ data: SexoItem[] }>("/api/dashboard/casos-por-sexo", {
          params: {
            periodo: filtroPeriodo
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.data || !response.data.data) {
          console.error('Resposta da API inválida:', response.data);
          setCasosPorSexo({ masculino: 0, feminino: 0, outro: 0 });
          return;
        }

        const dados = response.data.data.reduce((acc, item) => {
          const sexo = item.sexo.toLowerCase();
          if (sexo === 'masculino') acc.masculino = item.total;
          else if (sexo === 'feminino') acc.feminino = item.total;
          else acc.outro = item.total;
          return acc;
        }, { masculino: 0, feminino: 0, outro: 0 });

        setCasosPorSexo(dados);
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error('Erro ao buscar dados por sexo:', error);
        } else {
          console.error('Erro desconhecido:', error);
        }
        setCasosPorSexo({ masculino: 0, feminino: 0, outro: 0 });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [filtroPeriodo]);

  return { ...casosPorSexo, isLoading };
}

// Hook para casos por etnia com filtros
export function useCasosPorEtnia(filtroPeriodo: string = 'todos', filtroSexo: string = 'todos') {
  const [casosPorEtnia, setCasosPorEtnia] = useState<{ branca: number; parda: number; preta: number; amarela: number; indigena: number; outro: number }>({
    branca: 0,
    parda: 0,
    preta: 0,
    amarela: 0,
    indigena: 0,
    outro: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      console.log('Buscando dados por etnia com filtros:', { filtroPeriodo, filtroSexo });
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await api.get<{ data: EtniaItem[] }>("/api/dashboard/casos-por-etnia", {
          params: {
            periodo: filtroPeriodo,
            sexo: filtroSexo
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (!response.data || !response.data.data) {
          console.error('Resposta da API inválida:', response.data);
          setCasosPorEtnia({ branca: 0, parda: 0, preta: 0, amarela: 0, indigena: 0, outro: 0 });
          return;
        }

        const dados = response.data.data.reduce((acc, item) => {
          const etnia = item.etnia.toLowerCase();
          switch(etnia) {
            case 'branca': acc.branca = item.total; break;
            case 'parda': acc.parda = item.total; break;
            case 'preta': acc.preta = item.total; break;
            case 'amarela': acc.amarela = item.total; break;
            case 'indigena': acc.indigena = item.total; break;
            default: acc.outro = item.total;
          }
          return acc;
        }, { branca: 0, parda: 0, preta: 0, amarela: 0, indigena: 0, outro: 0 });

        setCasosPorEtnia(dados);
      } catch (error) {
        if (error instanceof AxiosError) {
          console.error('Erro ao buscar dados por etnia:', error);
        } else {
          console.error('Erro desconhecido:', error);
        }
        setCasosPorEtnia({ branca: 0, parda: 0, preta: 0, amarela: 0, indigena: 0, outro: 0 });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [filtroPeriodo, filtroSexo]);

  return { ...casosPorEtnia, isLoading };
}