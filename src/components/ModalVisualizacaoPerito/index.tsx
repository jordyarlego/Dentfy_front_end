"use client";
import { useState, useEffect } from "react";
import { FaTimes, FaPlus, FaFileAlt, FaImage, FaVideo,  FaTrash } from "react-icons/fa";
import Image from "next/image";
import CaveiraPeste from "../../../public/assets/CaveiraPeste.png";
import Logo from "../../../public/assets/Logo.png";
import ModalNovaEvidencia from "../ModalNovaEvidencia";
import EvidenciasSalvaSucess from "../EvidenciasSalvaSucess";
import ModalGerarLaudo from "../ModalGerarLaudo";
import { CasoData, Evidencia, adicionarEvidencia, atualizarEvidencia, deletarEvidencia, atualizarCaso, deletarCaso } from "../ModalNovoCasoPerito/API_NovoCaso";
import { Caso } from "../CasosPerito";

interface Caso extends CasoData {
  _id: string;
  evidencias?: Evidencia[];
}

interface NovaEvidencia {
  tipo: string;
  descricao: string;
  coletadoPor: string;
  arquivo: File | null;
}

interface ModalVisualizacaoPeritoProps {
  isOpen: boolean;
  onClose: () => void;
  caso: Caso;
  onEvidenciaAdicionada: () => void;
}

export default function ModalVisualizacaoPerito({
  isOpen,
  onClose,
  caso,
  onEvidenciaAdicionada,
}: ModalVisualizacaoPeritoProps) {
  const [modalNovaEvidenciaOpen, setModalNovaEvidenciaOpen] = useState(false);
  const [mostrarSucesso, setMostrarSucesso] = useState(false);
  const [evidenciaParaLaudo, setEvidenciaParaLaudo] = useState<Evidencia | null>(null);
  const [evidencias, setEvidencias] = useState<Evidencia[]>(caso.evidencias || []);
  const [editandoCaso, setEditandoCaso] = useState(false);
  const [casoEditado, setCasoEditado] = useState<Caso>(caso);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'auto';
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const getIconePorTipo = (tipo: string) => {
    switch (tipo.toLowerCase()) {
      case "documento":
        return <FaFileAlt className="text-blue-400" />;
      case "foto":
        return <FaImage className="text-green-400" />;
      case "video":
        return <FaVideo className="text-red-400" />;
      default:
        return <FaFileAlt className="text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (caso.status) {
      case "Finalizado":
        return "bg-green-500";
      case "Em andamento":
        return "bg-amber-500";
      case "Arquivado":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleSalvarNovaEvidencia = async (novaEvidencia: NovaEvidencia) => {
    try {
      const evidenciaParaSalvar: Omit<Evidencia, '_id'> = {
        nome: novaEvidencia.descricao.substring(0, 20) + (novaEvidencia.descricao.length > 20 ? "..." : ""),
        tipo: novaEvidencia.tipo,
        descricao: novaEvidencia.descricao,
        coletadoPor: novaEvidencia.coletadoPor,
        arquivo: novaEvidencia.arquivo?.name || "arquivo_salvo.jpg",
        dataAdicao: new Date().toISOString(),
        mimeType: novaEvidencia.arquivo?.type
      };

      const evidenciaSalva = await adicionarEvidencia(caso._id, evidenciaParaSalvar);
      setEvidencias([...evidencias, evidenciaSalva]);
      setModalNovaEvidenciaOpen(false);
      setMostrarSucesso(true);
      
      if (onEvidenciaAdicionada) {
        onEvidenciaAdicionada();
      }
    } catch (error) {
      console.error("Erro ao salvar evidência:", error);
    }
  };

  const handleSalvarLaudo = async (laudo: string, evidenciaId: string) => {
    try {
      const evidenciaAtualizada = await atualizarEvidencia(caso._id, evidenciaId, { laudo });
      setEvidencias(evidencias.map(ev => 
        ev._id === evidenciaId ? evidenciaAtualizada : ev
      ));
      setEvidenciaParaLaudo(null);
    } catch (error) {
      console.error("Erro ao salvar laudo:", error);
    }
  };

  const handleDeletarEvidencia = async (evidenciaId: string) => {
    try {
      await deletarEvidencia(caso._id, evidenciaId);
      setEvidencias(evidencias.filter(ev => ev._id !== evidenciaId));
    } catch (error) {
      console.error("Erro ao deletar evidência:", error);
    }
  };

  const handleEditarCaso = async () => {
    try {
      const casoAtualizado = await atualizarCaso(caso._id, casoEditado);
      setEditandoCaso(false);
    } catch (error) {
      console.error("Erro ao atualizar caso:", error);
    }
  };

  const handleDeletarCaso = async () => {
    if (window.confirm("Tem certeza que deseja excluir este caso?")) {
      try {
        await deletarCaso(caso._id);
        onClose();
      } catch (error) {
        console.error("Erro ao deletar caso:", error);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="relative bg-[#0E1A26] border border-amber-500/30 rounded-xl shadow-2xl w-full max-w-6xl animate-slideIn">
        <div className="absolute inset-0 pointer-events-none opacity-5 mix-blend-overlay">
          <Image
            src={CaveiraPeste}
            alt="Caveira decorativa"
            className="object-cover"
            fill
          />
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-8 animate-pulse">
                <Image
                  src={Logo}
                  alt="Logo"
                  className="object-contain"
                  fill
                />
              </div>
              <h2 className="text-xl font-bold text-amber-100 border-l-4 border-amber-600 pl-3">
                Detalhes do Caso
              </h2>
            </div>
            <button
              onClick={handleDeletarCaso}
              className="text-amber-100 hover:text-amber-500 transition-colors group"
            >
              <FaTrash className="h-6 w-6 group-hover:scale-110 transition-transform" />
            </button>
            <button
              onClick={onClose}
              className="text-amber-100 hover:text-amber-500 transition-colors group"
            >
              <FaTimes className="h-6 w-6 group-hover:rotate-90 transition-transform" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-amber-500 mb-2">Título</h3>
                <p className="text-gray-200">{caso.titulo}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-amber-500 mb-2">Data de Abertura</h3>
                <p className="text-gray-200">
                  {new Date(caso.dataAbertura).toLocaleDateString("pt-BR")}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-amber-500 mb-2">Sexo</h3>
                <p className="text-gray-200">{caso.sexo}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-amber-500 mb-2">Tipo do Caso</h3>
                <p className="text-gray-200">{caso.tipo}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-amber-500 mb-2">Local</h3>
                <p className="text-gray-200">{caso.local}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-amber-500 mb-2">Responsável</h3>
                <p className="text-gray-200">{caso.responsavel}</p>
              </div>

              <div>
                <h3 className="text-sm font-medium text-amber-500 mb-2">Status</h3>
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

              <div>
                <h3 className="text-sm font-medium text-amber-500 mb-2">Descrição</h3>
                <p className="text-gray-200">{caso.descricao}</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-amber-100">Evidências</h3>
              <button
                onClick={() => setModalNovaEvidenciaOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
              >
                <FaPlus />
                Nova Evidência
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {evidencias.map((evidencia) => (
                <div
                  key={evidencia._id}
                  className="bg-gray-800/50 border border-gray-700 rounded-lg p-4"
                >
                  <h4 className="text-amber-100 font-medium mb-2">{evidencia.nome}</h4>
                  <p className="text-gray-300 text-sm mb-2">{evidencia.descricao}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                      {evidencia.tipo}
                    </span>
                    <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                      {evidencia.coletadoPor}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {modalNovaEvidenciaOpen && (
        <ModalNovaEvidencia
          isOpen={modalNovaEvidenciaOpen}
          onClose={() => setModalNovaEvidenciaOpen(false)}
          onSave={(evidencia) => {
            handleSalvarNovaEvidencia(evidencia);
          }}
        />
      )}

      {mostrarSucesso && (
        <EvidenciasSalvaSucess
          onClose={() => setMostrarSucesso(false)}
        />
      )}

      {evidenciaParaLaudo && (
        <ModalGerarLaudo
          isOpen={!!evidenciaParaLaudo}
          onClose={() => setEvidenciaParaLaudo(null)}
          evidencia={evidenciaParaLaudo}
          onSave={(laudo) => handleSalvarLaudo(laudo, evidenciaParaLaudo._id)}
        />
      )}
    </div>
  );
}