// Dashboard com foco visual - dados mock para demonstração
'use client';

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
import { 
  ChartBarIcon, 
  UserIcon, 
  CalendarIcon,
  MagnifyingGlassIcon,
  BeakerIcon,
  PresentationChartLineIcon,
  MapIcon,
  ArrowTrendingUpIcon,
  DocumentTextIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
const Mapa = dynamic(() => import('../../components/Mapa'), { ssr: false });
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
  const [mounted, setMounted] = useState(false);
  const [filtros, setFiltros] = useState({
    sexo: 'todos',
    etnia: 'todos',
    dataInicio: undefined as string | undefined,
    dataFim: undefined as string | undefined,
  });

  const [input, setInput] = useState({
    idade: 30,
    etnia: 'Branca',
    localizacao: 'Centro',
  });

  const [resultado, setResultado] = useState<{ classe_predita: string; probabilidades: Record<string, number> } | null>(null);

  // Garantir que o componente só renderize no cliente
  useEffect(() => {
    setMounted(true);
  }, []);

  // Dados mock para demonstração visual
  const dadosMock = {
    // Distribuição por tipo de caso
    pizzaData: {
      'Furto': 45,
      'Assalto': 25,
      'Homicídio': 15,
      'Tráfico': 10,
      'Outros': 5
    },

    // Acurácia por tipo de caso
    acuracia: {
      classes: ['Furto', 'Assalto', 'Homicídio', 'Tráfico', 'Outros'],
      precisao: [92, 88, 95, 87, 85]
    },

    // Coeficientes do modelo
    coefs: {
      'Idade': 0.85,
      'Etnia': 0.72,
      'Localização': 0.68,
      'Histórico': 0.91,
      'Perfil': 0.76
    },

    // Probabilidade por faixa etária
    probIdade: [
      { faixa: '18-25', probabilidades: { 'Furto': 0.4, 'Assalto': 0.3, 'Homicídio': 0.1, 'Tráfico': 0.15, 'Outros': 0.05 } },
      { faixa: '26-35', probabilidades: { 'Furto': 0.35, 'Assalto': 0.35, 'Homicídio': 0.15, 'Tráfico': 0.1, 'Outros': 0.05 } },
      { faixa: '36-45', probabilidades: { 'Furto': 0.3, 'Assalto': 0.25, 'Homicídio': 0.2, 'Tráfico': 0.2, 'Outros': 0.05 } },
      { faixa: '46-55', probabilidades: { 'Furto': 0.25, 'Assalto': 0.2, 'Homicídio': 0.25, 'Tráfico': 0.25, 'Outros': 0.05 } },
      { faixa: '56+', probabilidades: { 'Furto': 0.2, 'Assalto': 0.15, 'Homicídio': 0.3, 'Tráfico': 0.3, 'Outros': 0.05 } }
    ],

    // Localizações mock
    localizacoes: [
      { lat: -23.5505, lon: -46.6333, bairro: 'Centro' },
      { lat: -23.5629, lon: -46.6544, bairro: 'Vila Madalena' },
      { lat: -23.5882, lon: -46.6324, bairro: 'Pinheiros' },
      { lat: -23.5505, lon: -46.6333, bairro: 'Itaim Bibi' },
      { lat: -23.5629, lon: -46.6544, bairro: 'Jardins' }
    ]
  };

  // Configurações dos gráficos com tema do projeto
  const graficoPizza = {
    labels: Object.keys(dadosMock.pizzaData),
    datasets: [
      {
        data: Object.values(dadosMock.pizzaData),
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
      },
    ],
  };

  const graficoAcuracia = {
    labels: dadosMock.acuracia.classes,
    datasets: [
      {
        label: 'Acurácia por Tipo de Caso (%)',
        data: dadosMock.acuracia.precisao,
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 3,
        borderRadius: 8,
        borderSkipped: false,
        hoverBackgroundColor: 'rgba(34, 197, 94, 1)',
      },
    ],
  };

  const graficoCoefs = {
    labels: Object.keys(dadosMock.coefs),
    datasets: [
      {
        label: 'Importância das Variáveis',
        data: Object.values(dadosMock.coefs),
        backgroundColor: 'rgba(234, 179, 8, 0.8)',
        borderColor: 'rgba(234, 179, 8, 1)',
        borderWidth: 3,
        borderRadius: 8,
        borderSkipped: false,
        hoverBackgroundColor: 'rgba(234, 179, 8, 1)',
      },
    ],
  };

  const graficoProbIdade = {
    labels: dadosMock.probIdade.map((d) => d.faixa),
    datasets: Object.keys(dadosMock.probIdade[0].probabilidades).map((classe, idx) => ({
      label: classe,
      data: dadosMock.probIdade.map((d) => d.probabilidades[classe as keyof typeof d.probabilidades]),
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
    })),
  };

  // Função mock para predição
  const handlePredizer = () => {
    const mockResultado = {
      classe_predita: 'Furto',
      probabilidades: {
        'Furto': 0.45,
        'Assalto': 0.25,
        'Homicídio': 0.15,
        'Tráfico': 0.10,
        'Outros': 0.05
      }
    };
    setResultado(mockResultado);
  };

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
    }
  };

  // Não renderizar até que o componente esteja montado no cliente
  if (!mounted) {
    return (
      <div className="flex h-screen bg-[#0E1A26]">
        <SidebarPerito />
        <div className="flex-1 flex flex-col overflow-hidden">
          <HeaderPerito />
          <main className="p-4 space-y-8 overflow-y-auto">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#0E1A26]">
      <SidebarPerito />
      <div className="flex-1 flex flex-col overflow-hidden">
        <HeaderPerito />
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
                  <p className="text-3xl font-bold text-amber-100">1,247</p>
                </div>
                <div className="p-3 bg-amber-500/20 rounded-lg">
                  <DocumentTextIcon className="h-8 w-8 text-amber-500" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-green-400 text-sm">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                +12.5% este mês
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#12212B]/80 to-[#0E1A26]/80 backdrop-blur-sm border border-cyan-900/30 rounded-xl p-6 hover:border-amber-500/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100/70 text-sm font-medium">Casos Resolvidos</p>
                  <p className="text-3xl font-bold text-amber-100">892</p>
                </div>
                <div className="p-3 bg-green-500/20 rounded-lg">
                  <ChartBarIcon className="h-8 w-8 text-green-500" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-green-400 text-sm">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                +8.3% este mês
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#12212B]/80 to-[#0E1A26]/80 backdrop-blur-sm border border-cyan-900/30 rounded-xl p-6 hover:border-amber-500/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100/70 text-sm font-medium">Taxa de Acurácia</p>
                  <p className="text-3xl font-bold text-amber-100">89.4%</p>
                </div>
                <div className="p-3 bg-blue-500/20 rounded-lg">
                  <PresentationChartLineIcon className="h-8 w-8 text-blue-500" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-green-400 text-sm">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                +2.1% este mês
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#12212B]/80 to-[#0E1A26]/80 backdrop-blur-sm border border-cyan-900/30 rounded-xl p-6 hover:border-amber-500/50 transition-all duration-300 hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-amber-100/70 text-sm font-medium">Tempo Médio</p>
                  <p className="text-3xl font-bold text-amber-100">3.2d</p>
                </div>
                <div className="p-3 bg-purple-500/20 rounded-lg">
                  <ClockIcon className="h-8 w-8 text-purple-500" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-green-400 text-sm">
                <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
                -15.2% este mês
              </div>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-gradient-to-br from-[#12212B]/60 to-[#0E1A26]/60 backdrop-blur-sm border border-cyan-900/30 rounded-xl p-6 animate-slideIn">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <MagnifyingGlassIcon className="h-6 w-6 text-amber-500" />
              </div>
              <h2 className="text-xl font-semibold text-amber-100">Filtros de Análise</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-amber-100/80 flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  Sexo
                </label>
                <select
                  value={filtros.sexo}
                  onChange={(e) => setFiltros({ ...filtros, sexo: e.target.value })}
                  className="w-full bg-[#0E1A26] border border-cyan-900/30 rounded-lg px-4 py-3 text-amber-100 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-300 hover:border-amber-500/50"
                >
                  <option value="todos">Todos os Sexos</option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-amber-100/80 flex items-center gap-2">
                  <UserIcon className="h-4 w-4" />
                  Etnia
                </label>
                <select
                  value={filtros.etnia}
                  onChange={(e) => setFiltros({ ...filtros, etnia: e.target.value })}
                  className="w-full bg-[#0E1A26] border border-cyan-900/30 rounded-lg px-4 py-3 text-amber-100 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-300 hover:border-amber-500/50"
                >
                  <option value="todos">Todas as Etnias</option>
                  <option value="Branca">Branca</option>
                  <option value="Preta">Preta</option>
                  <option value="Parda">Parda</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-amber-100/80 flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Data Início
                </label>
                <DatePicker
                  selected={filtros.dataInicio ? new Date(filtros.dataInicio) : null}
                  onChange={(date) => setFiltros({ ...filtros, dataInicio: date?.toISOString().split('T')[0] })}
                  placeholderText="Selecione"
                  popperPlacement="top"
                  className="w-full bg-[#0E1A26] border border-cyan-900/30 rounded-lg px-4 py-3 text-amber-100 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-300 hover:border-amber-500/50"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-amber-100/80 flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  Data Fim
                </label>
                <DatePicker
                  selected={filtros.dataFim ? new Date(filtros.dataFim) : null}
                  onChange={(date) => setFiltros({ ...filtros, dataFim: date?.toISOString().split('T')[0] })}
                  placeholderText="Selecione"
                  popperPlacement="top"
                  className="w-full bg-[#0E1A26] border border-cyan-900/30 rounded-lg px-4 py-3 text-amber-100 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-300 hover:border-amber-500/50"
                />
              </div>
            </div>
          </div>

          {/* Seção de Predição */}
          <div className="bg-gradient-to-br from-[#12212B]/60 to-[#0E1A26]/60 backdrop-blur-sm border border-cyan-900/30 rounded-xl p-6 animate-slideIn">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-amber-500/20 rounded-lg">
                <BeakerIcon className="h-6 w-6 text-amber-500" />
              </div>
              <h2 className="text-xl font-semibold text-amber-100">Predição de Tipo de Caso</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="space-y-3">
                <label className="text-sm font-medium text-amber-100/80">Idade</label>
                <input
                  type="number"
                  placeholder="Digite a idade"
                  value={input.idade}
                  onChange={(e) => setInput({ ...input, idade: Number(e.target.value) })}
                  className="w-full bg-[#0E1A26] border border-cyan-900/30 rounded-lg px-4 py-3 text-amber-100 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-300 hover:border-amber-500/50"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-amber-100/80">Etnia</label>
                <select
                  value={input.etnia}
                  onChange={(e) => setInput({ ...input, etnia: e.target.value })}
                  className="w-full bg-[#0E1A26] border border-cyan-900/30 rounded-lg px-4 py-3 text-amber-100 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-300 hover:border-amber-500/50"
                >
                  <option value="Branca">Branca</option>
                  <option value="Preta">Preta</option>
                  <option value="Parda">Parda</option>
                  <option value="Amarela">Amarela</option>
                  <option value="Indígena">Indígena</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-amber-100/80">Localização</label>
                <select
                  value={input.localizacao}
                  onChange={(e) => setInput({ ...input, localizacao: e.target.value })}
                  className="w-full bg-[#0E1A26] border border-cyan-900/30 rounded-lg px-4 py-3 text-amber-100 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-300 hover:border-amber-500/50"
                >
                  <option value="Centro">Centro</option>
                  <option value="Bairro A">Bairro A</option>
                  <option value="Bairro B">Bairro B</option>
                  <option value="Zona Rural">Zona Rural</option>
                </select>
              </div>
            </div>

            <button
              onClick={handlePredizer}
              className="bg-gradient-to-r from-amber-500 to-amber-600 text-[#0E1A26] font-semibold px-8 py-4 rounded-lg hover:from-amber-600 hover:to-amber-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-amber-500/25 hover:shadow-xl"
            >
              Fazer Predição
            </button>

            {resultado && (
              <div className="mt-6 p-6 bg-gradient-to-br from-[#0E1A26]/80 to-[#12212B]/80 border border-amber-500/30 rounded-xl animate-feedbackEntry">
                <h3 className="text-xl font-semibold text-amber-100 mb-4">Resultado da Predição</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-amber-500/10 rounded-lg border border-amber-500/20">
                    <span className="text-amber-100 font-medium">Classe Predita:</span>
                    <span className="text-amber-500 font-bold text-lg">{resultado.classe_predita}</span>
                  </div>
                  <div>
                    <p className="font-medium text-amber-100 mb-3">Probabilidades:</p>
                    <div className="space-y-2">
                      {Object.entries(resultado.probabilidades).map(([classe, prob]) => (
                        <div key={classe} className="flex items-center justify-between p-3 bg-[#0E1A26]/50 rounded-lg border border-cyan-900/30">
                          <span className="text-amber-100/80">{classe}</span>
                          <div className="flex items-center gap-3">
                            <div className="w-20 bg-cyan-900/30 rounded-full h-2">
                              <div 
                                className="bg-gradient-to-r from-amber-500 to-amber-600 h-2 rounded-full transition-all duration-1000"
                                style={{ width: `${prob * 100}%` }}
                              ></div>
                            </div>
                            <span className="text-amber-500 font-semibold min-w-[60px]">{(prob * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

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
                <Bar 
                  data={graficoAcuracia}
                  options={chartOptions}
                />
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
              <Bar 
                data={graficoCoefs}
                options={chartOptions}
              />
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
              <Line 
                data={graficoProbIdade}
                options={chartOptions}
              />
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
              <Mapa pontos={dadosMock.localizacoes} />
            </div>
          </div>
        </main>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .animate-slideIn {
          animation: slideIn 0.6s ease-out forwards;
        }

        .animate-feedbackEntry {
          animation: feedbackEntry 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        /* Estilização do DatePicker */
        .react-datepicker-wrapper {
          width: 100%;
        }

        .react-datepicker__input-container input {
          background-color: #0E1A26 !important;
          border: 1px solid rgba(6, 78, 59, 0.3) !important;
          border-radius: 0.5rem !important;
          padding: 0.75rem 1rem !important;
          color: #fef3c7 !important;
          width: 100% !important;
          font-size: 14px !important;
        }

        .react-datepicker__input-container input:focus {
          border-color: #f59e0b !important;
          box-shadow: 0 0 0 2px rgba(245, 158, 11, 0.2) !important;
          outline: none !important;
        }

        .react-datepicker__input-container input:hover {
          border-color: rgba(245, 158, 11, 0.5) !important;
        }

        .react-datepicker {
          background-color: #12212B !important;
          border: 1px solid rgba(6, 78, 59, 0.3) !important;
          border-radius: 0.5rem !important;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3) !important;
          z-index: 9999 !important;
          position: relative !important;
        }

        .react-datepicker-popper {
          z-index: 9999 !important;
        }

        .react-datepicker__header {
          background-color: #0E1A26 !important;
          border-bottom: 1px solid rgba(6, 78, 59, 0.3) !important;
          border-radius: 0.5rem 0.5rem 0 0 !important;
        }

        .react-datepicker__current-month,
        .react-datepicker__day-name,
        .react-datepicker__day {
          color: #fef3c7 !important;
        }

        .react-datepicker__day:hover {
          background-color: #f59e0b !important;
          color: #0E1A26 !important;
        }

        .react-datepicker__day--selected {
          background-color: #f59e0b !important;
          color: #0E1A26 !important;
        }

        .react-datepicker__day--keyboard-selected {
          background-color: rgba(245, 158, 11, 0.3) !important;
          color: #fef3c7 !important;
        }

        .react-datepicker__navigation {
          color: #fef3c7 !important;
        }

        .react-datepicker__navigation:hover {
          color: #f59e0b !important;
        }
      `}</style>
    </div>
  );
}
