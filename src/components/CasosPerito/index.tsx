'use client';

import { useState } from "react";

export default function CasosPerito() {
  const [search, setSearch] = useState("");
  const [filtro, setFiltro] = useState("todos");

  const casos = [
    {
      id: 1,
      titulo: "Laudo de Acidente - João Silva",
      status: "Concluído",
      data: "2025-04-08",
    },
    {
      id: 2,
      titulo: "Análise Técnica - Empresa XPTO",
      status: "Em análise",
      data: "2025-04-06",
    },
    {
      id: 3,
      titulo: "Inspeção Residencial - Maria Souza",
      status: "Pendente",
      data: "2025-04-02",
    },
  ];

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
    <div className="p-6 bg-transparent min-h-screen">
      
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-3">
          <h1 className="text-4xl font-bold text-[#12212B] drop-shadow">
            Casos do Perito
          </h1>
        </div>
        <button 
          className="relative bg-[#12212B] text-amber-300 px-6 py-3 rounded-xl hover:bg-amber-600 hover:cursor-pointer transition-colors duration-300 font-semibold shadow-md border-2 border-amber-500/30 hover:border-amber-600 hover:text-[#12212B] group"
        >
          <span className="relative z-10 flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-300 group-hover:text-[#12212B] transition-colors" 
                 fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
            </svg>
            Novo Caso
          </span>
          <span className="absolute inset-0 bg-amber-500 opacity-0 group-hover:opacity-10 rounded-xl transition-opacity duration-300"></span>
        </button>
      </div>

      
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div className="relative w-full md:w-1/2">
          <input
            type="text"
            placeholder="Pesquisar por nome do caso..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border-2 border-cyan-900/30 bg-[#1A3446]/80 backdrop-blur-sm text-white rounded-xl px-5 py-3 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-400/30 transition-all duration-300 shadow-lg cursor-text"
          />
          <svg 
            className="absolute right-3 top-3.5 h-5 w-5 text-gray-400 cursor-pointer" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setFiltro("todos")}
            className={`px-5 py-2 rounded-xl transition-all duration-300 font-medium cursor-pointer ${
              filtro === "todos" 
                ? 'bg-amber-500 text-[#12212B] shadow-lg shadow-amber-500/20' 
                : 'bg-[#1A3446]/80 text-amber-100 hover:bg-[#23405a]'
            } border-2 border-amber-500/30 hover:border-amber-400/50 backdrop-blur-sm`}
          >
            Todos
          </button>
          <button
            onClick={() => setFiltro("semana")}
            className={`px-5 py-2 rounded-xl transition-all duration-300 font-medium cursor-pointer ${
              filtro === "semana" 
                ? 'bg-amber-500 text-[#12212B] shadow-lg shadow-amber-500/20' 
                : 'bg-[#1A3446]/80 text-amber-100 hover:bg-[#23405a]'
            } border-2 border-amber-500/30 hover:border-amber-400/50 backdrop-blur-sm`}
          >
            Esta Semana
          </button>
          <button
            onClick={() => setFiltro("mes")}
            className={`px-5 py-2 rounded-xl transition-all duration-300 font-medium cursor-pointer ${
              filtro === "mes" 
                ? 'bg-amber-500 text-[#12212B] shadow-lg shadow-amber-500/20' 
                : 'bg-[#1A3446]/80 text-amber-100 hover:bg-[#23405a]'
            } border-2 border-amber-500/30 hover:border-amber-400/50 backdrop-blur-sm`}
          >
            Este Mês
          </button>
          <button
            onClick={() => setFiltro("ano")}
            className={`px-5 py-2 rounded-xl transition-all duration-300 font-medium cursor-pointer ${
              filtro === "ano" 
                ? 'bg-amber-500 text-[#12212B] shadow-lg shadow-amber-500/20' 
                : 'bg-[#1A3446]/80 text-amber-100 hover:bg-[#23405a]'
            } border-2 border-amber-500/30 hover:border-amber-400/50 backdrop-blur-sm`}
          >
            Este Ano
          </button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-2xl border-2 border-cyan-900/30 shadow-xl backdrop-blur-sm bg-[#1A3446]/80">
        <table className="min-w-full bg-transparent text-sm">
          <thead className="bg-[#0E1A26]/90 text-amber-300 text-left backdrop-blur-sm">
            <tr>
              <th className="px-8 py-5 font-semibold text-lg">Nome do Caso</th>
              <th className="px-6 py-5 font-semibold text-lg">Status</th>
              <th className="px-6 py-5 font-semibold text-lg">Data</th>
              <th className="px-6 py-5 font-semibold text-lg text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            {casosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center px-6 py-10 text-amber-100/80">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <svg className="h-12 w-12 text-amber-400/50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                  className="border-t border-cyan-900/30 hover:bg-[#1A3446]/60 transition-all duration-300 group cursor-pointer"
                >
                  <td className="px-8 py-5 font-medium text-white group-hover:text-amber-300 transition-colors duration-300">
                    <div className="flex items-center space-x-3">
                      <div className={`h-3 w-3 rounded-full ${
                        caso.status === "Concluído" ? 'bg-green-400' : 
                        caso.status === "Em análise" ? 'bg-amber-400' : 'bg-red-400'
                      } shadow-md`}></div>
                      <span>{caso.titulo}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span
                      className={`px-4 py-2 rounded-xl text-sm font-semibold shadow-md ${
                        caso.status === "Concluído"
                          ? "bg-green-900/40 text-green-300 border border-green-600/30"
                          : caso.status === "Em análise"
                          ? "bg-amber-900/40 text-amber-300 border border-amber-600/30"
                          : "bg-red-900/40 text-red-300 border border-red-600/30"
                      }`}
                    >
                      {caso.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-amber-100/90 group-hover:text-amber-200 transition-colors duration-300">
                    {new Date(caso.data).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-6 py-5 text-center space-x-3">
                    <button className="relative overflow-hidden bg-cyan-600/20 text-cyan-300 px-4 py-2 rounded-lg hover:bg-cyan-600/40 transition-all duration-300 border border-cyan-500/30 hover:border-cyan-400/50 shadow-md hover:shadow-cyan-500/20 group cursor-pointer">
                      <span className="relative z-10 flex items-center space-x-1">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>Detalhes</span>
                      </span>
                      <span className="absolute inset-0 bg-gradient-to-r from-cyan-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></span>
                    </button>
                    <button className="relative overflow-hidden bg-amber-600/20 text-amber-300 px-4 py-2 rounded-lg hover:bg-amber-600/40 transition-all duration-300 border border-amber-500/30 hover:border-amber-400/50 shadow-md hover:shadow-amber-500/20 group cursor-pointer">
                      <span className="relative z-10 flex items-center space-x-1">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        <span>Editar</span>
                      </span>
                      <span className="absolute inset-0 bg-gradient-to-r from-amber-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></span>
                    </button>
                    <button className="relative overflow-hidden bg-green-600/20 text-green-300 px-4 py-2 rounded-lg hover:bg-green-600/40 transition-all duration-300 border border-green-500/30 hover:border-green-400/50 shadow-md hover:shadow-green-500/20 group cursor-pointer">
                      <span className="relative z-10 flex items-center space-x-1">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        <span>Baixar</span>
                      </span>
                      <span className="absolute inset-0 bg-gradient-to-r from-green-500/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}