'use client';

import { Bar } from 'react-chartjs-2';
import { ScriptableContext } from 'chart.js';


import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CasoTipo {
  tipo: string;
  quantidade: number;
}

interface DashboardPeritoCasosMensaisProps {
  casos: CasoTipo[];
  isLoading?: boolean;
}

export default function DashboardPeritoCasosMensais({ casos, isLoading = false }: DashboardPeritoCasosMensaisProps) {
  console.log('DashboardPeritoCasosMensais - Props recebidas:', { casos, isLoading });

  if (isLoading || casos.length === 0) {
    console.log('DashboardPeritoCasosMensais - Mostrando estado de carregamento');
    return (
      <div className="bg-gray-800/80 p-4 rounded-lg shadow-md border border-gray-700 h-[300px] flex items-center justify-center">
        <div className="text-amber-500 animate-pulse">Carregando dados...</div>
      </div>
    );
  }

  const dadosColunaConfig = {
    labels: casos.map(caso => caso.tipo),
    datasets: [
      {
        label: 'Quantidade de Casos',
        data: casos.map(caso => caso.quantidade),
        backgroundColor: [
          'rgba(234, 179, 8, 0.7)',    // Âmbar
          'rgba(33, 70, 107, 0.7)',    // Azul escuro
          'rgba(86, 92, 97, 0.7)',     // Cinza
        ],
        borderColor: [
          'rgba(234, 179, 8, 1)',
          'rgba(33, 70, 107, 1)',
          'rgba(86, 92, 97, 1)',
        ],
        borderWidth: 2,
        borderRadius: 8,
        barPercentage: 0.6,
        categoryPercentage: 0.8,
      },
    ],
  };

  console.log('DashboardPeritoCasosMensais - Configuração do gráfico:', dadosColunaConfig);

  const opcoesColuna = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart' as const,
      delay: (context: ScriptableContext<'bar'>) => context.dataIndex * 100,
    },
    plugins: {
      legend: { 
        display: false 
      },
      title: {
        display: true,
        text: 'Casos por Tipo',
        color: '#f3f4f6',
        font: {
          size: 18,
          weight: 'bold' as const,
          family: "'Inter', sans-serif",
        },
        padding: {
          top: 20,
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.8)',
        titleFont: {
          size: 14,
          weight: 'bold' as const,
        },
        bodyFont: {
          size: 12,
        },
        padding: 12,
        cornerRadius: 8,
        displayColors: true,
        usePointStyle: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: '#e5e7eb',
          font: {
            size: 12,
          },
          padding: 8,
          stepSize: 1,
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#e5e7eb',
          font: {
            size: 12,
            weight: 'bold' as const,
          },
          padding: 8,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index' as const,
    },
    hover: {
      mode: 'nearest' as const,
      intersect: true,
    },
  };

  return (
    <div className="bg-gray-800/80 p-6 rounded-lg shadow-lg border border-gray-700 transition-all duration-300 hover:shadow-amber-500/10">
      <div className="h-[300px] relative">
        <Bar data={dadosColunaConfig} options={opcoesColuna} />
      </div>
    </div>
  );
}