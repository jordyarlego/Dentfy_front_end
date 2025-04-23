'use client';

import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';

// Registrando os componentes necessários
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  Title
);

interface DashboardPeritoDistribuicaoProps {
  casosEmAndamento: number;
  casosFinalizados: number;
  casosArquivados: number;
}

export default function DashboardPeritoDistribuicao({
  casosEmAndamento,
  casosFinalizados,
  casosArquivados,
}: DashboardPeritoDistribuicaoProps) {
  const dadosPizzaConfig = {
    labels: ['Em Andamento', 'Finalizados', 'Arquivados'],
    datasets: [
      {
        data: [casosEmAndamento, casosFinalizados, casosArquivados],
        backgroundColor: [
          'rgba(234, 179, 8, 0.8)',   // Amarelo escuro para em andamento
          'rgba(34, 197, 94, 0.8)',   // Verde escuro para finalizados
          'rgba(139, 92, 246, 0.8)',  // Roxo escuro para arquivados
        ],
        borderColor: [
          'rgba(234, 179, 8, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(139, 92, 246, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const opcoesPizza = {
    responsive: true,
    animation: {
      animateScale: true,
      animateRotate: true,
      duration: 2000,
      easing: 'easeOutQuart',
    },
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: 'white',
          font: {
            size: 12,
          },
        },
      },
      title: {
        display: true,
        text: 'Distribuição dos Casos',
        color: 'white',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
    },
  };

  return (
    <div className="bg-gray-800/80 p-4 rounded-lg border border-gray-700 backdrop-blur-sm animate-fadeIn">
      <Pie data={dadosPizzaConfig} options={opcoesPizza} />
    </div>
  );
}