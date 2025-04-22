"use client";
import { useState, useEffect } from "react";
import {
  FaTimes,
  FaVenus,
  FaMars,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaDownload,
  FaPrint,
  FaPlus,
  FaRegFilePdf,
} from "react-icons/fa";
import Image from "next/image";
import ModalNovaEvidencia from "../ModalNovaEvidencia";
import EvidenciasSalvaSucess from "../EvidenciasSalvaSucess";
import ModalGerarLaudo from "../ModalGerarLaudo";
import CaveiraPeste from "../../../public/assets/CaveiraPeste.png";
import Logo from "../../../public/assets/Logo.png";

interface Evidencia {
  _id: string;
  nome: string;
  tipo: string;
  descricao: string;
  coletadoPor: string;
  arquivo: string;
  laudo?: string;
  dataAdicao: string;
  mimeType?: string;
}

interface Caso {
  _id: string;
  titulo: string;
  data: string;
  sexo: string;
  local: string;
  descricao: string;
  status: string;
  evidencias: Evidencia[];
}

interface NovaEvidencia {
  descricao: string;
  data: string;
  tipo: string;
  coletadoPor: string;
  arquivo: File | null;
}

export default function ModalVisualizacaoPerito({
  isOpen,
  onClose,
  caso,
}: {
  isOpen: boolean;
  onClose: () => void;
  caso: Caso;
}) {
  const [showNovaEvidencia, setShowNovaEvidencia] = useState(false);
  const [casoAtual, setCasoAtual] = useState(caso);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedEvidencia, setSelectedEvidencia] = useState<
    Evidencia | undefined
  >(undefined);

  useEffect(() => {
    if (!isOpen) {
      setCasoAtual(caso);
      setSelectedEvidencia(undefined);
    }
  }, [isOpen, caso]);

  const handleNovaEvidencia = (novaEvidencia: NovaEvidencia) => {
    if (!novaEvidencia.arquivo) return;

    const fileUrl = URL.createObjectURL(novaEvidencia.arquivo);

    const novaEvidenciaCompleta: Evidencia = {
      _id: Date.now().toString(),
      nome: novaEvidencia.arquivo.name,
      tipo: novaEvidencia.tipo,
      descricao: novaEvidencia.descricao,
      coletadoPor: novaEvidencia.coletadoPor,
      arquivo: fileUrl,
      dataAdicao: new Date().toISOString(),
      mimeType: novaEvidencia.arquivo.type,
    };

    setCasoAtual((prev) => ({
      ...prev,
      evidencias: [...prev.evidencias, novaEvidenciaCompleta],
    }));
    setShowSuccess(true);
  };

  const handleSaveLaudo = (laudo: string, evidenciaId: string) => {
    setCasoAtual((prev) => ({
      ...prev,
      evidencias: prev.evidencias.map((ev) =>
        ev._id === evidenciaId ? { ...ev, laudo } : ev
      ),
    }));
    setSelectedEvidencia(undefined);
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[200] bg-black/60 flex items-start justify-center p-4 backdrop-blur-xl">
        <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl w-full max-w-6xl min-h-[85vh] h-auto my-8 flex flex-col relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none opacity-5 mix-blend-overlay">
            <Image
              src={CaveiraPeste}
              alt="Caveira decorativa"
              className="object-cover"
              fill
              sizes="100vw"
              priority
            />
          </div>

          <div className="flex justify-between items-center p-6 border-b border-gray-700 bg-gray-850/90">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-8 animate-pulse">
                <Image
                  src={Logo}
                  alt="Logo"
                  className="object-contain"
                  fill
                  sizes="64px"
                  priority
                />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-100">
                  Detalhes do Caso
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  ID do Caso:{" "}
                  <span className="text-amber-500">#{caso._id}</span>
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-amber-500 transition-colors duration-200 cursor-pointer group"
            >
              <FaTimes className="h-7 w-7 group-hover:rotate-90 transition-transform" />
            </button>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-amber-500">
                      Título
                    </label>
                    <p className="bg-gray-700/50 p-4 rounded-lg text-gray-200 text-lg">
                      {casoAtual.titulo}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-amber-500">
                        <FaCalendarAlt className="inline mr-2" />
                        Data
                      </label>
                      <p className="bg-gray-700/50 p-4 rounded-lg text-gray-200">
                        {new Date(casoAtual.data).toLocaleDateString("pt-BR")}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-amber-500">
                        Sexo
                      </label>
                      <div className="bg-gray-700/50 p-4 rounded-lg flex items-center gap-3">
                        {casoAtual.sexo === "feminino" ? (
                          <>
                            <FaVenus className="text-pink-400 text-xl" />
                            <span className="text-gray-200">Feminino</span>
                          </>
                        ) : (
                          <>
                            <FaMars className="text-blue-400 text-xl" />
                            <span className="text-gray-200">Masculino</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-amber-500">
                      <FaMapMarkerAlt className="inline mr-2" />
                      Local
                    </label>
                    <p className="bg-gray-700/50 p-4 rounded-lg text-gray-200">
                      {casoAtual.local}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-amber-500">
                      Status
                    </label>
                    <div
                      className={`p-4 rounded-lg text-lg ${
                        casoAtual.status === "Concluído"
                          ? "bg-green-900/30 text-green-400"
                          : casoAtual.status === "Em análise"
                          ? "bg-amber-900/30 text-amber-400"
                          : "bg-red-900/30 text-red-400"
                      }`}
                    >
                      {casoAtual.status}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-amber-500">
                        Evidências
                      </h3>
                      <button
                        onClick={() => setShowNovaEvidencia(true)}
                        className="flex items-center px-4 py-2 bg-amber-800/30 hover:bg-amber-800/50 border border-amber-900/50 rounded-lg transition-all cursor-pointer hover:scale-[1.02] active:scale-95"
                      >
                        <FaPlus className="mr-2 text-amber-500" />
                        <span className="text-amber-100">Nova Evidência</span>
                      </button>
                    </div>

                    <div className="border border-amber-900/30 rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-amber-900/20">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-amber-500">
                              Nome
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-amber-500">
                              Tipo
                            </th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-amber-500">
                              Data
                            </th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-amber-500">
                              Ações
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {casoAtual.evidencias.map((evidencia) => (
                            <tr
                              key={evidencia._id}
                              className="border-t border-amber-900/30 hover:bg-amber-900/10 transition-colors"
                            >
                              <td className="px-4 py-3 text-sm text-gray-200 font-mono">
                                {evidencia.nome}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-200">
                                {evidencia.tipo}
                              </td>
                              <td className="px-4 py-3 text-sm text-amber-500 font-mono">
                                {new Date(
                                  evidencia.dataAdicao
                                ).toLocaleDateString("pt-BR")}
                              </td>
                              <td className="px-4 py-3 text-right">
                                <button
                                  onClick={() =>
                                    setSelectedEvidencia(evidencia)
                                  }
                                  className={`px-3 py-1 rounded-md text-sm transition-all ${
                                    evidencia.laudo
                                      ? "bg-green-900/30 text-green-400 hover:bg-green-900/50"
                                      : "bg-amber-900/30 text-amber-400 hover:bg-amber-900/50"
                                  }`}
                                >
                                  {evidencia.laudo
                                    ? "Editar Laudo"
                                    : "Gerar Laudo"}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <label className="block text-sm font-medium mb-2 text-amber-500">
                  Descrição
                </label>
                <p className="bg-gray-700/50 p-4 rounded-lg text-gray-200 whitespace-pre-line">
                  {casoAtual.descricao}
                </p>
              </div>
            </div>

            <div className="p-6 border-t border-amber-900/30 bg-gray-850">
              <div className="flex flex-wrap gap-4 justify-end">
                <button className="flex items-center px-5 py-2.5 bg-amber-800/30 hover:bg-amber-800/50 border border-amber-900/50 rounded-lg transition-all cursor-pointer hover:scale-[1.02] active:scale-95">
                  <FaRegFilePdf className="mr-2 text-amber-500" />
                  <span className="text-amber-100">Gerar Relatório</span>
                </button>
                <button className="flex items-center px-5 py-2.5 bg-amber-800/30 hover:bg-amber-800/50 border border-amber-900/50 rounded-lg transition-all cursor-pointer hover:scale-[1.02] active:scale-95">
                  <FaDownload className="mr-2 text-amber-500" />
                  <span className="text-amber-100">Exportar PDF</span>
                </button>
                <button className="flex items-center px-5 py-2.5 bg-amber-800/30 hover:bg-amber-800/50 border border-amber-900/50 rounded-lg transition-all cursor-pointer hover:scale-[1.02] active:scale-95">
                  <FaPrint className="mr-2 text-amber-500" />
                  <span className="text-amber-100">Imprimir</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <ModalNovaEvidencia
        isOpen={showNovaEvidencia}
        onClose={() => setShowNovaEvidencia(false)}
        caso={casoAtual}
        onSave={handleNovaEvidencia}
      />

      <ModalGerarLaudo
        isOpen={!!selectedEvidencia}
        onClose={() => setSelectedEvidencia(undefined)}
        onSave={handleSaveLaudo}
        evidencia={selectedEvidencia}
      />

      {showSuccess && (
        <EvidenciasSalvaSucess onClose={() => setShowSuccess(false)} />
      )}
    </>
  );
}
