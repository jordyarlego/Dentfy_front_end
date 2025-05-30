'use client';

import { useState } from 'react';
import DashboardPeritoDistribuicao from '../../components/DashboardPeritoDistribuicao';
import DashboardPeritoCasosMensais from '../../components/DashboardPeritoCasosMensais';
import SidebarPerito from '../../components/SidebarPerito';
import HeaderPerito from '../../components/HeaderPerito';
import { useResumoDashboard, useCasosPorTipo, useCasosPorSexo, useCasosPorEtnia } from '../../../services/api_dashboard';
import { FolderIcon, CheckCircleIcon, ClockIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline';
import DashboardPeritoDistribuicaoCombinada from '../../components/DashboardPeritoDistribuicaoCombinada';

export default function Dashboard() {
  const [filtroPeriodo, setFiltroPeriodo] = useState('todos');
  const [filtroSexo, setFiltroSexo] = useState('todos');
  const [filtroEtnia, setFiltroEtnia] = useState('todos');

  const { casosEmAndamento, casosFinalizados, casosArquivados, isLoading: isLoadingResumo } = useResumoDashboard(filtroPeriodo, filtroSexo);
  const { casosPorTipo, isLoading: isLoadingCasos } = useCasosPorTipo(filtroPeriodo, filtroSexo);
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

          {/* Substituir os cards de etnia e sexo pelo novo gráfico combinado */}
          <DashboardPeritoDistribuicaoCombinada
            casosPorEtnia={casosPorEtnia}
            casosPorSexo={{ masculino, feminino, outro }}
            isLoading={isLoading}
          />

          {/* Gráficos (Distribuição e Casos Mensais) */}
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