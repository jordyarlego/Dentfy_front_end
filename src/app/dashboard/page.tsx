<<<<<<< Updated upstream
// Novo dashboard.tsx usando os novos endpoints e filtros globais
=======
// Dashboard com foco visual - mantendo conexão com backend
>>>>>>> Stashed changes
'use client';

import { buscarDistribuicaoTipos } from '../../../services/api_dashboard_py';
import { Pie } from 'react-chartjs-2';
import { ArcElement } from 'chart.js';
ChartJS.register(ArcElement);
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import dynamic from 'next/dynamic';
import 'leaflet/dist/leaflet.css';
import { useEffect, useState } from 'react';
import SidebarPerito from '../../components/SidebarPerito';
import HeaderPerito from '../../components/HeaderPerito';
<<<<<<< Updated upstream
=======
import { 
  ChartBarIcon, 
  UserIcon, 
  CalendarIcon,
  MagnifyingGlassIcon,
  BeakerIcon,
  PresentationChartLineIcon,
  MapIcon,
  ArrowTrendingUpIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline';
>>>>>>> Stashed changes
const Mapa = dynamic(() => import('../../components/Mapa'), { ssr: false });
import {
  buscarCasos,
  buscarCoeficientes,
<<<<<<< Updated upstream
  buscarCorrelacoes,
=======
>>>>>>> Stashed changes
  buscarAcuracia,
  buscarProbabilidadePorIdade,
  buscarLocalizacoes,
  fazerPredicao
} from '../../../services/api_dashboard_py';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
);



export default function Dashboard() {
  const [filtros, setFiltros] = useState({
    sexo: 'todos',
    etnia: 'todos',
<<<<<<< Updated upstream
    idadeMin: null,
    idadeMax: null,
    dataInicio: null,
    dataFim: null,
  });

  const [casos, setCasos] = useState([]);
  const [coefs, setCoefs] = useState<any>({});
  const [correlacao, setCorrelacao] = useState<any>(null);
  const [acuracia, setAcuracia] = useState<any>(null);
  const [probIdade, setProbIdade] = useState<any[]>([]);
  const [localizacoes, setLocalizacoes] = useState<any[]>([]);
  const [pizzaData, setPizzaData] = useState<any>(null);
  const [resultado, setResultado] = useState<any>(null);

  useEffect(() => {
    async function carregar() {
      try {
        const [c, co, corr, acc, prob, locs, pizza] = await Promise.all([
          buscarCasos(filtros),
          buscarCoeficientes(),
          buscarCorrelacoes(),
          buscarAcuracia(filtros),
          buscarProbabilidadePorIdade(filtros),
          buscarLocalizacoes(filtros),
          buscarDistribuicaoTipos(filtros),
        ]);
        setCasos(c);
        setCoefs(co);
        setCorrelacao(corr);
        setAcuracia(acc);
        setProbIdade(prob);
        setLocalizacoes(locs);
        setPizzaData(pizza); // <- crie o useState para armazenar

      } catch (e) {
        console.error("Erro ao carregar dados do dashboard:", e);
      }
    }
    carregar();
  }, [filtros]);

  const graficoCoefs = {
    labels: Object.keys(coefs),
    datasets: [
      {
        label: 'Importância das Variáveis',
        data: Object.values(coefs),
        backgroundColor: '#5d759c',
      },
    ],
  };
=======
    idadeMin: undefined as number | undefined,
    idadeMax: undefined as number | undefined,
    dataInicio: undefined as string | undefined,
    dataFim: undefined as string | undefined,
  });

  const [casos, setCasos] = useState<Array<{status: string, [key: string]: any}>>([]);
  const [coefs, setCoefs] = useState<Record<string, number>>({});
  const [acuracia, setAcuracia] = useState<{classes: string[], precisao: number[]} | null>(null);
  const [probIdade, setProbIdade] = useState<Array<{faixa: string, probabilidades: Record<string, number>}>>([]);
  const [localizacoes, setLocalizacoes] = useState<Array<{lat: number, lon: number, bairro: string}>>([]);
  const [pizzaData, setPizzaData] = useState<Record<string, number> | null>(null);
  const [resultado, setResultado] = useState<{classe_predita: string, probabilidades: Record<string, number>} | null>(null);
>>>>>>> Stashed changes

  const [input, setInput] = useState({
    idade: 30,
    etnia: 'Branca',
    localizacao: 'Centro',
  });

<<<<<<< Updated upstream
  const graficoPizza = pizzaData && {
    labels: Object.keys(pizzaData),
    datasets: [
      {
        data: Object.values(pizzaData),
        backgroundColor: ['#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f'],
=======
  // Garantir que o componente só renderize no cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    async function carregar() {
      try {
        const [c, co, acc, prob, locs, pizza] = await Promise.all([
          buscarCasos(filtros),
          buscarCoeficientes(),
          buscarAcuracia(filtros),
          buscarProbabilidadePorIdade(filtros),
          buscarLocalizacoes(filtros),
          buscarDistribuicaoTipos(filtros),
        ]);
        setCasos(c);
        setCoefs(co);
        setAcuracia(acc);
        setProbIdade(prob);
        setLocalizacoes(locs);
        setPizzaData(pizza);

      } catch (e) {
        console.error("Erro ao carregar dados do dashboard:", e);
      }
    }
    carregar();
  }, [filtros]);

  const graficoCoefs = {
    labels: Object.keys(coefs),
    datasets: [
      {
        label: 'Importância das Variáveis',
        data: Object.values(coefs),
        backgroundColor: 'rgba(234, 179, 8, 0.8)',
        borderColor: 'rgba(234, 179, 8, 1)',
        borderWidth: 3,
        borderRadius: 8,
        borderSkipped: false,
        hoverBackgroundColor: 'rgba(234, 179, 8, 1)',
      },
    ],
  };

  const graficoPizza = pizzaData && {
    labels: Object.keys(pizzaData),
    datasets: [
      {
        data: Object.values(pizzaData),
        backgroundColor: [
          'rgba(234, 179, 8, 0.8)',    // Amber
          'rgba(34, 197, 94, 0.8)',    // Green
          'rgba(239, 68, 68, 0.8)',    // Red
          'rgba(59, 130, 246, 0.8)',   // Blue
          'rgba(168, 85, 247, 0.8)',   // Purple
        ],
        borderColor: [
          'rgba(234, 179, 8, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(168, 85, 247, 1)',
        ],
        borderWidth: 3,
        hoverBorderWidth: 5,
        hoverOffset: 10,
>>>>>>> Stashed changes
      },
    ],
  };

  const graficoAcuracia = acuracia && {
    labels: acuracia.classes,
    datasets: [
      {
        label: 'Acurácia por Tipo de Caso (%)',
        data: acuracia.precisao,
<<<<<<< Updated upstream
        backgroundColor: '#7b90b1',
=======
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 3,
        borderRadius: 8,
        borderSkipped: false,
        hoverBackgroundColor: 'rgba(34, 197, 94, 1)',
>>>>>>> Stashed changes
      },
    ],
  };

<<<<<<< Updated upstream
=======
  const graficoProbIdade = {
    labels: probIdade.map((d) => d.faixa),
    datasets:
      probIdade.length > 0
        ? Object.keys(probIdade[0].probabilidades).map((classe, idx) => ({
          label: classe,
          data: probIdade.map((d) => d.probabilidades[classe]),
          borderColor: `hsl(${idx * 60 + 45}, 70%, 60%)`,
          backgroundColor: `hsla(${idx * 60 + 45}, 70%, 60%, 0.1)`,
          fill: true,
          tension: 0.4,
          borderWidth: 3,
          pointBackgroundColor: `hsl(${idx * 60 + 45}, 70%, 60%)`,
          pointBorderColor: '#0E1A26',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
        }))
        : [],
  };

>>>>>>> Stashed changes
  async function handlePredizer() {
    try {
      const res = await fazerPredicao(input);
      setResultado(res);
    } catch (e) {
      console.error("Erro na predição:", e);
<<<<<<< Updated upstream
=======
    }
  }

  // Configurações comuns dos gráficos
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: 'rgba(254, 243, 199, 0.9)',
          font: {
            size: 12,
            weight: 'bold' as const
          },
          padding: 20,
          usePointStyle: true,
          pointStyle: 'circle'
        },
        position: 'top' as const,
      },
      tooltip: {
        backgroundColor: 'rgba(18, 33, 43, 0.95)',
        titleColor: 'rgba(254, 243, 199, 1)',
        bodyColor: 'rgba(254, 243, 199, 0.8)',
        borderColor: 'rgba(234, 179, 8, 0.5)',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: true,
        padding: 12,
        titleFont: {
          size: 14,
          weight: 'bold' as const
        },
        bodyFont: {
          size: 12
        }
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart' as const,
    },
    scales: {
      y: {
        ticks: {
          color: 'rgba(254, 243, 199, 0.8)',
          font: {
            size: 11
          }
        },
        grid: {
          color: 'rgba(254, 243, 199, 0.1)',
          lineWidth: 1
        },
        border: {
          color: 'rgba(254, 243, 199, 0.2)'
        }
      },
      x: {
        ticks: {
          color: 'rgba(254, 243, 199, 0.8)',
          font: {
            size: 11
          }
        },
        grid: {
          color: 'rgba(254, 243, 199, 0.1)',
          lineWidth: 1
        },
        border: {
          color: 'rgba(254, 243, 199, 0.2)'
        }
      }
>>>>>>> Stashed changes
    }
  }

  const graficoProbIdade = {
    labels: probIdade.map((d) => d.faixa),
    datasets:
      probIdade.length > 0
        ? Object.keys(probIdade[0].probabilidades).map((classe, idx) => ({
          label: classe,
          data: probIdade.map((d) => d.probabilidades[classe]),
          borderColor: `hsl(${idx * 60}, 70%, 60%)`,
          fill: false,
        }))
        : [],
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <SidebarPerito />
      <div className="flex-1 flex flex-col overflow-hidden">
        <HeaderPerito />
<<<<<<< Updated upstream
        <main className="p-4 space-y-8 overflow-y-auto">
          <h1 className="text-2xl font-bold text-white">Dashboard com Modelos</h1>
=======
        <main className="p-6 space-y-6 overflow-y-auto bg-gradient-to-br from-[#0E1A26] via-[#0E1A26] to-[#12212B]">
          
          {/* Header do Dashboard */}
          <div className="animate-fadeIn">
            <h1 className="text-4xl font-bold text-amber-100 mb-2">
              Dashboard <span className="text-amber-500">Analítico</span>
            </h1>
            <p className="text-amber-100/70 text-lg">
              Análise preditiva e estatísticas dos casos criminais
            </p>
          </div>

          {/* Cards de Estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-slideIn">
            <div className="bg-gradient-to-br from-[#12212B]/80 to-[#0E1A26]/80 backdrop-blur-sm border border-cyan-900/30 rounded-xl p-6 hover:border-amber-500/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100/70 text-sm font-medium">Total de Casos</p>
                  <p className="text-3xl font-bold text-amber-100">{casos.length}</p>
                </div>
                <div className="p-3 bg-amber-500/20 rounded-lg">
                  <DocumentTextIcon className="h-8 w-8 text-amber-500" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-green-400 text-sm">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                Dados em tempo real
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#12212B]/80 to-[#0E1A26]/80 backdrop-blur-sm border border-cyan-900/30 rounded-xl p-6 hover:border-amber-500/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100/70 text-sm font-medium">Casos Resolvidos</p>
                  <p className="text-3xl font-bold text-amber-100">{casos.filter((c) => c.status === 'resolvido').length}</p>
                </div>
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <ChartBarIcon className="h-8 w-8 text-green-500" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-green-400 text-sm">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                Atualizado
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#12212B]/80 to-[#0E1A26]/80 backdrop-blur-sm border border-cyan-900/30 rounded-xl p-6 hover:border-amber-500/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100/70 text-sm font-medium">Taxa de Acurácia</p>
                  <p className="text-3xl font-bold text-amber-100">
                    {acuracia ? Math.round(acuracia.precisao.reduce((a: number, b: number) => a + b, 0) / acuracia.precisao.length) : 0}%
                  </p>
                </div>
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <PresentationChartLineIcon className="h-8 w-8 text-blue-500" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-green-400 text-sm">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                Modelo ativo
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#12212B]/80 to-[#0E1A26]/80 backdrop-blur-sm border border-cyan-900/30 rounded-xl p-6 hover:border-amber-500/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100/70 text-sm font-medium">Localizações</p>
                  <p className="text-3xl font-bold text-amber-100">{localizacoes.length}</p>
                </div>
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <MapIcon className="h-8 w-8 text-purple-500" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-green-400 text-sm">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                Mapeadas
              </div>
            </div>
          </div>
>>>>>>> Stashed changes

          {/* Filtros */}
          <div className="bg-white p-4 rounded flex flex-wrap gap-4 items-center">
            <select
              value={filtros.sexo}
              onChange={(e) => setFiltros({ ...filtros, sexo: e.target.value })}
            >
              <option value="todos">Todos os Sexos</option>
              <option value="masculino">Masculino</option>
              <option value="feminino">Feminino</option>
            </select>
            <select
              value={filtros.etnia}
              onChange={(e) => setFiltros({ ...filtros, etnia: e.target.value })}
            >
              <option value="todos">Todas as Etnias</option>
              <option value="Branca">Branca</option>
              <option value="Preta">Preta</option>
              <option value="Parda">Parda</option>
            </select>
            <DatePicker
              selected={filtros.dataInicio ? new Date(filtros.dataInicio) : null}
              onChange={(date) => setFiltros({ ...filtros, dataInicio: date?.toISOString().split('T')[0] })}
              placeholderText="Data Início"
            />
            <DatePicker
              selected={filtros.dataFim ? new Date(filtros.dataFim) : null}
              onChange={(date) => setFiltros({ ...filtros, dataFim: date?.toISOString().split('T')[0] })}
              placeholderText="Data Fim"
            />
          </div>

          <div className="bg-white p-4 rounded space-y-4">
            <h2 className="text-lg font-semibold">Predição de Tipo de Caso</h2>

            <input
              type="number"
              placeholder="Idade"
              value={input.idade}
              onChange={(e) => setInput({ ...input, idade: Number(e.target.value) })}
              className="border p-2 rounded w-full"
            />
            <select
              value={input.etnia}
              onChange={(e) => setInput({ ...input, etnia: e.target.value })}
              className="border p-2 rounded w-full"
            >
              <option value="Branca">Branca</option>
              <option value="Preta">Preta</option>
              <option value="Parda">Parda</option>
              <option value="Amarela">Amarela</option>
              <option value="Indígena">Indígena</option>
            </select>
            <select
              value={input.localizacao}
              onChange={(e) => setInput({ ...input, localizacao: e.target.value })}
              className="border p-2 rounded w-full"
            >
              <option value="Centro">Centro</option>
              <option value="Bairro A">Bairro A</option>
              <option value="Bairro B">Bairro B</option>
              <option value="Zona Rural">Zona Rural</option>
            </select>

            <button
              onClick={handlePredizer}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Fazer Predição
            </button>

            {resultado && (
              <div className="mt-4 text-sm text-gray-800">
                <p><strong>Classe Predita:</strong> {resultado.classe_predita}</p>
                <p><strong>Probabilidades:</strong></p>
                <ul className="list-disc ml-4">
                  {Object.entries(resultado.probabilidades).map(([classe, prob]: any) => (
                    <li key={classe}>
                      {classe}: {(prob * 100).toFixed(2)}%
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

<<<<<<< Updated upstream
          <div className="bg-white rounded p-4">
            <h2 className="text-lg font-semibold mb-2">Distribuição por Tipo de Caso</h2>
            {graficoPizza && <Pie data={graficoPizza} />}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded p-4">
              <h2 className="text-lg font-semibold mb-2">Coeficientes do Modelo</h2>
              <Bar data={graficoCoefs} />
            </div>

            <div className="bg-white rounded p-4">
              <h2 className="text-lg font-semibold mb-2">Acurácia por Tipo de Caso</h2>
              {graficoAcuracia && <Bar data={graficoAcuracia} />}
            </div>
          </div>

          <div className="bg-white rounded p-4">
            <h2 className="text-lg font-semibold mb-2">Probabilidade por Faixa Etária</h2>
            <Line data={graficoProbIdade} />
          </div>

          <div className="bg-white rounded p-4">
            <h2 className="text-lg font-semibold mb-2">Mapa de Localizações</h2>
            <Mapa pontos={localizacoes} />
=======
          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico de Pizza */}
            <div className="bg-gradient-to-br from-[#12212B]/60 to-[#0E1A26]/60 backdrop-blur-sm border border-cyan-900/30 rounded-xl p-6 animate-slideIn hover:border-amber-500/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-amber-500/20 rounded-lg">
                  <ChartBarIcon className="h-6 w-6 text-amber-500" />
                </div>
                <h2 className="text-xl font-semibold text-amber-100">Distribuição por Tipo de Caso</h2>
              </div>
              <div className="h-80 flex items-center justify-center">
                {graficoPizza ? (
                  <Pie 
                    data={graficoPizza}
                    options={{
                      ...chartOptions,
                      plugins: {
                        ...chartOptions.plugins,
                        legend: {
                          ...chartOptions.plugins.legend,
                          position: 'bottom' as const,
                        }
                      }
                    }}
                  />
                ) : (
                  <div className="text-amber-100/50 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
                    <p>Carregando dados...</p>
                  </div>
                )}
              </div>
            </div>

            {/* Gráfico de Acurácia */}
            <div className="bg-gradient-to-br from-[#12212B]/60 to-[#0E1A26]/60 backdrop-blur-sm border border-cyan-900/30 rounded-xl p-6 animate-slideIn hover:border-amber-500/30 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-green-500/20 rounded-lg">
                  <PresentationChartLineIcon className="h-6 w-6 text-green-500" />
                </div>
                <h2 className="text-xl font-semibold text-amber-100">Acurácia por Tipo de Caso</h2>
              </div>
              <div className="h-80">
                {graficoAcuracia ? (
                  <Bar 
                    data={graficoAcuracia}
                    options={chartOptions}
                  />
                ) : (
                  <div className="text-amber-100/50 text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
                    <p>Carregando dados...</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Gráfico de Coeficientes */}
          <div className="bg-gradient-to-br from-[#12212B]/60 to-[#0E1A26]/60 backdrop-blur-sm border border-cyan-900/30 rounded-xl p-6 animate-slideIn hover:border-amber-500/30 transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <ChartBarIcon className="h-6 w-6 text-amber-500" />
              </div>
              <h2 className="text-xl font-semibold text-amber-100">Coeficientes do Modelo</h2>
            </div>
            <div className="h-80">
              {Object.keys(coefs).length > 0 ? (
                <Bar 
                  data={graficoCoefs}
                  options={chartOptions}
                />
              ) : (
                <div className="text-amber-100/50 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
                  <p>Carregando dados...</p>
                </div>
              )}
            </div>
          </div>

          {/* Gráfico de Probabilidade por Idade */}
          <div className="bg-gradient-to-br from-[#12212B]/60 to-[#0E1A26]/60 backdrop-blur-sm border border-cyan-900/30 rounded-xl p-6 animate-slideIn hover:border-amber-500/30 transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-500/20 rounded-lg">
                <PresentationChartLineIcon className="h-6 w-6 text-blue-500" />
              </div>
              <h2 className="text-xl font-semibold text-amber-100">Probabilidade por Faixa Etária</h2>
            </div>
            <div className="h-80">
              {probIdade.length > 0 ? (
                <Line 
                  data={graficoProbIdade}
                  options={chartOptions}
                />
              ) : (
                <div className="text-amber-100/50 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
                  <p>Carregando dados...</p>
                </div>
              )}
            </div>
          </div>

          {/* Mapa */}
          <div className="bg-gradient-to-br from-[#12212B]/60 to-[#0E1A26]/60 backdrop-blur-sm border border-cyan-900/30 rounded-xl p-6 animate-slideIn hover:border-amber-500/30 transition-all duration-300">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <MapIcon className="h-6 w-6 text-purple-500" />
              </div>
              <h2 className="text-xl font-semibold text-amber-100">Mapa de Localizações</h2>
            </div>
            <div className="h-96 rounded-lg overflow-hidden border border-cyan-900/30">
              {localizacoes.length > 0 ? (
                <Mapa pontos={localizacoes} />
              ) : (
                <div className="text-amber-100/50 text-center h-full flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
                  <p>Carregando mapa...</p>
                </div>
              )}
            </div>
>>>>>>> Stashed changes
          </div>
        </main>
      </div>
    </div>
  );

}
