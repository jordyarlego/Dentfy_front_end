"use client";
import { useState, useEffect } from "react";
import { FaTimes, FaPlus, FaFileAlt, FaImage, FaVideo, FaEye } from "react-icons/fa";
import Image from "next/image";
import CaveiraPeste from "../../../public/assets/CaveiraPeste.png";
import Logo from "../../../public/assets/Logo.png";
import ModalNovaEvidencia from "../ModalNovaEvidencia";
import EvidenciasSalvaSucess from "../EvidenciasSalvaSucess";
import ModalGerarLaudo from "../ModalGerarLaudo";

interface Evidencia {
  _id: string;
  nome: string;
  tipo: string;
  descricao: string;
  coletadoPor: string;
  arquivo: string;
  dataAdicao: string;
  laudo?: string;
  mimeType?: string;
}

interface Caso {
  _id: string;
  titulo: string;
  status: "Concluído" | "Em análise" | "Pendente" | string;
  data: string;
  sexo: string;
  local: string;
  descricao: string;
  evidencias?: Evidencia[];
}

interface NovaEvidencia {
  tipo: string;
  descricao: string;
  coletadoPor: string;
  arquivo?: File;
}

export default function ModalVisualizacaoPerito({
  isOpen,
  onClose,
  caso: casoAtual,
  onEvidenciaAdicionada,
}: {
  isOpen: boolean;
  onClose: () => void;
  caso: Caso;
  onEvidenciaAdicionada?: () => void;
}) {
  const [mostrarModalNovaEvidencia, setMostrarModalNovaEvidencia] = useState(false);
  const [mostrarSucesso, setMostrarSucesso] = useState(false);
  const [evidenciaParaLaudo, setEvidenciaParaLaudo] = useState<Evidencia | null>(null);
  const [evidencias, setEvidencias] = useState<Evidencia[]>(casoAtual.evidencias || []);

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
    switch (casoAtual.status) {
      case "Concluído":
        return "bg-green-500";
      case "Em análise":
        return "bg-amber-500";
      case "Pendente":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleSalvarNovaEvidencia = async (novaEvidencia: NovaEvidencia) => {
    try {
      const evidenciaSalva: Evidencia = {
        _id: Math.random().toString(36).substring(2, 9),
        nome: novaEvidencia.descricao.substring(0, 20) + (novaEvidencia.descricao.length > 20 ? "..." : ""),
        tipo: novaEvidencia.tipo,
        descricao: novaEvidencia.descricao,
        coletadoPor: novaEvidencia.coletadoPor,
        arquivo: novaEvidencia.arquivo?.name || "arquivo_salvo.jpg",
        dataAdicao: new Date().toISOString(),
        mimeType: novaEvidencia.arquivo?.type
      };

      setEvidencias([...evidencias, evidenciaSalva]);
      setMostrarModalNovaEvidencia(false);
      setMostrarSucesso(true);
      
      if (onEvidenciaAdicionada) {
        onEvidenciaAdicionada();
      }
    } catch (error) {
      console.error("Erro ao salvar evidência:", error);
    }
  };

  const handleSalvarLaudo = (laudo: string, evidenciaId: string) => {
    setEvidencias(evidencias.map(ev => 
      ev._id === evidenciaId ? {...ev, laudo} : ev
    ));
    setEvidenciaParaLaudo(null);
  };

  return (
    <>
      <div className="fixed inset-0 z-[200] overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          
          <div className="relative w-full max-w-4xl max-h-[90vh] bg-gray-800 border border-gray-700 rounded-lg shadow-2xl overflow-hidden flex flex-col">
            <div className="absolute inset-0 pointer-events-none opacity-5 mix-blend-overlay">
              <Image
                src={CaveiraPeste}
                alt="Caveira decorativa"
                className="object-cover"
                fill
                priority
              />
            </div>

            <div className="p-6 overflow-y-auto flex-1">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                  <div className="relative w-16 h-8 animate-pulse">
                    <Image
                      src={Logo}
                      alt="Logo"
                      className="object-contain"
                      fill
                      priority
                    />
                  </div>
                  <h2 className="text-xl font-bold text-gray-100 border-l-4 border-amber-600 pl-3">
                    Visualização do Caso - {casoAtual.titulo}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-amber-500 transition-colors cursor-pointer group"
                >
                  <FaTimes className="h-6 w-6 group-hover:rotate-90 transition-transform" />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-amber-500 mb-1">Status</h3>
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full ${getStatusColor()}`} />
                      <p className="text-gray-200 capitalize">{casoAtual.status}</p>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-amber-500 mb-1">Data</h3>
                    <p className="text-gray-200">
                      {new Date(casoAtual.data).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-amber-500 mb-1">Local</h3>
                    <p className="text-gray-200">{casoAtual.local}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-amber-500 mb-1">Sexo</h3>
                    <p className="text-gray-200 capitalize">{casoAtual.sexo}</p>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-amber-500 mb-2">Descrição</h3>
                <p className="text-gray-300 bg-gray-800/50 p-4 rounded-lg border border-gray-700">
                  {casoAtual.descricao}
                </p>
              </div>

              <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-amber-500">Evidências</h3>
                  <button
                    onClick={() => setMostrarModalNovaEvidencia(true)}
                    className="px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700 transition-colors text-sm flex items-center gap-2 cursor-pointer"
                  >
                    <FaPlus /> Nova Evidência
                  </button>
                </div>

                <div className="overflow-x-auto rounded-lg border border-gray-700">
                  <table className="min-w-full bg-gray-800/80">
                    <thead className="bg-gray-750">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Tipo</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Nome</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Coletado Por</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Data</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-300">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {evidencias.length ? (
                        evidencias.map((evidencia) => (
                          <tr 
                            key={evidencia._id} 
                            className="hover:bg-gray-750/50"
                          >
                            <td className="px-4 py-3 text-sm text-gray-300">
                              <div className="flex items-center gap-2">
                                {getIconePorTipo(evidencia.tipo)}
                                <span className="capitalize">{evidencia.tipo}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-300">{evidencia.nome}</td>
                            <td className="px-4 py-3 text-sm text-gray-300">{evidencia.coletadoPor}</td>
                            <td className="px-4 py-3 text-sm text-gray-300">
                              {new Date(evidencia.dataAdicao).toLocaleDateString("pt-BR")}
                            </td>
                            <td className="px-4 py-3 text-sm text-gray-300">
                              <button
                                onClick={() => setEvidenciaParaLaudo(evidencia)}
                                className="text-amber-500 hover:text-amber-400 transition-colors group flex items-center gap-1 cursor-pointer"
                              >
                                <FaEye className="group-hover:scale-110 transition-transform" />
                                <span>Visualizar</span>
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={5} className="px-4 py-6 text-center text-gray-400">
                            Nenhuma evidência cadastrada
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-700 bg-gray-800/80">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-colors cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      </div>

      <ModalNovaEvidencia
        isOpen={mostrarModalNovaEvidencia}
        onClose={() => setMostrarModalNovaEvidencia(false)}
        caso={{
          _id: casoAtual._id,
          evidencias: casoAtual.evidencias?.map(ev => ({
            _id: ev._id,
            nome: ev.nome,
            tipo: ev.tipo,
            dataAdicao: ev.dataAdicao
          })) || []
        }}
        onSave={handleSalvarNovaEvidencia}
      />

      {mostrarSucesso && (
        <EvidenciasSalvaSucess
          onClose={() => setMostrarSucesso(false)}
        />
      )}

      {evidenciaParaLaudo && (
        <ModalGerarLaudo
          isOpen={!!evidenciaParaLaudo}
          onClose={() => setEvidenciaParaLaudo(null)}
          onSave={handleSalvarLaudo}
          evidencia={evidenciaParaLaudo}
        />
      )}
    </>
  );
}