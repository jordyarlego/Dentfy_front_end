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

  const opcoesColuna = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart',
      delay: (context: any) => context.dataIndex * 100,
    },
    plugins: {
      legend: { 
        display: false 
      },
      title: {
        display: true,
        text: 'Casos por Tipo',
        color: '#f3f4f6', // text-gray-100
        font: {
          size: 18,
          weight: 'bold',
          family: "'Inter', sans-serif",
        },
        padding: {
          top: 20,
          bottom: 20,
        },
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.8)', // bg-gray-900 com opacidade
        titleFont: {
          size: 14,
          weight: 'bold',
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
          color: 'rgba(107, 114, 128, 0.1)', // grid mais suave
          drawBorder: false,
        },
        ticks: {
          color: '#e5e7eb', // text-gray-200
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
          color: '#e5e7eb', // text-gray-200
          font: {
            size: 12,
            weight: 'bold',
          },
          padding: 8,
        },
      },
    },
    interaction: {
      intersect: false,
      mode: 'index',
    },
    hover: {
      mode: 'nearest',
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