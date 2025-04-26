'use client';

import DashboardPeritoDistribuicao from '../../components/DashboardPeritoDistribuicao';
import DashboardPeritoCasosMensais from '../../components/DashboardPeritoCasosMensais';
import SidebarPerito from '../../components/SidebarPerito';
import HeaderPerito from '../../components/HeaderPerito';
import { useResumoDashboard, useCasosPorTipo } from '../../../services/api_dashboard';
import { FolderIcon, CheckCircleIcon, ClockIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline';

export default function Dashboard() {
  const { casosEmAndamento, casosFinalizados, casosArquivados } = useResumoDashboard();
  const totalCasos = casosEmAndamento + casosFinalizados + casosArquivados;

  // Dados de exemplo para o gráfico de casos mensais
   const { casosPorTipo } = useCasosPorTipo();
  

  return (
    <div className="flex h-screen bg-gray-900">
      <SidebarPerito />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <HeaderPerito />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-100 mb-6 animate-fadeIn">
            Dashboard do Perito
          </h1>

          {/* Cards de Estatísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-800/80 p-4 rounded-lg border border-gray-700 backdrop-blur-sm animate-fadeIn hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total de Casos</p>
                  <p className="text-2xl font-bold text-white">{totalCasos}</p>
                </div>
                <FolderIcon className="h-8 w-8 text-amber-500 animate-pulse" />
              </div>
            </div>

            <div className="bg-gray-800/80 p-4 rounded-lg border border-gray-700 backdrop-blur-sm animate-fadeIn hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Em Andamento</p>
                  <p className="text-2xl font-bold text-white">{casosEmAndamento}</p>
                </div>
                <ClockIcon className="h-8 w-8 text-yellow-500 animate-pulse" />
              </div>
            </div>

            <div className="bg-gray-800/80 p-4 rounded-lg border border-gray-700 backdrop-blur-sm animate-fadeIn hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Finalizados</p>
                  <p className="text-2xl font-bold text-white">{casosFinalizados}</p>
                </div>
                <CheckCircleIcon className="h-8 w-8 text-green-500 animate-pulse" />
              </div>
            </div>

            <div className="bg-gray-800/80 p-4 rounded-lg border border-gray-700 backdrop-blur-sm animate-fadeIn hover:scale-105 transition-transform duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Arquivados</p>
                  <p className="text-2xl font-bold text-white">{casosArquivados}</p>
                </div>
                <ArchiveBoxIcon className="h-8 w-8 text-purple-500 animate-pulse" />
              </div>
            </div>
          </div>
          
          {/* Gráficos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <DashboardPeritoDistribuicao
              casosEmAndamento={casosEmAndamento}
              casosFinalizados={casosFinalizados}
              casosArquivados={casosArquivados}
            />
            <DashboardPeritoCasosMensais casos={casosPorTipo} />
          </div>
        </main>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .animate-fadeIn:nth-child(1) { animation-delay: 0.1s; }
        .animate-fadeIn:nth-child(2) { animation-delay: 0.2s; }
        .animate-fadeIn:nth-child(3) { animation-delay: 0.3s; }
        .animate-fadeIn:nth-child(4) { animation-delay: 0.4s; }
      `}</style>
    </div>
  );
} 