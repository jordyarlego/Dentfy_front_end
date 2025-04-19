'use client';

import { useState } from "react";
import ModalNovoCasoPerito from "../ModalNovoCasoPerito";
import ModalVisualizacaoPerito from "../ModalVisualizacaoPerito";

// Tipos compartilhados (deveriam estar em um arquivo separado types.ts) NAO LEMBRO SE COLOQUEI
export interface Evidencia {
  id: number;
  nome: string;
  tipo: string;
  descricao: string;
  coletadoPor: string;
  arquivo: string;
  dataAdicao: string;
  laudo?: string;
}

export interface Caso {
  id: number;
  titulo: string;
  status: string;
  data: string;
  sexo: string;
  local: string;
  descricao: string;
  evidencias: Evidencia[];
}

interface FormData {
  titulo: string;
  data: string;
  sexo: string;
  local: string;
  descricao: string;
}

export default function CasosPerito() {
  const [search, setSearch] = useState("");
  const [filtro, setFiltro] = useState("todos");
  const [modalOpen, setModalOpen] = useState(false);
  const [casoSelecionado, setCasoSelecionado] = useState<Caso | null>(null);

  const [casos, setCasos] = useState<Caso[]>([
    {
      id: 1,
      titulo: "Laudo de Acidente - João Silva",
      status: "Concluído",
      data: "2025-04-08",
      sexo: "masculino",
      local: "São Paulo/SP",
      descricao: "Acidente de trânsito na via pública",
      evidencias: [
        {
          id: 1,
          nome: "Foto do local",
          tipo: "Imagem",
          descricao: "Foto tirada no local do acidente",
          coletadoPor: "Perito Carlos",
          arquivo: "/fotos/acidente.jpg",
          dataAdicao: "2025-04-08"
        }
      ]
    },
    {
      id: 2,
      titulo: "Análise Técnica - Empresa XPTO",
      status: "Em análise",
      data: "2025-04-06",
      sexo: "feminino",
      local: "Rio de Janeiro/RJ",
      descricao: "Inspeção predial com danos estruturais",
      evidencias: []
    },
    {
      id: 3,
      titulo: "Inspeção Residencial - Maria Souza",
      status: "Pendente",
      data: "2025-04-02",
      sexo: "feminino",
      local: "Belo Horizonte/MG",
      descricao: "Vistoria para seguro residencial",
      evidencias: []
    },
  ]);

  const handleSubmitCaso = (novoCaso: FormData, id?: number) => {
    if (id) {
      setCasos(prev => prev.map(caso => 
        caso.id === id ? { 
          ...caso, 
          ...novoCaso,
          evidencias: caso.evidencias
        } : caso
      ));
    } else {
      const novoItem: Caso = {
        id: casos.length + 1,
        ...novoCaso,
        status: "Pendente",
        evidencias: []
      };
      setCasos([...casos, novoItem]);
    }
    setModalOpen(false);
  };

  const casosFiltrados = casos.filter((caso) => {
    const nomeMatch = caso.titulo.toLowerCase().includes(search.toLowerCase());
    const data = new Date(caso.data);
    const hoje = new Date();

    if (filtro === "semana") {
      const diff = Math.abs(hoje.getTime() - data.getTime());
      const dias = diff / (1000 * 3600 * 24);
      return nomeMatch && dias <= 7;
    }

    if (filtro === "mes") {
      return (
        nomeMatch &&
        data.getMonth() === hoje.getMonth() &&
        data.getFullYear() === hoje.getFullYear()
      );
    }

    if (filtro === "ano") {
      return nomeMatch && data.getFullYear() === hoje.getFullYear();
    }

    return nomeMatch;
  });

  return (
    <div className="p-4 sm:p-6 bg-transparent min-h-screen">
     
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-100">
          Casos do Perito
        </h1>
        
        <button 
          onClick={() => setModalOpen(true)}
          className="relative bg-gray-800/90 text-gray-100 px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-gray-700 transition-all duration-300 font-medium shadow-md border border-gray-700 hover:border-gray-600 group cursor-pointer w-full sm:w-auto"
        >
          <span className="relative z-10 flex items-center justify-center sm:justify-start gap-2">
            <svg className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" 
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            <span className="truncate">Novo Caso</span>
          </span>
          <span className="absolute inset-0 bg-gray-600 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></span>
        </button>
      </div>

      
      <div className="flex flex-col gap-4 mb-6">
        
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Pesquisar casos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-gray-700 bg-gray-800/80 text-gray-200 rounded-lg px-4 sm:px-5 py-2 sm:py-3 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all duration-300 shadow cursor-text placeholder-gray-500 backdrop-blur-sm"
          />
          <svg 
            className="absolute right-3 top-2.5 sm:top-3.5 h-5 w-5 text-gray-500 cursor-pointer hover:text-gray-400 transition-colors" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        
        <div className="flex overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:gap-3 scrollbar-hide">
          <button
            onClick={() => setFiltro("todos")}
            className={`flex-shrink-0 px-4 py-2 rounded-lg transition-all duration-300 font-medium cursor-pointer ${
              filtro === "todos" 
                ? 'bg-gray-700 text-white shadow hover:bg-gray-600' 
                : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700/80'
            } border border-gray-700 hover:border-gray-600 backdrop-blur-sm mr-2 sm:mr-0`}
          >
            Todos
          </button>
          <button
            onClick={() => setFiltro("semana")}
            className={`flex-shrink-0 px-4 py-2 rounded-lg transition-all duration-300 font-medium cursor-pointer ${
              filtro === "semana" 
                ? 'bg-gray-700 text-white shadow hover:bg-gray-600' 
                : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700/80'
            } border border-gray-700 hover:border-gray-600 backdrop-blur-sm mr-2 sm:mr-0`}
          >
            Esta Semana
          </button>
          <button
            onClick={() => setFiltro("mes")}
            className={`flex-shrink-0 px-4 py-2 rounded-lg transition-all duration-300 font-medium cursor-pointer ${
              filtro === "mes" 
                ? 'bg-gray-700 text-white shadow hover:bg-gray-600' 
                : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700/80'
            } border border-gray-700 hover:border-gray-600 backdrop-blur-sm mr-2 sm:mr-0`}
          >
            Este Mês
          </button>
          <button
            onClick={() => setFiltro("ano")}
            className={`flex-shrink-0 px-4 py-2 rounded-lg transition-all duration-300 font-medium cursor-pointer ${
              filtro === "ano" 
                ? 'bg-gray-700 text-white shadow hover:bg-gray-600' 
                : 'bg-gray-800/80 text-gray-300 hover:bg-gray-700/80'
            } border border-gray-700 hover:border-gray-600 backdrop-blur-sm`}
          >
            Este Ano
          </button>
        </div>
      </div>

      
      <div className="overflow-x-auto rounded-lg border border-gray-700 shadow bg-gray-800/80 backdrop-blur-sm">
        
        <table className="hidden sm:table min-w-full bg-transparent text-sm">
          <thead className="bg-gray-750/80 text-gray-300 text-left backdrop-blur-sm">
            <tr>
              <th className="px-4 sm:px-6 py-3 font-medium">Nome do Caso</th>
              <th className="px-4 sm:px-6 py-3 font-medium">Status</th>
              <th className="px-4 sm:px-6 py-3 font-medium">Data</th>
              <th className="px-4 sm:px-6 py-3 font-medium text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {casosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center px-6 py-10 text-gray-500">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <svg className="h-12 w-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-lg">Nenhum caso encontrado</span>
                  </div>
                </td>
              </tr>
            ) : (
              casosFiltrados.map((caso) => (
                <tr
                  key={caso.id}
                  className="border-t border-gray-750 hover:bg-gray-750/50 transition-all duration-200 cursor-pointer"
                >
                  <td className="px-4 sm:px-6 py-3 font-medium text-gray-200 group-hover:text-white">
                    <div className="flex items-center space-x-3">
                      <div className={`h-2.5 w-2.5 rounded-full ${
                        caso.status === "Concluído" ? 'bg-green-500' : 
                        caso.status === "Em análise" ? 'bg-amber-500' : 'bg-red-500'
                      }`}></div>
                      <span className="truncate max-w-xs">{caso.titulo}</span>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-3">
                    <span
                      className={`px-3 py-1 rounded-md text-xs font-medium ${
                        caso.status === "Concluído"
                          ? "bg-green-900/30 text-green-400 hover:bg-green-900/40"
                          : caso.status === "Em análise"
                          ? "bg-amber-900/30 text-amber-400 hover:bg-amber-900/40"
                          : "bg-red-900/30 text-red-400 hover:bg-red-900/40"
                      } transition-colors duration-200 cursor-default`}
                    >
                      {caso.status}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-3 text-gray-400 group-hover:text-gray-300">
                    {new Date(caso.data).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-4 sm:px-6 py-3">
                    <div className="flex justify-center space-x-2 sm:space-x-3">
                      <button 
                        onClick={() => setCasoSelecionado(caso)}
                        className="bg-gray-700/80 text-gray-300 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md hover:bg-gray-600 transition-all duration-300 border border-gray-600 hover:border-gray-500 text-xs sm:text-sm font-medium flex items-center space-x-1 sm:space-x-2 cursor-pointer shadow hover:shadow-md hover:shadow-gray-700/20"
                      >
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>Detalhes</span>
                      </button>
                      <button 
                        onClick={() => {}}
                        className="bg-gray-700/80 text-gray-300 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md hover:bg-gray-600 transition-all duration-300 border border-gray-600 hover:border-gray-500 text-xs sm:text-sm font-medium flex items-center space-x-1 sm:space-x-2 cursor-not-allowed opacity-50"
                        disabled
                      >
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Editar</span>
                      </button>
                      <button className="bg-gray-700/80 text-gray-300 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md hover:bg-gray-600 transition-all duration-300 border border-gray-600 hover:border-gray-500 text-xs sm:text-sm font-medium flex items-center space-x-1 sm:space-x-2 cursor-pointer shadow hover:shadow-md hover:shadow-gray-700/20">
                        <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span>Baixar</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        
        <div className="sm:hidden space-y-3 p-3">
          {casosFiltrados.length === 0 ? (
            <div className="text-center px-6 py-10 text-gray-500">
              <div className="flex flex-col items-center justify-center space-y-2">
                <svg className="h-12 w-12 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-lg">Nenhum caso encontrado</span>
              </div>
            </div>
          ) : (
            casosFiltrados.map((caso) => (
              <div
                key={caso.id}
                className="border border-gray-700 rounded-lg p-4 bg-gray-800/90 hover:bg-gray-750/50 transition-all duration-200 cursor-pointer"
              >
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`h-2.5 w-2.5 rounded-full ${
                      caso.status === "Concluído" ? 'bg-green-500' : 
                      caso.status === "Em análise" ? 'bg-amber-500' : 'bg-red-500'
                    }`}></div>
                    <h3 className="text-gray-200 font-medium truncate max-w-[180px]">{caso.titulo}</h3>
                  </div>
                  <span
                    className={`px-2 py-1 rounded-md text-xs font-medium ${
                      caso.status === "Concluído"
                        ? "bg-green-900/30 text-green-400"
                        : caso.status === "Em análise"
                        ? "bg-amber-900/30 text-amber-400"
                        : "bg-red-900/30 text-red-400"
                    }`}
                  >
                    {caso.status}
                  </span>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <span className="text-gray-400 text-sm">
                    {new Date(caso.data).toLocaleDateString("pt-BR")}
                  </span>
                  
                  <div className="flex space-x-2">
                    <button 
                      onClick={() => setCasoSelecionado(caso)}
                      className="bg-gray-700/80 text-gray-300 p-2 rounded-md hover:bg-gray-600 transition-all duration-300 border border-gray-600 hover:border-gray-500 cursor-pointer shadow hover:shadow-gray-700/20"
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    </button>
                    <button 
                      className="bg-gray-700/80 text-gray-300 p-2 rounded-md opacity-50 cursor-not-allowed"
                      disabled
                    >
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button className="bg-gray-700/80 text-gray-300 p-2 rounded-md hover:bg-gray-600 transition-all duration-300 border border-gray-600 hover:border-gray-500 cursor-pointer shadow hover:shadow-gray-700/20">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      
      <ModalNovoCasoPerito 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmitCaso}
      />

      {casoSelecionado && (
        <ModalVisualizacaoPerito
          isOpen={!!casoSelecionado}
          onClose={() => setCasoSelecionado(null)}
          caso={casoSelecionado}
        />
      )}
    </div>
  );
}