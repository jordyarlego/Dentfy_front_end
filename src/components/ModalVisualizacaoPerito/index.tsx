"use client";
import { useState, useEffect } from "react";
import { FaTimes, FaPlus, FaFileAlt, FaTrash, FaEye, FaPencilAlt } from "react-icons/fa";
import Image from "next/image";
import Logo from "../../../public/assets/Logo.png";
import ModalNovaEvidencia from "../ModalNovaEvidencia";
import EvidenciasSalvaSucess from "../EvidenciasSalvaSucess";
import { CasoData, Evidencia as CasoEvidencia, deletarCaso } from "../ModalNovoCasoPerito/API_NovoCaso";
import { postEvidencia, getEvidenciaByCaseId, deleteEvidencia as deleteEvidenciaAPI, Evidencia as ApiEvidencia } from '../../../services/api_nova_evidencia';
import ModalRelatorio from "../ModalRelatorio";
import ModalConfirmacaoDelete from "../ModalConfirmacaoDelete";
import ModalGerarLaudoEvidencia from "../ModalGerarLaudoEvidencia";
import ModalDetalhesEvidencia from "../ModalDetalhesEvidencia";
import ModalNovaVitima from '../ModalNovaVitima';
import FeedbackModal from '../FeedbackModal';
import ModalEditarVitima from '../ModalEditarVitima';

interface CasoCompleto extends CasoData {
  _id: string;
  evidencias?: CasoEvidencia[];
  dataColeta: string;
}

interface VitimaSalva {
  id: string;
  nomeCompleto: string;
  dataNascimento: string;
  sexo: string;
  endereco: string;
  etnia: string;
  cpf: string;
  nic: string;
}

const getCasoVictims = (casoId: string): VitimaSalva[] => {
  if (typeof window === 'undefined') return [];
  const victims = localStorage.getItem(`caso_${casoId}_victims`);
  return victims ? JSON.parse(victims) : [];
};

const saveCasoVictims = (casoId: string, victims: VitimaSalva[]) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`caso_${casoId}_victims`, JSON.stringify(victims));
};

interface CriarEvidenciaAPI {
  tipo: 'imagem' | 'texto';
  dataColeta: string;
  coletadoPor: string;
  descricao: string;
  caso: string;
  arquivo: File | null;
}

interface NovaEvidenciaForm {
  tipo: 'imagem' | 'texto';
  descricao: string;
  coletadoPor: string;
  arquivo: File | null;
  titulo: string;
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
  const [evidenciaParaLaudo, setEvidenciaParaLaudo] = useState<CasoEvidencia | null>(null);
  const [evidencias, setEvidencias] = useState<CasoEvidencia[]>(caso.evidencias || []);
  const [evidenciaSelecionada, setEvidenciaSelecionada] = useState<CasoEvidencia | null>(null);
  const [modalRelatorioOpen, setModalRelatorioOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [modalDeleteOpen, setModalDeleteOpen] = useState(false);
  const [evidenciaParaDeletar, setEvidenciaParaDeletar] = useState<CasoEvidencia | null>(null);
  const [modalNovaVitimaOpen, setModalNovaVitimaOpen] = useState(false);
  const [victims, setVictims] = useState<VitimaSalva[]>([]);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error' | 'delete', message: string } | null>(null);
  const [modalDeleteVitimaOpen, setModalDeleteVitimaOpen] = useState(false);
  const [vitimaParaDeletar, setVitimaParaDeletar] = useState<VitimaSalva | null>(null);
  const [modalEditarVitimaOpen, setModalEditarVitimaOpen] = useState(false);
  const [vitimaParaEditar, setVitimaParaEditar] = useState<VitimaSalva | null>(null);

  useEffect(() => {
    if (isOpen && caso._id) {
      carregarEvidencias();
      setVictims(getCasoVictims(caso._id));
    }
  }, [isOpen, caso._id]);
  
  const carregarEvidencias = async () => {
    if (!caso._id) return;
    try {
      const data: CasoEvidencia[] = await getEvidenciaByCaseId(caso._id);
      setEvidencias(data);
    } catch (error) {
      console.error("Erro ao carregar evidências:", error);
    }
  };
  
  if (!isOpen) return null;

  const handleSalvarNovaEvidencia = async (novaEvidencia: NovaEvidenciaForm) => {
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
      alert("Erro ao salvar evidência. Por favor, tente novamente.");
    }
  };

  const handleSalvarNovaVitima = (vitima: Omit<VitimaSalva, 'id'>) => {
    const novaVitima: VitimaSalva = { ...vitima, id: Date.now().toString() };
    const updatedVictims = [...victims, novaVitima];
    saveCasoVictims(caso._id, updatedVictims);
    setVictims(updatedVictims);
    setModalNovaVitimaOpen(false);
    setFeedback({ type: 'success', message: 'Vítima adicionada com sucesso!' });
  };

  const handleDeletarVitima = (vitima: VitimaSalva) => {
    setVitimaParaDeletar(vitima);
    setModalDeleteVitimaOpen(true);
  };

  const confirmarDelecaoVitima = () => {
    if (vitimaParaDeletar) {
      const updatedVictims = victims.filter(v => v.id !== vitimaParaDeletar.id);
      saveCasoVictims(caso._id, updatedVictims);
      setVictims(updatedVictims);
      setModalDeleteVitimaOpen(false);
      setVitimaParaDeletar(null);
      setFeedback({ type: 'delete', message: 'Vítima excluída com sucesso!' });
    }
  };

  const handleDeletarEvidencia = (evidencia: CasoEvidencia) => {
    setEvidenciaParaDeletar(evidencia);
    setModalDeleteOpen(true);
  };

  const handleDeletarCaso = () => {
    setShowDeleteConfirm(true);
  };

  const confirmarDelecao = async () => {
    try {
      await deletarCaso(caso._id);
      localStorage.removeItem(`caso_${caso._id}_victims`);
      onClose();
    } catch (error) {
      console.error("Erro ao deletar caso:", error);
    }
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

  const handleGerarLaudo = (evidencia: CasoEvidencia) => {
    setEvidenciaParaLaudo(evidencia);
    setEvidenciaSelecionada(null);
  };

  const handleEditarVitima = (vitima: VitimaSalva) => {
    setVitimaParaEditar(vitima);
    setModalEditarVitimaOpen(true);
  };

  const handleSalvarEdicaoVitima = (updatedVictim: VitimaSalva) => {
    const updatedVictims = victims.map(v => v.id === updatedVictim.id ? updatedVictim : v);
    saveCasoVictims(caso._id, updatedVictims);
    setVictims(updatedVictims);
    setModalEditarVitimaOpen(false);
    setVitimaParaEditar(null);
    setFeedback({ type: 'success', message: 'Vítima editada com sucesso!' });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-[#0E1A26] border border-amber-500/30 rounded-xl shadow-2xl w-full max-w-6xl flex flex-col max-h-[90vh]">
        {/* Cabeçalho */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Image
                src={Logo}
                alt="Logo"
                width={40}
                height={40}
                className="rounded-lg"
              />
              <h2 className="text-2xl font-bold text-amber-500">{caso.titulo}</h2>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setModalRelatorioOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-300 group cursor-pointer"
              >
                <FaFileAlt className="text-sm group-hover:rotate-12 transition-transform" />
                Gerar Relatório
              </button>
              <button
                onClick={onClose}
                className="text-amber-100 hover:text-amber-500 transition-all duration-300 hover:rotate-90 cursor-pointer"
              >
                <FaTimes className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Conteúdo Principal em Duas Colunas */}
        <div className="flex flex-1 min-h-0">
          {/* Coluna Esquerda - Detalhes do Caso + Vítimas */}
          <div className="w-1/2 p-6 overflow-y-auto custom-scrollbar">
            <div className="space-y-4">
              <div className="bg-gray-800/30 p-4 rounded-lg hover:bg-gray-800/40 transition-colors">
                <h3 className="text-lg font-semibold text-amber-500 mb-2">
                  Detalhes do Caso
                </h3>
                <div className="space-y-2">
                  <p className="text-gray-300">
                    <span className="font-medium text-amber-400">Descrição:</span>{" "}
                    <span className="break-words whitespace-pre-wrap">{caso.descricao}</span>
                  </p>
                  <p className="text-gray-300">
                    <span className="font-medium text-amber-400">Status:</span>{" "}
                    <span className="bg-amber-500/20 px-2 py-1 rounded text-amber-400">{caso.status}</span>
                  </p>
                  <p className="text-gray-300">
                    <span className="font-medium text-amber-400">Data de Criação:</span>{" "}
                    {new Date(caso.dataColeta).toLocaleDateString("pt-BR")}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-amber-500 mb-2">Vítimas</h3>
                <div className="grid grid-cols-1 gap-4">
                  {victims.map(vitima => (
                    <div key={vitima.id} className="bg-gray-800/30 p-4 rounded-lg border border-gray-700 hover:border-amber-500/50 transition-all duration-300">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-amber-100 font-medium line-clamp-1">{vitima.nomeCompleto}</h4>
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => handleEditarVitima(vitima)}
                            className="text-gray-400 hover:text-amber-400 transition-all duration-300 cursor-pointer hover:scale-110"
                            title="Editar Vítima"
                          >
                            <FaPencilAlt className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDeletarVitima(vitima)}
                            className="text-gray-400 hover:text-red-400 transition-all duration-300 cursor-pointer hover:scale-110"
                            title="Excluir Vítima"
                          >
                            <FaTrash className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                      <div className="text-gray-300 text-sm space-y-1">
                         <p><span className="font-medium text-amber-400">Nascimento:</span> {new Date(vitima.dataNascimento).toLocaleDateString("pt-BR")}</p>
                         <p><span className="font-medium text-amber-400">Sexo:</span> {vitima.sexo}</p>
                         <p><span className="font-medium text-amber-400">Etnia:</span> {vitima.etnia}</p>
                         <p className="line-clamp-1"><span className="font-medium text-amber-400">Endereço:</span> {vitima.endereco}</p>
                         <p><span className="font-medium text-amber-400">CPF:</span> {vitima.cpf}</p>
                         <p><span className="font-medium text-amber-400">NIC:</span> {vitima.nic}</p>
                      </div>
                    </div>
                  ))}
                  {victims.length === 0 && !modalNovaVitimaOpen && (
                    <p className="text-gray-400 text-center italic">Nenhuma vítima cadastrada para este caso.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Coluna Direita - Lista de Evidências */}
          <div className="w-1/2 border-l border-gray-700 flex flex-col min-h-0">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-amber-500">Evidências</h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setModalNovaEvidenciaOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all duration-300 group cursor-pointer"
                  >
                    <FaPlus className="group-hover:rotate-90 transition-transform" />
                    Nova Evidência
                  </button>
                  <button
                    onClick={() => setModalNovaVitimaOpen(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-amber-400 text-white rounded-lg hover:bg-amber-500 transition-all duration-300 group font-semibold cursor-pointer"
                  >
                    <FaPlus className="group-hover:rotate-90 transition-transform" />
                    Nova vítima
                  </button>
                </div>
              </div>
            </div>

            {/* Lista de Evidências com Scroll */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-6">
              <div className="grid grid-cols-1 gap-4">
                {evidencias.map((evidencia, index) => (
                  <div
                    key={index}
                    className="bg-gray-800/30 p-4 rounded-lg border border-gray-700 hover:border-amber-500/50 transition-all duration-300"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-amber-100 font-medium line-clamp-1">
                        {evidencia.tipo}
                      </h4>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => setEvidenciaSelecionada(evidencia)}
                          className="text-gray-400 hover:text-amber-400 transition-all duration-300 cursor-pointer hover:scale-110"
                          title="Visualizar"
                        >
                          <FaEye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleGerarLaudo(evidencia)}
                          className="text-gray-400 hover:text-amber-400 transition-all duration-300 cursor-pointer hover:scale-110"
                          title="Gerar Laudo"
                        >
                          <FaFileAlt className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeletarEvidencia(evidencia)}
                          className="text-gray-400 hover:text-red-400 transition-all duration-300 cursor-pointer hover:scale-110"
                          title="Excluir"
                        >
                          <FaTrash className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-300 text-sm mb-2 line-clamp-2">
                      {evidencia.descricao}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                        {evidencia.coletadoPor}
                      </span>
                      <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                        {new Date(evidencia.dataColeta).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Rodapé */}
        <div className="p-6 border-t border-gray-700 bg-gradient-to-r from-[#0E1A26] via-[#152736] to-[#0E1A26]">
          <div className="flex justify-end">
            <button
              onClick={handleDeletarCaso}
              className="flex items-center gap-2 px-6 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-all duration-300 group cursor-pointer"
            >
              <FaTrash className="h-5 w-5 group-hover:rotate-12 transition-transform" />
              Excluir Caso
            </button>
          </div>
        </div>
      </div>

      {/* Manter todos os modais existentes */}
      <ModalNovaEvidencia
        isOpen={modalNovaEvidenciaOpen}
        onClose={() => setModalNovaEvidenciaOpen(false)}
        onSave={handleSalvarNovaEvidencia}
        casoId={caso._id}
        usuarioId={"placeholder_usuario_id"}
      />

      <ModalDetalhesEvidencia
        isOpen={!!evidenciaSelecionada}
        onClose={() => setEvidenciaSelecionada(null)}
        evidencia={evidenciaSelecionada as CasoEvidencia}
        onGerarLaudo={handleGerarLaudo}
      />

      {mostrarSucesso && (
        <EvidenciasSalvaSucess
          onClose={() => setMostrarSucesso(false)}
        />
      )}

      {evidenciaParaLaudo && (
        <ModalGerarLaudoEvidencia
          isOpen={!!evidenciaParaLaudo}
          onClose={() => setEvidenciaParaLaudo(null)}
          evidencia={evidenciaParaLaudo as CasoEvidencia}
          onLaudoSaved={carregarEvidencias}
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

      <ModalNovaVitima
        isOpen={modalNovaVitimaOpen}
        onClose={() => setModalNovaVitimaOpen(false)}
        onSave={handleSalvarNovaVitima}
        casoId={caso._id}
      />

      {feedback && (
        <FeedbackModal
          isOpen={!!feedback}
          onClose={() => setFeedback(null)}
          type={feedback.type as 'success' | 'delete' | 'edit'}
          message={feedback.message}
        />
      )}

      {modalDeleteVitimaOpen && vitimaParaDeletar && (
        <ModalConfirmacaoDelete
          isOpen={modalDeleteVitimaOpen}
          onClose={() => {
            setModalDeleteVitimaOpen(false);
            setVitimaParaDeletar(null);
          }}
          onConfirm={confirmarDelecaoVitima}
          titulo={`vítima ${vitimaParaDeletar.nomeCompleto}`}
          buttonText="Excluir Vítima"
        />
      )}

      {modalEditarVitimaOpen && (
        <ModalEditarVitima
          isOpen={modalEditarVitimaOpen}
          onClose={() => setModalEditarVitimaOpen(false)}
          victim={vitimaParaEditar}
          onSave={handleSalvarEdicaoVitima}
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

        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}