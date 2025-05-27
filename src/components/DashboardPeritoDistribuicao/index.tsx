'use client';

import { Doughnut } from 'react-chartjs-2';
import { TooltipItem } from 'chart.js';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

// Registrando componentes do ChartJS
ChartJS.register(ArcElement, Tooltip, Legend, Title);

// 👇 Adiciona props
interface DashboardPeritoDistribuicaoProps {
  casosEmAndamento: number;
  casosFinalizados: number;
  casosArquivados: number;
  isLoading?: boolean;
}

export default function DashboardPeritoDistribuicao({
  casosEmAndamento,
  casosFinalizados,
  casosArquivados,
  isLoading = false,
}: DashboardPeritoDistribuicaoProps) {
  
  console.log('DashboardPeritoDistribuicao - Props recebidas:', {
    casosEmAndamento,
    casosFinalizados,
    casosArquivados,
    isLoading
  });

  const dadosCarregando =
    casosEmAndamento === 0 &&
    casosFinalizados === 0 &&
    casosArquivados === 0;

  if (dadosCarregando || isLoading) {
    console.log('DashboardPeritoDistribuicao - Mostrando estado de carregamento');
    return (
      <div className="bg-gray-800/80 p-4 rounded-lg shadow-md border border-gray-700 h-[300px] flex items-center justify-center">
        <div className="text-amber-500 animate-pulse">Carregando dados...</div>
      </div>
    );
  }

  const dadosGraficoConfig = {
    labels: ['Em Andamento', 'Finalizados', 'Arquivados'],
    datasets: [{
      data: [casosEmAndamento, casosFinalizados, casosArquivados],
      backgroundColor: [
        'rgba(234, 179, 8, 0.8)',    // Âmbar para Em Andamento
        'rgba(33, 70, 107, 0.8)',    // Azul escuro para Finalizados
        'rgba(86, 92, 97, 0.8)',     // Cinza para Arquivados
      ],
      borderColor: [
        'rgba(234, 179, 8, 1)',
        'rgba(33, 70, 107, 1)',
        'rgba(86, 92, 97, 1)',
      ],
      borderWidth: 2,
      hoverOffset: 4,
      hoverBorderWidth: 3,
    }],
  };

  console.log('DashboardPeritoDistribuicao - Configuração do gráfico:', dadosGraficoConfig);

  const opcoesGrafico = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 2000,
      easing: 'easeInOutQuart' as const,
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#e5e7eb',
          padding: 20,
          font: { 
            size: 12,
            weight: 'bold' as const,
          },
          usePointStyle: true,
          pointStyle: 'circle',
        },
      },
      title: {
        display: true,
        text: 'Distribuição dos Casos',
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
        callbacks: {
          label: function(context: TooltipItem<'doughnut'>) {
            const label = context.label || '';
            const value = context.raw as number || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    },
  };

  return (
    <div className="bg-gray-800/80 p-6 rounded-lg shadow-lg border border-gray-700 transition-all duration-300 hover:shadow-amber-500/10">
      <div className="h-[300px] relative">
        <Doughnut data={dadosGraficoConfig} options={opcoesGrafico} />
      </div>
    </div>
  );
}