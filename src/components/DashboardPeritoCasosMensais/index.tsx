'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registrando os componentes necessários
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface CasoMensal {
  mes: string;
  quantidade: number;
}

interface DashboardPeritoCasosMensaisProps {
  casos: CasoMensal[];
}

export default function DashboardPeritoCasosMensais({ casos }: DashboardPeritoCasosMensaisProps) {
  const dadosColunaConfig = {
    labels: casos.map(caso => caso.mes),
    datasets: [
      {
        label: 'Quantidade de Casos',
        data: casos.map(caso => caso.quantidade),
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const opcoesColuna = {
    responsive: true,
    animation: {
      duration: 2000,
      easing: 'easeOutQuart',
    },
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Casos por Mês',
        color: 'white',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: 'white',
          stepSize: 1,
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
      x: {
        ticks: {
          color: 'white',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)',
        },
      },
    },
  };

  return (
    <div className="bg-gray-800/80 p-4 rounded-lg border border-gray-700 backdrop-blur-sm animate-fadeIn">
      <Bar data={dadosColunaConfig} options={opcoesColuna} />
    </div>
  );
} 