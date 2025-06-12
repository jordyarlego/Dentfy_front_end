"use client";

import { useState, useEffect } from "react";
import { FaTimes, FaSave, FaUndo, FaTooth } from "react-icons/fa";
import OdontogramaSuccess from "../OdontogramaSuccess";

interface VitimaData {
  _id: string;
  nomeCompleto: string;
  dataNascimento: string;
  sexo: string;
  endereco: string;
  etnia: string;
  cpf: string;
  nic: string;
  caso: string;
}

interface ModalOdontogramaProps {
  isOpen: boolean;
  onClose: () => void;
  vitima: VitimaData | null;
}

interface Dente {
  numero: number;
  status: "saudavel" | "cariado" | "restaurado" | "extraido" | "protesado";
  observacoes: string;
}

export default function ModalOdontograma({
  isOpen,
  onClose,
  vitima,
}: ModalOdontogramaProps) {
  const [dentes, setDentes] = useState<Dente[]>([]);
  const [denteSelecionado, setDenteSelecionado] = useState<Dente | null>(null);
  const [observacao, setObservacao] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessFeedback, setShowSuccessFeedback] = useState(false);

  // Inicializar dentes (1-32)
  useEffect(() => {
    if (isOpen) {
      const dentesIniciais: Dente[] = Array.from({ length: 32 }, (_, i) => ({
        numero: i + 1,
        status: "saudavel",
        observacoes: "",
      }));
      setDentes(dentesIniciais);
      setDenteSelecionado(null);
      setObservacao("");
    }
  }, [isOpen]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "saudavel":
        return "bg-white border-gray-300";
      case "cariado":
        return "bg-red-500 border-red-600";
      case "restaurado":
        return "bg-blue-500 border-blue-600";
      case "extraido":
        return "bg-gray-800 border-gray-700";
      case "protesado":
        return "bg-yellow-500 border-yellow-600";
      default:
        return "bg-white border-gray-300";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "saudavel":
        return "Saudável";
      case "cariado":
        return "Cariado";
      case "restaurado":
        return "Restaurado";
      case "extraido":
        return "Extraído";
      case "protesado":
        return "Protetizado";
      default:
        return "Saudável";
    }
  };

  const handleDenteClick = (dente: Dente) => {
    setDenteSelecionado(dente);
    setObservacao(dente.observacoes);
  };

  const handleStatusChange = (status: Dente["status"]) => {
    if (denteSelecionado) {
      const dentesAtualizados = dentes.map((dente) =>
        dente.numero === denteSelecionado.numero
          ? { ...dente, status, observacoes: observacao }
          : dente
      );
      setDentes(dentesAtualizados);
      setDenteSelecionado({ ...denteSelecionado, status, observacoes: observacao });
    }
  };

  const handleSalvar = async () => {
    setLoading(true);
    try {
      // Aqui você pode implementar a lógica para salvar o odontograma
      console.log("Odontograma salvo:", { vitima: vitima?.nomeCompleto, dentes });
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowSuccessFeedback(true);
      // Fecha o modal após o feedback
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error) {
      console.error("Erro ao salvar odontograma:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDesfazer = () => {
    if (denteSelecionado) {
      const dentesAtualizados = dentes.map((dente) =>
        dente.numero === denteSelecionado.numero
          ? { ...dente, status: "saudavel", observacoes: "" }
          : dente
      );
      setDentes(dentesAtualizados);
      setDenteSelecionado(null);
      setObservacao("");
    }
  };

  if (!isOpen || !vitima) return null;

  return (
    <>
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-[#0E1A26] border border-amber-500/30 rounded-xl shadow-2xl w-full max-w-6xl flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="p-6 border-b border-gray-700 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <FaTooth className="h-8 w-8 text-amber-500" />
              <div>
                <h2 className="text-2xl font-bold text-amber-500">Odontograma</h2>
                <p className="text-gray-300 text-sm">{vitima.nomeCompleto}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-amber-100 hover:text-amber-500 transition-all duration-300 hover:rotate-90 cursor-pointer"
            >
              <FaTimes className="h-6 w-6" />
            </button>
          </div>

          {/* Conteúdo */}
          <div className="flex flex-1 min-h-0">
            {/* Odontograma */}
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700">
                <h3 className="text-lg font-medium text-amber-500 mb-4 text-center">
                  Odontograma - {vitima.nomeCompleto}
                </h3>
                
                {/* Odontograma Superior */}
                <div className="mb-8">
                  <h4 className="text-sm font-medium text-amber-400 mb-3 text-center">Arco Superior</h4>
                  <div className="grid grid-cols-16 gap-1 mb-2">
                    {dentes.slice(0, 16).map((dente) => (
                      <button
                        key={dente.numero}
                        onClick={() => handleDenteClick(dente)}
                        className={`w-8 h-8 rounded-full border-2 transition-all duration-300 hover:scale-110 ${
                          getStatusColor(dente.status)
                        } ${
                          denteSelecionado?.numero === dente.numero
                            ? "ring-2 ring-amber-500"
                            : ""
                        }`}
                        title={`Dente ${dente.numero} - ${getStatusLabel(dente.status)}`}
                      >
                        <span className="text-xs font-bold text-gray-800">
                          {dente.numero}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Odontograma Inferior */}
                <div>
                  <h4 className="text-sm font-medium text-amber-400 mb-3 text-center">Arco Inferior</h4>
                  <div className="grid grid-cols-16 gap-1">
                    {dentes.slice(16, 32).map((dente) => (
                      <button
                        key={dente.numero}
                        onClick={() => handleDenteClick(dente)}
                        className={`w-8 h-8 rounded-full border-2 transition-all duration-300 hover:scale-110 ${
                          getStatusColor(dente.status)
                        } ${
                          denteSelecionado?.numero === dente.numero
                            ? "ring-2 ring-amber-500"
                            : ""
                        }`}
                        title={`Dente ${dente.numero} - ${getStatusLabel(dente.status)}`}
                      >
                        <span className="text-xs font-bold text-gray-800">
                          {dente.numero}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Legenda */}
                <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
                  <h5 className="text-sm font-medium text-amber-400 mb-2">Legenda:</h5>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-white border border-gray-300 rounded-full"></div>
                      <span className="text-gray-300">Saudável</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-red-500 border border-red-600 rounded-full"></div>
                      <span className="text-gray-300">Cariado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-500 border border-blue-600 rounded-full"></div>
                      <span className="text-gray-300">Restaurado</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-gray-800 border border-gray-700 rounded-full"></div>
                      <span className="text-gray-300">Extraído</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-yellow-500 border border-yellow-600 rounded-full"></div>
                      <span className="text-gray-300">Protetizado</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Painel de Controle */}
            <div className="w-80 p-6 border-l border-gray-700 bg-gray-800/20">
              <h3 className="text-lg font-medium text-amber-500 mb-4">
                Controles
              </h3>
              
              {denteSelecionado ? (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-amber-400 mb-2">
                      Dente {denteSelecionado.numero}
                    </h4>
                    <p className="text-gray-300 text-sm mb-3">
                      Status atual: {getStatusLabel(denteSelecionado.status)}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-amber-400 mb-2">
                      Alterar Status
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {(["saudavel", "cariado", "restaurado", "extraido", "protesado"] as const).map((status) => (
                        <button
                          key={status}
                          onClick={() => handleStatusChange(status)}
                          className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                            denteSelecionado.status === status
                              ? "bg-amber-500 text-white"
                              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                          }`}
                        >
                          {getStatusLabel(status)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-amber-400 mb-2">
                      Observações
                    </label>
                    <textarea
                      value={observacao}
                      onChange={(e) => {
                        setObservacao(e.target.value);
                        if (denteSelecionado) {
                          const dentesAtualizados = dentes.map((dente) =>
                            dente.numero === denteSelecionado.numero
                              ? { ...dente, observacoes: e.target.value }
                              : dente
                          );
                          setDentes(dentesAtualizados);
                          setDenteSelecionado({ ...denteSelecionado, observacoes: e.target.value });
                        }
                      }}
                      className="w-full px-3 py-2 bg-gray-800/30 border border-gray-700 rounded-lg text-gray-100 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 resize-none"
                      rows={3}
                      placeholder="Adicione observações sobre o dente..."
                    />
                  </div>

                  <button
                    onClick={handleDesfazer}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300"
                  >
                    <FaUndo className="h-4 w-4" />
                    Desfazer Alterações
                  </button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <FaTooth className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-400 text-sm">
                    Clique em um dente para selecioná-lo e fazer alterações
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-700 bg-gradient-to-r from-[#0E1A26] via-[#152736] to-[#0E1A26]">
            <div className="flex justify-end gap-4">
              <button
                onClick={onClose}
                className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all duration-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleSalvar}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaSave className="h-4 w-4" />
                {loading ? "Salvando..." : "Salvar Odontograma"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback de sucesso */}
      <OdontogramaSuccess 
        isOpen={showSuccessFeedback} 
        onClose={() => setShowSuccessFeedback(false)} 
      />

      <style jsx global>{`
        .grid-cols-16 {
          grid-template-columns: repeat(16, minmax(0, 1fr));
        }
      `}</style>
    </>
  );
} 