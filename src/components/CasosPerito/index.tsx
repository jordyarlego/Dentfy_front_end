"use client";

import api from "../../../lib/axios";
import { useEffect, useState, useRef } from "react";
import ModalNovoCasoPerito from "../ModalNovoCasoPerito";
import ModalVisualizacaoPerito from "../ModalVisualizacaoPerito";
import ModalEditarCaso from "../ModalEditarCaso";
import FeedbackModal from "../FeedbackModal";
import { FaEye, FaEdit, FaTrash, FaCalendarAlt, FaFilter, FaChevronDown } from "react-icons/fa";
import {
  atualizarCaso,
  deletarCaso,
  CasoData,
  adicionarEvidencia,
  buscarEvidenciasPorCaso,
  deletarEvidencia
} from "../ModalNovoCasoPerito/API_NovoCaso";
import ModalConfirmacaoDelete from "../ModalConfirmacaoDelete";




export interface Evidencia {
  _id: string;
  nome: string;
  tipo: string;
  descricao: string;
  coletadoPor: string;
  arquivo: string;
  dataAdicao: string;
  laudo?: string;
  caso: string;
}

export interface Caso extends CasoData {
  _id: string;
  evidencias: Evidencia[];
}

export default function CasosPerito() {
  const [search, setSearch] = useState("");
  const [filtro, setFiltro] = useState("todos");
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [casoSelecionado, setCasoSelecionado] = useState<Caso | null>(null);
  const [editandoCaso, setEditandoCaso] = useState<CasoData | undefined>(undefined);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState<"success" | "edit" | "delete" | "error">("success");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [casoParaDeletar, setCasoParaDeletar] = useState<Caso | null>(null);
  const [dropdownDataAberto, setDropdownDataAberto] = useState(false);
  const [dropdownStatusAberto, setDropdownStatusAberto] = useState(false);
  const dropdownDataRef = useRef<HTMLDivElement>(null);
  const dropdownStatusRef = useRef<HTMLDivElement>(null);

  const [casos, setCasos] = useState<Caso[]>([]);

  useEffect(() => {
    const carregarCasos = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await api.get("/api/cases", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCasos(response.data.casos);
      } catch (error) {
        console.error("Erro ao buscar casos:", error);
      }
    };

    carregarCasos();
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownDataRef.current && !dropdownDataRef.current.contains(event.target as Node)) {
        setDropdownDataAberto(false);
      }
      if (dropdownStatusRef.current && !dropdownStatusRef.current.contains(event.target as Node)) {
        setDropdownStatusAberto(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getTextoFiltroData = () => {
    switch (filtro) {
      case "semana": return "Esta Semana";
      case "mes": return "Este Mês";
      case "ano": return "Este Ano";
      default: return "Todos os Períodos";
    }
  };

  const getCorStatus = (status: string) => {
    switch (status) {
      case "Em andamento": return "text-yellow-400";
      case "Finalizado": return "text-green-400";
      case "Arquivado": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  const handleSubmitCaso = async (novoCaso: CasoData) => {
    try {
      if (editandoCaso) {
        const casoAtualizado = await atualizarCaso(casoSelecionado!._id, novoCaso);
        setCasos(casos.map(caso => 
          caso._id === casoSelecionado!._id ? { ...casoAtualizado, evidencias: caso.evidencias } : caso
        ));
    } else {
        const response = await api.post("/api/cases", novoCaso, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        
        setCasos([...casos, response.data]);
      }
      
      setModalOpen(false);
      setEditandoCaso(undefined);
      setCasoSelecionado(null);
      
      setFeedbackType("success");
      setFeedbackMessage("Caso salvo com sucesso!");
      setShowFeedback(true);
      
    } catch (error) {
      console.error("Erro ao salvar caso:", error);
      setFeedbackType("error");
      setFeedbackMessage("Erro ao salvar o caso. Tente novamente.");
      setShowFeedback(true);
    }
  };

  const handleEditarCaso = async (caso: Caso) => {
    setCasoSelecionado(caso);
    setEditandoCaso({
      titulo: caso.titulo,
      descricao: caso.descricao,
      responsavel: caso.responsavel,
      status: caso.status,
      tipo: caso.tipo,
      dataAbertura: caso.dataAbertura,
      sexo: caso.sexo,
      local: caso.local,
    });
    setModalEditarOpen(true);
  };

  const handleDeletarCaso = (caso: Caso) => {
    setCasoParaDeletar(caso);
    setModalDeleteOpen(true);
  };

  const confirmarDelecao = async () => {
    if (casoParaDeletar) {
      try {
        await deletarCaso(casoParaDeletar._id);
        setCasos(casos.filter(caso => caso._id !== casoParaDeletar._id));
        setFeedbackType("delete");
        setFeedbackMessage("O caso foi excluído com sucesso!");
        setShowFeedback(true);
      } catch (error) {
        console.error("Erro ao deletar caso:", error);
      }
    }
  };

  const casosFiltrados = casos.filter((caso) => {
    if (!caso || !caso.titulo) return false;

    const nomeMatch = caso.titulo.toLowerCase().includes(search.toLowerCase());
    const statusMatch = filtroStatus === "todos" || caso.status === filtroStatus;
    const data = new Date(caso.dataAbertura);
    const hoje = new Date();

    if (filtro === "semana") {
      const diff = Math.abs(hoje.getTime() - data.getTime());
      const dias = diff / (1000 * 3600 * 24);
      return nomeMatch && statusMatch && dias <= 7;
    }

    if (filtro === "mes") {
      return (
        nomeMatch &&
        statusMatch &&
        data.getMonth() === hoje.getMonth() &&
        data.getFullYear() === hoje.getFullYear()
      );
    }

    if (filtro === "ano") {
      return nomeMatch && statusMatch && data.getFullYear() === hoje.getFullYear();
    }

    return nomeMatch && statusMatch;
  });

  const playPancadaSound = () => {
    const isMuted = localStorage.getItem('soundMuted') === 'true';
    if (isMuted) return;
    
    const audio = new Audio('/assets/Pancada_chaves.mp3');
    audio.volume = 0.3;
    audio.play().catch(error => {
      console.log("Erro ao reproduzir som:", error);
    });
  };

  const handleSalvarNovaEvidencia = async (novaEvidencia: any) => {
    try {
      const dadosEvidencia = {
        tipo: novaEvidencia.tipo,
        dataColeta: new Date().toISOString(),
        coletadoPor: novaEvidencia.coletadoPor,
        descricao: novaEvidencia.descricao || 'Sem descrição',
        caso: casoSelecionado!._id,
        arquivo: novaEvidencia.arquivo
      };

      await adicionarEvidencia(casoSelecionado!._id, dadosEvidencia);
      await carregarEvidencias();
      setModalNovaEvidenciaOpen(false);
      setMostrarSucesso(true);
      
      if (onEvidenciaAdicionada) {
        onEvidenciaAdicionada();
      }
    } catch (error) {
      console.error("Erro ao salvar evidência:", error);
      alert("Erro ao salvar evidência. Por favor, tente novamente.");
    }
  };

  const carregarEvidencias = async () => {
    try {
      const data = await buscarEvidenciasPorCaso(casoSelecionado!._id);
      setCasos(casos.map(caso => ({ ...caso, evidencias: data })));
    } catch (error) {
      console.error("Erro ao carregar evidências:", error);
    }
  };

  const confirmarDelecaoEvidencia = async () => {
    if (evidenciaParaDeletar) {
      try {
        await deletarEvidencia(casoSelecionado!._id, evidenciaParaDeletar._id);
        await carregarEvidencias();
        setModalDeleteOpen(false);
        setEvidenciaParaDeletar(null);
      } catch (error) {
        console.error("Erro ao deletar evidência:", error);
      }
    }
  };

  // Função para estilo do status
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Finalizado":
        return "bg-gradient-to-r from-green-500/10 to-green-500/20 text-green-400 border border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.1)]";
      case "Em andamento":
        return "bg-gradient-to-r from-amber-500/10 to-amber-500/20 text-amber-400 border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.1)]";
      default:
        return "bg-gradient-to-r from-red-500/10 to-red-500/20 text-red-400 border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.1)]";
    }
  };

  return (
    <div className="p-4 sm:p-6 bg-transparent min-h-screen">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-100">
          
        </h1>

        <button
          onClick={() => {
            playPancadaSound();
            setModalOpen(true);
          }}
          className="group relative inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-[#1A3446] to-[#1A3446] rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/20 cursor-pointer overflow-hidden"
        >
          {/* Efeito de borda gradiente */}
          <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-amber-500/50 via-amber-600/50 to-amber-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ padding: '1px' }}>
            <span className="absolute inset-0 rounded-lg bg-[#1A3446]" />
          </span>

          {/* Efeito de brilho */}
          <span className="absolute inset-0 bg-gradient-to-r from-amber-600/0 via-amber-600/20 to-amber-600/0 opacity-0 group-hover:opacity-100 group-hover:animate-shimmer" />

          {/* Efeito de partículas no hover */}
          <span className="absolute inset-0 opacity-0 group-hover:opacity-100">
            <span className="absolute top-1/2 left-1/2 w-1 h-1 bg-amber-500/40 rounded-full transform -translate-x-1/2 -translate-y-1/2 group-hover:animate-particle1" />
            <span className="absolute top-1/2 left-1/2 w-1 h-1 bg-amber-500/40 rounded-full transform -translate-x-1/2 -translate-y-1/2 group-hover:animate-particle2" />
            <span className="absolute top-1/2 left-1/2 w-1 h-1 bg-amber-500/40 rounded-full transform -translate-x-1/2 -translate-y-1/2 group-hover:animate-particle3" />
          </span>

          {/* Ícone */}
          <span className="relative flex items-center justify-center w-6 h-6 rounded-full bg-amber-500/20 group-hover:bg-amber-500/30 transition-colors duration-300">
            <svg
              className="w-4 h-4 text-amber-500 group-hover:text-amber-400 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-180"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
          </span>

          {/* Texto */}
          <span className="relative font-medium text-amber-500 group-hover:text-amber-400 transition-colors duration-300">
            Novo Caso
          </span>
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div className="flex flex-wrap gap-4">
          <div ref={dropdownDataRef} className="relative">
          <button
              onClick={() => {
                setDropdownDataAberto(!dropdownDataAberto);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800/80 hover:bg-gray-700/80 border border-gray-700 rounded-lg transition-all duration-300 group"
            >
              <FaCalendarAlt className="text-amber-500 group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-gray-200">{getTextoFiltroData()}</span>
              <FaChevronDown className={`text-gray-400 transition-transform duration-300 ${dropdownDataAberto ? 'rotate-180' : ''}`} />
          </button>

            <div className={`absolute z-50 w-48 mt-2 bg-gray-800/95 border border-gray-700 rounded-lg shadow-xl backdrop-blur-sm transition-all duration-300 ${
              dropdownDataAberto 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-2 pointer-events-none'
            }`}>
              {["todos", "semana", "mes", "ano"].map((opcao) => (
          <button
                  key={opcao}
                  onClick={() => {
                    setFiltro(opcao);
                    setDropdownDataAberto(false);
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-700/50 first:rounded-t-lg last:rounded-b-lg transition-colors duration-300 group ${
                    filtro === opcao ? 'bg-gray-700/80 text-amber-500' : 'text-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      filtro === opcao ? 'bg-amber-500 scale-125' : 'bg-gray-500 group-hover:bg-gray-400'
                    }`} />
                    {opcao === "todos" && "Todos os Períodos"}
                    {opcao === "semana" && "Esta Semana"}
                    {opcao === "mes" && "Este Mês"}
                    {opcao === "ano" && "Este Ano"}
                  </div>
          </button>
              ))}
            </div>
          </div>

          <div ref={dropdownStatusRef} className="relative">
          <button
              onClick={() => setDropdownStatusAberto(!dropdownStatusAberto)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800/80 hover:bg-gray-700/80 border border-gray-700 rounded-lg transition-all duration-300 group"
            >
              <FaFilter className="text-amber-500 group-hover:rotate-12 transition-transform duration-300" />
              <span className="text-gray-200">
                {filtroStatus === "todos" ? "Todos os Status" : filtroStatus}
              </span>
              <FaChevronDown className={`text-gray-400 transition-transform duration-300 ${dropdownStatusAberto ? 'rotate-180' : ''}`} />
          </button>

            <div className={`absolute z-50 w-48 mt-2 bg-gray-800/95 border border-gray-700 rounded-lg shadow-xl backdrop-blur-sm transition-all duration-300 ${
              dropdownStatusAberto 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 translate-y-2 pointer-events-none'
            }`}>
              {["todos", "Em andamento", "Finalizado", "Arquivado"].map((status) => (
          <button
                  key={status}
                  onClick={() => {
                    setFiltroStatus(status);
                    setDropdownStatusAberto(false);
                  }}
                  className={`w-full px-4 py-3 text-left hover:bg-gray-700/50 first:rounded-t-lg last:rounded-b-lg transition-colors duration-300 group ${
                    filtroStatus === status ? 'bg-gray-700/80' : ''
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      status === "todos" 
                        ? (filtroStatus === status ? 'bg-amber-500 scale-125' : 'bg-gray-500')
                        : `${getCorStatus(status)} ${filtroStatus === status ? 'scale-125' : ''}`
                    }`} />
                    <span className={
                      filtroStatus === status 
                        ? getCorStatus(status) 
                        : 'text-gray-300'
                    }>
                      {status === "todos" ? "Todos os Status" : status}
                    </span>
                  </div>
          </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Versão Desktop - Tabela */}
      <div className="hidden sm:block overflow-x-auto rounded-lg border border-gray-700 shadow bg-gray-800/80 backdrop-blur-sm">
        <table className="min-w-full bg-transparent text-sm">
          <thead className="bg-gray-750/80 text-gray-300 text-left backdrop-blur-sm">
            <tr>
              <th className="px-4 sm:px-6 py-3 font-medium">Nome do Caso</th>
              <th className="px-4 sm:px-6 py-3 font-medium">Status</th>
              <th className="px-4 sm:px-6 py-3 font-medium">Data</th>
              <th className="px-4 sm:px-6 py-3 font-medium text-center">
                Ações
              </th>
            </tr>
          </thead>
          <tbody>
            {casosFiltrados.length === 0 ? (
              <tr>
                <td
                  colSpan={4}
                  className="text-center px-6 py-10 text-gray-500"
                >
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <svg
                      className="h-12 w-12 text-gray-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    <p>Nenhum caso encontrado</p>
                  </div>
                </td>
              </tr>
            ) : (
              casosFiltrados.map((caso) => (
                <tr
                  key={caso._id}
                  className="border-t border-gray-700 hover:bg-gray-750/50 transition-colors"
                >
                  <td className="px-4 sm:px-6 py-4 text-gray-200">
                    {caso.titulo}
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <span className={`
                      inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                      transition-all duration-300 hover:scale-105 cursor-default
                      ${getStatusStyle(caso.status)}
                    `}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-2 ${
                        caso.status === "Finalizado" ? "bg-green-400" :
                        caso.status === "Em andamento" ? "bg-amber-400" : "bg-red-400"
                      } animate-pulse`}/>
                      {caso.status}
                    </span>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-gray-300">
                    {new Date(caso.dataAbertura).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => setCasoSelecionado(caso)}
                        className="group relative inline-flex items-center gap-2 px-4 py-2 bg-[#1A2B3B] rounded-lg overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-amber-500/20"
                      >
                        <span className="absolute inset-0 bg-gradient-to-r from-amber-600/0 via-amber-600/40 to-amber-600/0 opacity-0 group-hover:opacity-100 group-hover:animate-shimmer" />
                        <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-amber-500/50 to-amber-600/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ padding: '1px' }}>
                          <span className="absolute inset-0 rounded-lg bg-[#1A2B3B]" />
                        </span>
                        <FaEye className="relative z-10 text-amber-500 group-hover:text-amber-400 transform group-hover:scale-110 transition-all duration-300" />
                        <span className="relative z-10 text-amber-500 group-hover:text-amber-400 font-medium transition-colors duration-300">
                          Visualizar
                        </span>
                      </button>

                      <button
                        onClick={() => handleEditarCaso(caso)}
                        className="group relative inline-flex items-center gap-2 px-4 py-2 bg-[#1A2B3B] rounded-lg overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-blue-500/20"
                      >
                        <span className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/40 to-blue-600/0 opacity-0 group-hover:opacity-100 group-hover:animate-shimmer" />
                        <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/50 to-blue-600/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ padding: '1px' }}>
                          <span className="absolute inset-0 rounded-lg bg-[#1A2B3B]" />
                        </span>
                        <FaEdit className="relative z-10 text-blue-500 group-hover:text-blue-400 transform group-hover:scale-110 transition-all duration-300" />
                        <span className="relative z-10 text-blue-500 group-hover:text-blue-400 font-medium transition-colors duration-300">
                          Editar
                        </span>
                      </button>

                      <button
                        onClick={() => handleDeletarCaso(caso)}
                        className="group relative inline-flex items-center gap-2 px-4 py-2 bg-[#1A2B3B] rounded-lg overflow-hidden transition-all duration-300 cursor-pointer hover:shadow-lg hover:shadow-red-500/20"
                      >
                        <span className="absolute inset-0 bg-gradient-to-r from-red-600/0 via-red-600/40 to-red-600/0 opacity-0 group-hover:opacity-100 group-hover:animate-shimmer" />
                        <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-red-500/50 to-red-600/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ padding: '1px' }}>
                          <span className="absolute inset-0 rounded-lg bg-[#1A2B3B]" />
                        </span>
                        <FaTrash className="relative z-10 text-red-500 group-hover:text-red-400 transform group-hover:scale-110 transition-all duration-300" />
                        <span className="relative z-10 text-red-500 group-hover:text-red-400 font-medium transition-colors duration-300">
                          Excluir
                        </span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Versão Mobile - Cards */}
      <div className="sm:hidden space-y-4">
          {casosFiltrados.length === 0 ? (
          <div className="text-center px-6 py-10 text-gray-500 bg-gray-800/80 rounded-lg border border-gray-700">
              <div className="flex flex-col items-center justify-center space-y-2">
                <svg
                  className="h-12 w-12 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              <p>Nenhum caso encontrado</p>
              </div>
            </div>
          ) : (
            casosFiltrados.map((caso) => (
              <div
                key={caso._id}
              className="bg-gray-800/80 rounded-lg border border-gray-700 p-4 space-y-3 backdrop-blur-sm"
              >
              <div className="flex justify-between items-start">
                <h3 className="text-gray-200 font-medium">{caso.titulo}</h3>
                  <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    caso.status === "Finalizado"
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : caso.status === "Em andamento"
                      ? "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                      : "bg-red-500/20 text-red-400 border border-red-500/30"
                    }`}
                  >
                    {caso.status}
                  </span>
                </div>

              <div className="text-gray-400 text-sm">
                {new Date(caso.dataAbertura).toLocaleDateString("pt-BR")}
              </div>

              <div className="flex flex-wrap gap-2 pt-2">
                    <button
                      onClick={() => setCasoSelecionado(caso)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 text-amber-500 rounded-lg text-sm font-medium hover:bg-amber-500/20 transition-colors"
                >
                  <FaEye className="h-4 w-4" />
                  Visualizar
                    </button>

                    <button
                  onClick={() => handleEditarCaso(caso)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 text-blue-500 rounded-lg text-sm font-medium hover:bg-blue-500/20 transition-colors"
                      >
                  <FaEdit className="h-4 w-4" />
                  Editar
                    </button>

                <button
                  onClick={() => handleDeletarCaso(caso)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 text-red-500 rounded-lg text-sm font-medium hover:bg-red-500/20 transition-colors"
                >
                  <FaTrash className="h-4 w-4" />
                  Excluir
                    </button>
                </div>
              </div>
            ))
          )}
      </div>

      {modalOpen && (
      <ModalNovoCasoPerito
        isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditandoCaso(undefined);
            setCasoSelecionado(null);
          }}
          onSubmit={handleSubmitCaso}
          casoEditando={editandoCaso}
        />
      )}

      {modalEditarOpen && editandoCaso && (
        <ModalEditarCaso
          isOpen={modalEditarOpen}
          onClose={() => {
            setModalEditarOpen(false);
            setEditandoCaso(undefined);
            setCasoSelecionado(null);
          }}
        onSubmit={handleSubmitCaso}
          caso={editandoCaso}
      />
      )}

      {casoSelecionado && !modalOpen && !modalEditarOpen && (
        <ModalVisualizacaoPerito
          isOpen={!!casoSelecionado}
          onClose={() => setCasoSelecionado(null)}
          caso={casoSelecionado}
          onEvidenciaAdicionada={() => {
            // Recarregar casos após adicionar evidência
            const carregarCasos = async () => {
              try {
                const token = localStorage.getItem("token");
                const response = await api.get("/api/cases", {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                });
                setCasos(response.data.casos);
              } catch (error) {
                console.error("Erro ao buscar casos:", error);
              }
            };
            carregarCasos();
          }}
        />
      )}

      {modalDeleteOpen && casoParaDeletar && (
        <ModalConfirmacaoDelete
          isOpen={modalDeleteOpen}
          onClose={() => {
            setModalDeleteOpen(false);
            setCasoParaDeletar(null);
          }}
          onConfirm={confirmarDelecao}
          titulo={casoParaDeletar.titulo}
        />
      )}

      {showFeedback && (
        <FeedbackModal
          type={feedbackType}
          message={feedbackMessage}
          onClose={() => setShowFeedback(false)}
        />
      )}
    </div>
  );
}
