'use client';

import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Registrando os componentes necessários
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface GraficosProps {
  dadosPizza: {
    labels: string[];
    valores: number[];
  };
  dadosColuna: {
    labels: string[];
    valores: number[];
  };
}

export default function Graficos({ dadosPizza, dadosColuna }: GraficosProps) {
  // Configuração do gráfico de pizza
  const dadosPizzaConfig = {
    labels: dadosPizza.labels,
    datasets: [
      {
        data: dadosPizza.valores,
        backgroundColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Configuração do gráfico de coluna
  const dadosColunaConfig = {
    labels: dadosColuna.labels,
    datasets: [
      {
        label: 'Quantidade',
        data: dadosColuna.valores,
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const opcoesPizza = {
    responsive: true,
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
        text: 'Distribuição por Categoria',
        color: 'white',
        font: {
          size: 16,
          weight: 'bold' as const,
        },
      },
    },
  };

  const opcoesColuna = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Quantidade por Período',
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      <div className="bg-gray-800/80 p-4 rounded-lg border border-gray-700 backdrop-blur-sm">
        <Pie data={dadosPizzaConfig} options={opcoesPizza} />
      </div>
      <div className="bg-gray-800/80 p-4 rounded-lg border border-gray-700 backdrop-blur-sm">
        <Bar data={dadosColunaConfig} options={opcoesColuna} />
      </div>
    </div>
  );
} 