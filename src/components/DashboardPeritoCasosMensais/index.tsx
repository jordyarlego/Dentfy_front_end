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
}

export default function DashboardPeritoCasosMensais({ casos }: DashboardPeritoCasosMensaisProps) {
  const dadosColunaConfig = {
    labels: casos.map(caso => caso.tipo),
    datasets: [
      {
        label: 'Quantidade de Casos',
        data: casos.map(caso => caso.quantidade),
        backgroundColor: 'rgba(139, 92, 246, 0.8)',
        borderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 1,
        barPercentage: 0.5, // Mais fino
        categoryPercentage: 0.5, // Mais espaço entre elas
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
      legend: { display: false },
      title: {
        display: true,
        text: 'Casos por Tipo',
        color: '#ffffff', // cinza bem escuro
        font: {
          size: 18,
          weight: 'bold' as const,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#374151', // gray-700
          stepSize: 1,
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false,
        },
      },
      x: {
        ticks: {
          color: '#374151',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800/80 p-4 rounded-lg shadow-md dark:border dark:border-gray-700">

    <Bar data={dadosColunaConfig} options={opcoesColuna} />
  </div>
  
  );
}