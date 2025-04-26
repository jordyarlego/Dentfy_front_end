'use client';

import { Pie } from 'react-chartjs-2';
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
}

export default function DashboardPeritoDistribuicao({
  casosEmAndamento,
  casosFinalizados,
  casosArquivados,
}: DashboardPeritoDistribuicaoProps) {
  
  // agora NÃO usa mais useResumoDashboard aqui!

  const dadosCarregando =
    casosEmAndamento === 0 &&
    casosFinalizados === 0 &&
    casosArquivados === 0;

  if (dadosCarregando) {
    return <div className="text-white">Carregando dados do gráfico...</div>;
  }

  const dadosPizzaConfig = {
    labels: ['Em Andamento', 'Finalizados', 'Arquivados'],
    datasets: [{
      data: [casosEmAndamento, casosFinalizados, casosArquivados],
      backgroundColor: ['#0E1A26', '#21466b', '#565c61'],
      borderColor: ['#0E1A26', '#21466b', '#565c61'],
      borderWidth: 1,
    }],
  };

  const opcoesPizza = {
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          color: '#374151',
          font: { size: 12 },
        },
      },
      title: {
        display: true,
        text: 'Distribuição dos Casos',
        color: '#ffffff',
        font: {
          size: 18,
          weight: 'bold' as const,
        },
      },
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800/80 p-4 rounded-lg shadow-md dark:border dark:border-gray-700">
      <Pie data={dadosPizzaConfig} options={opcoesPizza} />
    </div>
  );
}