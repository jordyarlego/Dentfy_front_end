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

interface DashboardPeritoDistribuicaoCombinadaProps {
  casosPorEtnia: Record<string, number>;
  casosPorSexo: {
    masculino: number;
    feminino: number;
    outro: number;
  };
  isLoading?: boolean;
}

export default function DashboardPeritoDistribuicaoCombinada({
  casosPorEtnia,
  casosPorSexo,
  isLoading = false,
}: DashboardPeritoDistribuicaoCombinadaProps) {

  if (isLoading) {
    return (
      <div className="bg-gray-800/80 p-4 rounded-lg shadow-md border border-gray-700 h-[300px] flex items-center justify-center">
        <div className="text-amber-500 animate-pulse">Carregando dados...</div>
      </div>
    );
  }

  // Preparar dados para o gráfico
  const etnias = Object.keys(casosPorEtnia);
  const sexos = ['Masculino', 'Feminino', 'Outro'];

  // Criar datasets para cada sexo
  const datasets = sexos.map((sexo) => {
    const colorMap = {
      'Masculino': 'rgba(59, 130, 246, 0.7)',  // azul
      'Feminino': 'rgba(236, 72, 153, 0.7)',   // rosa
      'Outro': 'rgba(139, 92, 246, 0.7)',      // roxo
    };

    const borderColorMap = {
      'Masculino': 'rgba(59, 130, 246, 1)',
      'Feminino': 'rgba(236, 72, 153, 1)',
      'Outro': 'rgba(139, 92, 246, 1)',
    };

    // Calcular a proporção de cada sexo para cada etnia
    const totalPorSexo = sexo === 'Masculino' ? casosPorSexo.masculino :
                        sexo === 'Feminino' ? casosPorSexo.feminino :
                        casosPorSexo.outro;

    const totalGeral = casosPorSexo.masculino + casosPorSexo.feminino + casosPorSexo.outro;
    const proporcaoSexo = totalGeral > 0 ? totalPorSexo / totalGeral : 0;

    return {
      label: sexo,
      data: etnias.map(etnia => {
        const totalEtnia = casosPorEtnia[etnia] || 0;
        return Math.round(totalEtnia * proporcaoSexo);
      }),
      backgroundColor: colorMap[sexo as keyof typeof colorMap],
      borderColor: borderColorMap[sexo as keyof typeof borderColorMap],
      borderWidth: 2,
      borderRadius: 8,
      barPercentage: 0.8,
      categoryPercentage: 0.9,
    };
  });

  const dadosGrafico = {
    labels: etnias,
    datasets,
  };

  const opcoesGrafico = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
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
        text: 'Distribuição por Etnia e Sexo',
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
        stacked: true,
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
        stacked: true,
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
  };

  return (
    <div className="bg-gray-800/80 p-6 rounded-lg shadow-lg border border-gray-700 transition-all duration-300 hover:shadow-amber-500/10">
      <div className="h-[300px] relative">
        <Bar data={dadosGrafico} options={opcoesGrafico} />
      </div>
    </div>
  );
} 