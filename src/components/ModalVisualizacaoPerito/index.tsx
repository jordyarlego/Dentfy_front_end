"use client";
import { useState, useEffect } from "react";
import { FaTimes, FaPlus, FaFileAlt, FaImage, FaVideo, FaTrash, FaFileDownload, FaEye } from "react-icons/fa";
import Image from "next/image";
import CaveiraPeste from "../../../public/assets/CaveiraPeste.png";
import Logo from "../../../public/assets/Logo.png";
import ModalNovaEvidencia from "../ModalNovaEvidencia";
import EvidenciasSalvaSucess from "../EvidenciasSalvaSucess";
import ModalGerarLaudo from "../ModalGerarLaudo";
import { CasoData, Evidencia, adicionarEvidencia, atualizarEvidencia, deletarEvidencia, atualizarCaso, deletarCaso } from "../ModalNovoCasoPerito/API_NovoCaso";
import { postEvidencia, getEvidenciaByCaseId, deleteEvidencia as deleteEvidenciaAPI } from '../../../services/api_nova_evidencia';
import ModalRelatorio from "../ModalRelatorio";
import ModalConfirmacaoDelete from "../ModalConfirmacaoDelete";
import ModalGerarLaudoEvidencia from "../ModalGerarLaudoEvidencia";

interface CasoCompleto extends CasoData {
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
  caso: CasoCompleto;
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
  const [modalGerarRelatorioOpen, setModalGerarRelatorioOpen] = useState(false);
  const [evidenciaSelecionada, setEvidenciaSelecionada] = useState<Evidencia | null>(null);
  const [modalRelatorioOpen, setModalRelatorioOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [evidenciaParaDeletar, setEvidenciaParaDeletar] = useState<Evidencia | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = 'auto';
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && caso._id) {
      carregarEvidencias();
    }
  }, [isOpen, caso._id]);

  const carregarEvidencias = async () => {
    try {
      const data = await getEvidenciaByCaseId(caso._id);
      setEvidencias(data);
    } catch (error) {
      console.error("Erro ao carregar evidências:", error);
    }
  };

  if (!isOpen) return null;

  const handleSalvarNovaEvidencia = async (novaEvidencia: any) => {
    try {
      const dadosEvidencia: CriarEvidenciaAPI = {
        tipo: novaEvidencia.tipo,
        dataColeta: new Date().toISOString(),
        coletadoPor: novaEvidencia.coletadoPor,
        descricao: novaEvidencia.descricao || 'Sem descrição',
        caso: caso._id,
        arquivo: novaEvidencia.arquivo
      };

      console.log('Enviando evidência:', dadosEvidencia);

      await postEvidencia(dadosEvidencia);
      await carregarEvidencias();
      setModalNovaEvidenciaOpen(false);
      setMostrarSucesso(true);
      
      if (onEvidenciaAdicionada) {
        onEvidenciaAdicionada();
      }
    } catch (error) {
      console.error("Erro ao salvar evidência:", error);
      // Adicionar feedback visual de erro
      alert("Erro ao salvar evidência. Por favor, tente novamente.");
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

  const handleDeletarEvidencia = (evidencia: Evidencia) => {
    setEvidenciaParaDeletar(evidencia);
    setModalDeleteOpen(true);
  };

  const handleDeletarCaso = () => {
    setShowDeleteConfirm(true);
  };

  const confirmarDelecao = async () => {
    try {
      await deletarCaso(caso._id);
      onClose();
      // Aqui você pode adicionar uma notificação de sucesso se desejar
    } catch (error) {
      console.error("Erro ao deletar caso:", error);
      // Aqui você pode adicionar uma notificação de erro se desejar
    }
  };

  const handleGerarRelatorio = () => {
    setModalGerarRelatorioOpen(true);
  };

  const confirmarDelecaoEvidencia = async () => {
    if (evidenciaParaDeletar) {
      try {
        await deleteEvidenciaAPI(evidenciaParaDeletar._id);
        await carregarEvidencias();
        setModalDeleteOpen(false);
        setEvidenciaParaDeletar(null);
      } catch (error) {
        console.error("Erro ao deletar evidência:", error);
      }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-gray-900/50">
      <div className="bg-[#0E1A26]/95 w-[95%] max-w-[1000px] max-h-[90vh] rounded-2xl shadow-2xl border border-gray-700 overflow-hidden animate-modalEntry">
        <div className="relative p-6 border-b border-gray-700 bg-gradient-to-r from-[#0E1A26] via-[#152736] to-[#0E1A26]">
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
            <div className="flex items-center gap-4">
              <button
                onClick={() => setModalRelatorioOpen(true)}
                className="text-amber-100 hover:text-amber-500 transition-all duration-300 group flex items-center gap-2 cursor-pointer hover:scale-105"
              >
                <FaFileAlt className="h-6 w-6 group-hover:scale-110 transition-transform" />
                Gerar Relatório
              </button>
              <button
                onClick={handleDeletarCaso}
                className="text-amber-100 hover:text-amber-500 transition-all duration-300 group cursor-pointer hover:scale-105"
              >
                <FaTrash className="h-6 w-6 group-hover:scale-110 transition-transform" />
              </button>
              <button
                onClick={onClose}
                className="text-amber-100 hover:text-amber-500 transition-all duration-300 group cursor-pointer hover:scale-105"
              >
                <FaTimes className="h-6 w-6 group-hover:rotate-90 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 flex flex-col h-full">
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-4">
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
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-amber-500">Evidências</h3>
              <button
                onClick={() => setModalNovaEvidenciaOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all duration-300 group"
              >
                <FaPlus className="group-hover:rotate-90 transition-transform" />
                Nova Evidência
              </button>
            </div>

            <div className="overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
              <div className="grid grid-cols-1 gap-4">
                {evidencias.map((evidencia, index) => (
                  <div
                    key={index}
                    className="bg-gray-800/30 p-4 rounded-lg border border-gray-700 hover:border-amber-500/50 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-amber-100 font-medium">{evidencia.nome}</h4>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setEvidenciaSelecionada(evidencia)}
                          className="text-gray-400 hover:text-amber-400 transition-all duration-300 cursor-pointer hover:scale-110"
                        >
                          <FaEye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeletarEvidencia(evidencia)}
                          className="text-gray-400 hover:text-red-400 transition-all duration-300 cursor-pointer hover:scale-110"
                        >
                          <FaTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">{evidencia.descricao}</p>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                        {evidencia.tipo}
                      </span>
                      <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                        {evidencia.coletadoPor}
                      </span>
                    </div>
                    {evidencia.laudo && (
                      <div className="mt-2">
                        <h5 className="text-xs font-medium text-amber-500 mb-1">Laudo</h5>
                        <p className="text-gray-300 text-sm">{evidencia.laudo}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-700 bg-gradient-to-r from-[#0E1A26] via-[#152736] to-[#0E1A26]">
          <div className="flex justify-end gap-4">
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-6 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-all duration-300"
            >
              <FaTimes />
              Fechar
            </button>
          </div>
        </div>
      </div>

      <ModalNovaEvidencia
        isOpen={modalNovaEvidenciaOpen}
        onClose={() => setModalNovaEvidenciaOpen(false)}
        onSave={handleSalvarNovaEvidencia}
        casoId={caso._id}
      />

      {evidenciaSelecionada && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-[#0E1A26] border border-amber-500/30 rounded-xl shadow-2xl w-full max-w-4xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-amber-100">Detalhes da Evidência</h3>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => {
                    setEvidenciaParaLaudo(evidenciaSelecionada);
                    setEvidenciaSelecionada(null);
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-300 hover:scale-105"
                >
                  <FaFileAlt className="text-sm" />
                  Gerar Laudo
                </button>
                <button
                  onClick={() => setEvidenciaSelecionada(null)}
                  className="text-amber-100 hover:text-amber-500 transition-all duration-300"
                >
                  <FaTimes className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {evidenciaSelecionada.tipo === "imagem" && (
                <div className="relative w-full h-64 rounded-lg overflow-hidden">
                  <Image
                    src={evidenciaSelecionada.arquivo}
                    alt={evidenciaSelecionada.nome}
                    fill
                    className="object-contain"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-amber-500 mb-2">Nome</h4>
                  <p className="text-gray-200">{evidenciaSelecionada.nome}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-amber-500 mb-2">Tipo</h4>
                  <p className="text-gray-200">{evidenciaSelecionada.tipo}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-amber-500 mb-2">Coletado Por</h4>
                  <p className="text-gray-200">{evidenciaSelecionada.coletadoPor}</p>
                </div>

                <div>
                  <h4 className="text-sm font-medium text-amber-500 mb-2">Data de Adição</h4>
                  <p className="text-gray-200">
                    {new Date(evidenciaSelecionada.dataAdicao).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-amber-500 mb-2">Descrição</h4>
                <p className="text-gray-200">{evidenciaSelecionada.descricao}</p>
              </div>

              {evidenciaSelecionada.tipo === "texto" && (
                <div>
                  <h4 className="text-sm font-medium text-amber-500 mb-2">Conteúdo</h4>
                  <div className="bg-gray-800/50 p-4 rounded-lg">
                    <p className="text-gray-200 whitespace-pre-wrap">{evidenciaSelecionada.arquivo}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {mostrarSucesso && (
        <EvidenciasSalvaSucess
          onClose={() => setMostrarSucesso(false)}
        />
      )}

      {evidenciaParaLaudo && (
        <ModalGerarLaudoEvidencia
          isOpen={!!evidenciaParaLaudo}
          onClose={() => setEvidenciaParaLaudo(null)}
          evidencia={evidenciaParaLaudo}
          onLaudoSaved={carregarEvidencias}
        />
      )}

      {modalGerarRelatorioOpen && (
        <ModalGerarLaudo
          isOpen={modalGerarRelatorioOpen}
          onClose={() => setModalGerarRelatorioOpen(false)}
          onSave={() => {
            setModalGerarRelatorioOpen(false);
          }}
          evidencia={evidencias[0] || undefined}
        />
      )}

      {modalRelatorioOpen && (
        <ModalRelatorio
          isOpen={modalRelatorioOpen}
          onClose={() => setModalRelatorioOpen(false)}
          caso={caso}
        />
      )}

      {showDeleteConfirm && (
        <ModalConfirmacaoDelete
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={confirmarDelecao}
          titulo={caso.titulo}
        />
      )}

      {modalDeleteOpen && evidenciaParaDeletar && (
        <ModalConfirmacaoDelete
          isOpen={modalDeleteOpen}
          onClose={() => {
            setModalDeleteOpen(false);
            setEvidenciaParaDeletar(null);
          }}
          onConfirm={confirmarDelecaoEvidencia}
          titulo={`evidência do tipo ${evidenciaParaDeletar.tipo}`}
        />
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
          border-radius: 4px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(251, 191, 36, 0.5);
          border-radius: 4px;
          transition: all 0.3s;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(251, 191, 36, 0.7);
        }

        .animate-modalEntry {
          animation: modalEntry 0.3s ease-out forwards;
        }

        @keyframes modalEntry {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </div>
  );
}