"use client";

import api from "../../../lib/axios";
import { useEffect, useState } from "react";
import ModalNovoCasoPerito from "../ModalNovoCasoPerito";
import ModalVisualizacaoPerito from "../ModalVisualizacaoPerito";
import ModalEditarCaso from "../ModalEditarCaso";
import FeedbackModal from "../FeedbackModal";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { atualizarCaso, deletarCaso, CasoData } from "../ModalNovoCasoPerito/API_NovoCaso";
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
}

export interface Caso extends CasoData {
  _id: string;
  evidencias: Evidencia[];
}

export default function CasosPerito() {
  const [search, setSearch] = useState("");
  const [filtro, setFiltro] = useState("todos");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [casoSelecionado, setCasoSelecionado] = useState<Caso | null>(null);
  const [editandoCaso, setEditandoCaso] = useState<CasoData | undefined>(undefined);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState<"success" | "edit" | "delete">("success");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [casoParaDeletar, setCasoParaDeletar] = useState<Caso | null>(null);

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

  const handleSubmitCaso = async (novoCaso: CasoData) => {
    try {
      if (editandoCaso) {
        const casoAtualizado = await atualizarCaso(casoSelecionado!._id, novoCaso);
        setCasos(casos.map(caso => 
          caso._id === casoSelecionado!._id ? { ...casoAtualizado, evidencias: caso.evidencias } : caso
        ));
        setFeedbackType("edit");
        setFeedbackMessage("O caso foi atualizado com sucesso!");
      } else {
        const novoItem: Caso = {
          _id: Math.random().toString(36).substr(2, 9),
          titulo: novoCaso.titulo || "",
          descricao: novoCaso.descricao || "",
          responsavel: novoCaso.responsavel || "",
          status: novoCaso.status || "Em andamento",
          tipo: novoCaso.tipo || "Vitima",
          dataAbertura: novoCaso.dataAbertura || new Date().toISOString().split('T')[0],
          sexo: novoCaso.sexo || "Masculino",
          local: novoCaso.local || "",
          evidencias: [],
        };
        setCasos([...casos, novoItem]);
        setFeedbackType("success");
        setFeedbackMessage("Novo caso criado com sucesso!");
      }
      setModalOpen(false);
      setModalEditarOpen(false);
      setEditandoCaso(undefined);
      setCasoSelecionado(null);
      setShowFeedback(true);
    } catch (error) {
      console.error("Erro ao salvar caso:", error);
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
    const data = new Date(caso.dataAbertura);
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
          
        </h1>

        <button
          onClick={() => setModalOpen(true)}
          className="relative bg-gray-800/90 text-gray-100 px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-gray-700 transition-all duration-300 font-medium shadow-md border border-gray-700 hover:border-gray-600 group cursor-pointer w-full sm:w-auto"
        >
          <span className="relative z-10 flex items-center justify-center sm:justify-start gap-2">
            <svg
              className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors"
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
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <div className="flex overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:flex-wrap sm:gap-3 scrollbar-hide">
          <button
            onClick={() => setFiltro("todos")}
            className={`flex-shrink-0 px-4 py-2 rounded-lg transition-all duration-300 font-medium cursor-pointer ${
              filtro === "todos"
                ? "bg-gray-700 text-white shadow hover:bg-gray-600"
                : "bg-gray-800/80 text-gray-300 hover:bg-gray-700/80"
            } border border-gray-700 hover:border-gray-600 backdrop-blur-sm mr-2 sm:mr-0`}
          >
            Todos
          </button>
          <button
            onClick={() => setFiltro("semana")}
            className={`flex-shrink-0 px-4 py-2 rounded-lg transition-all duration-300 font-medium cursor-pointer ${
              filtro === "semana"
                ? "bg-gray-700 text-white shadow hover:bg-gray-600"
                : "bg-gray-800/80 text-gray-300 hover:bg-gray-700/80"
            } border border-gray-700 hover:border-gray-600 backdrop-blur-sm mr-2 sm:mr-0`}
          >
            Esta Semana
          </button>
          <button
            onClick={() => setFiltro("mes")}
            className={`flex-shrink-0 px-4 py-2 rounded-lg transition-all duration-300 font-medium cursor-pointer ${
              filtro === "mes"
                ? "bg-gray-700 text-white shadow hover:bg-gray-600"
                : "bg-gray-800/80 text-gray-300 hover:bg-gray-700/80"
            } border border-gray-700 hover:border-gray-600 backdrop-blur-sm mr-2 sm:mr-0`}
          >
            Este Mês
          </button>
          <button
            onClick={() => setFiltro("ano")}
            className={`flex-shrink-0 px-4 py-2 rounded-lg transition-all duration-300 font-medium cursor-pointer ${
              filtro === "ano"
                ? "bg-gray-700 text-white shadow hover:bg-gray-600"
                : "bg-gray-800/80 text-gray-300 hover:bg-gray-700/80"
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
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-gray-300">
                    {new Date(caso.dataAbertura).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => setCasoSelecionado(caso)}
                        className="group relative inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-amber-500 hover:text-amber-400 transition-all duration-300"
                      >
                        <span className="absolute inset-0 bg-amber-500/10 rounded-lg transform scale-0 group-hover:scale-100 transition-transform duration-300" />
                        <FaEye className="relative z-10 group-hover:scale-110 transition-transform duration-300" />
                        <span className="relative z-10">Visualizar</span>
                      </button>
                      <button
                        onClick={() => handleEditarCaso(caso)}
                        className="group relative inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-500 hover:text-blue-400 transition-all duration-300"
                      >
                        <span className="absolute inset-0 bg-blue-500/10 rounded-lg transform scale-0 group-hover:scale-100 transition-transform duration-300" />
                        <FaEdit className="relative z-10 group-hover:scale-110 transition-transform duration-300" />
                        <span className="relative z-10">Editar</span>
                      </button>
                      <button
                        onClick={() => handleDeletarCaso(caso)}
                        className="group relative inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-red-500 hover:text-red-400 transition-all duration-300"
                      >
                        <span className="absolute inset-0 bg-red-500/10 rounded-lg transform scale-0 group-hover:scale-100 transition-transform duration-300" />
                        <FaTrash className="relative z-10 group-hover:scale-110 transition-transform duration-300" />
                        <span className="relative z-10">Excluir</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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
