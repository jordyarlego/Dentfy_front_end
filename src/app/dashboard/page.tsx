'use client';

import { useState } from 'react';
import DashboardPeritoDistribuicao from '../../components/DashboardPeritoDistribuicao';
import DashboardPeritoCasosMensais from '../../components/DashboardPeritoCasosMensais';
import SidebarPerito from '../../components/SidebarPerito';
import HeaderPerito from '../../components/HeaderPerito';
import { useResumoDashboard, useCasosPorTipo, useCasosPorSexo, useCasosPorEtnia } from '../../../services/api_dashboard';
import {
  FolderIcon,
  CheckCircleIcon,
  ClockIcon,
  ArchiveBoxIcon,
  UserIcon,
  UserGroupIcon,
  UsersIcon
} from '@heroicons/react/24/outline';

export default function Dashboard() {
  const [filtroPeriodo, setFiltroPeriodo] = useState('todos');
  const [filtroSexo, setFiltroSexo] = useState('todos');
  const [filtroEtnia, setFiltroEtnia] = useState('todos');

  const { casosEmAndamento, casosFinalizados, casosArquivados, isLoading: isLoadingResumo } = useResumoDashboard(filtroPeriodo, filtroSexo, filtroEtnia);
  const { casosPorTipo, isLoading: isLoadingCasos } = useCasosPorTipo(filtroPeriodo, filtroSexo, filtroEtnia);
  const { masculino, feminino, outro, isLoading: isLoadingSexo } = useCasosPorSexo(filtroPeriodo, filtroSexo, filtroEtnia);
  const { casosPorEtnia, isLoading: isLoadingEtnia } = useCasosPorEtnia(filtroPeriodo, filtroSexo, filtroEtnia);


  const totalCasos = casosEmAndamento + casosFinalizados + casosArquivados;
  const isLoading = isLoadingResumo || isLoadingCasos || isLoadingSexo || isLoadingEtnia;

  const handleFiltroChange = (tipo: 'periodo' | 'sexo' | 'etnia', valor: string) => {
    console.log('Dashboard - Alterando filtro:', { tipo, valor });
    switch (tipo) {
      case 'periodo':
        setFiltroPeriodo(valor);
        break;
      case 'sexo':
        setFiltroSexo(valor);
        break;
      case 'etnia':
        setFiltroEtnia(valor);
        break;
    }
  };

  return (
    <div className="flex h-screen bg-gray-900">
      <SidebarPerito />

      <div className="flex-1 flex flex-col overflow-hidden">
        <HeaderPerito />

        <main className="flex-1 overflow-y-auto p-4 pb-20 lg:pb-4 sm:p-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-100 animate-fadeIn">
              Dashboard do Perito
            </h1>

            {/* Filtros */}
            <div className="flex flex-wrap gap-2">
              <select
                value={filtroPeriodo}
                onChange={(e) => handleFiltroChange('periodo', e.target.value)}
                disabled={isLoading}
                className={`bg-gray-800 text-gray-100 border border-gray-700 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'
                  }`}
              >
                <option value="todos">Todos os Períodos</option>
                <option value="semana">Última Semana</option>
                <option value="mes">Último Mês</option>
                <option value="ano">Último Ano</option>
              </select>

              <select
                value={filtroSexo}
                onChange={(e) => handleFiltroChange('sexo', e.target.value)}
                disabled={isLoading}
                className={`bg-gray-800 text-gray-100 border border-gray-700 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'
                  }`}
              >
                <option value="todos">Todos os Sexos</option>
                <option value="masculino">Masculino</option>
                <option value="feminino">Feminino</option>
                <option value="outro">Outro</option>
              </select>

              <select
                value={filtroEtnia}
                onChange={(e) => handleFiltroChange('etnia', e.target.value)}
                disabled={isLoading}
                className={`bg-gray-800 text-gray-100 border border-gray-700 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'
                  }`}
              >
                <option value="todos">Todas as Etnias</option>
                <option value="branco">Branca</option>
                <option value="pardo">Parda</option>
                <option value="preto">Preta</option>
                <option value="amarelo">Amarela</option>
                <option value="indigena">Indígena</option>
                <option value="outro">Outra</option>
              </select>
            </div>
          </div>
          {/* Cards de Estatísticas - Status */}
          <div className="mb-4">
            <h2 className="text-base font-semibold text-gray-200 mb-3">Status dos Casos</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2">
              <div className={`bg-gray-800/80 p-3 rounded-lg border border-gray-700 backdrop-blur-sm animate-fadeIn transition-all duration-300 ${isLoading ? 'opacity-50' : 'hover:scale-105'
                }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs">Total de Casos</p>
                    <p className="text-xl font-bold text-white">
                      {isLoading ? '...' : totalCasos}
                    </p>
                  </div>
                  <FolderIcon className={`h-6 w-6 text-amber-500 ${isLoading ? 'animate-pulse' : ''}`} />
                </div>
              </div>

              <div className={`bg-gray-800/80 p-3 rounded-lg border border-gray-700 backdrop-blur-sm animate-fadeIn transition-all duration-300 ${isLoading ? 'opacity-50' : 'hover:scale-105'
                }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs">Em Andamento</p>
                    <p className="text-xl font-bold text-white">
                      {isLoading ? '...' : casosEmAndamento}
                    </p>
                  </div>
                  <ClockIcon className={`h-6 w-6 text-yellow-500 ${isLoading ? 'animate-pulse' : ''}`} />
                </div>
              </div>

              <div className={`bg-gray-800/80 p-3 rounded-lg border border-gray-700 backdrop-blur-sm animate-fadeIn transition-all duration-300 ${isLoading ? 'opacity-50' : 'hover:scale-105'
                }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs">Finalizados</p>
                    <p className="text-xl font-bold text-white">
                      {isLoading ? '...' : casosFinalizados}
                    </p>
                  </div>
                  <CheckCircleIcon className={`h-6 w-6 text-green-500 ${isLoading ? 'animate-pulse' : ''}`} />
                </div>
              </div>

              <div className={`bg-gray-800/80 p-3 rounded-lg border border-gray-700 backdrop-blur-sm animate-fadeIn transition-all duration-300 ${isLoading ? 'opacity-50' : 'hover:scale-105'
                }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-xs">Arquivados</p>
                    <p className="text-xl font-bold text-white">
                      {isLoading ? '...' : casosArquivados}
                    </p>
                  </div>
                  <ArchiveBoxIcon className={`h-6 w-6 text-purple-500 ${isLoading ? 'animate-pulse' : ''}`} />
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-base font-semibold text-gray-200 mb-3">Distribuição por Etnia</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 max-w-full">
              {Object.entries(casosPorEtnia).map(([etnia, total]) => {
                const colorMap: Record<string, string> = {
                  branco: 'text-blue-400',
                  preto: 'text-gray-300',
                  pardo: 'text-yellow-800',
                  amarelo: 'text-yellow-400',
                  indigena: 'text-green-500',
                  outro: 'text-purple-400',
                };

                const iconColor = colorMap[etnia.toLowerCase()] || 'text-white';

                return (
                  <div
                    key={etnia}
                    className={`bg-gray-800/80 p-2 rounded-lg border border-gray-700 backdrop-blur-sm animate-fadeIn transition-all duration-300 flex-1 ${isLoading ? 'opacity-50' : 'hover:scale-105'}`}
                  >
                    <div className="flex flex-col items-center">
                      <UserIcon className={`h-4 w-4 mb-1 ${iconColor} ${isLoading ? 'animate-pulse' : ''}`} />
                      <p className="text-gray-400 text-[10px] text-center capitalize">{etnia}</p>
                      <p className="text-sm font-bold text-white">{isLoading ? '...' : total}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cards de Estatísticas - Sexo (Mini Cards) */}
<div className="mb-6">
  <h2 className="text-base font-semibold text-gray-200 mb-3">Distribuição por Sexo</h2>
  <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 gap-2 max-w-full">
    <div className={`bg-gray-800/80 p-2 rounded-lg border border-gray-700 backdrop-blur-sm animate-fadeIn transition-all duration-300 flex-1 ${isLoading ? 'opacity-50' : 'hover:scale-105'}`}>
      <div className="flex flex-col items-center">
        <UserIcon className={`h-4 w-4 text-blue-500 mb-1 ${isLoading ? 'animate-pulse' : ''}`} />
        <p className="text-gray-400 text-[10px] text-center">Masculino</p>
        <p className="text-sm font-bold text-white">
          {isLoading ? '...' : masculino}
        </p>
      </div>
    </div>

    <div className={`bg-gray-800/80 p-2 rounded-lg border border-gray-700 backdrop-blur-sm animate-fadeIn transition-all duration-300 flex-1 ${isLoading ? 'opacity-50' : 'hover:scale-105'}`}>
      <div className="flex flex-col items-center">
        <UserIcon className={`h-4 w-4 text-pink-500 mb-1 ${isLoading ? 'animate-pulse' : ''}`} />
        <p className="text-gray-400 text-[10px] text-center">Feminino</p>
        <p className="text-sm font-bold text-white">
          {isLoading ? '...' : feminino}
        </p>
      </div>
    </div>

    <div className={`bg-gray-800/80 p-2 rounded-lg border border-gray-700 backdrop-blur-sm animate-fadeIn transition-all duration-300 flex-1 ${isLoading ? 'opacity-50' : 'hover:scale-105'}`}>
      <div className="flex flex-col items-center">
        <UserIcon className={`h-4 w-4 text-purple-500 mb-1 ${isLoading ? 'animate-pulse' : ''}`} />
        <p className="text-gray-400 text-[10px] text-center">Outros</p>
        <p className="text-sm font-bold text-white">
          {isLoading ? '...' : outro}
        </p>
      </div>
    </div>
  </div>
</div>

          {/* Gráficos */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <DashboardPeritoDistribuicao
              casosEmAndamento={casosEmAndamento}
              casosFinalizados={casosFinalizados}
              casosArquivados={casosArquivados}
              isLoading={isLoading}
            />
            <DashboardPeritoCasosMensais
              casos={casosPorTipo}
              isLoading={isLoading}
            />
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