"use client";
import { useState, useEffect } from "react";
import {
  FaFilePdf,
  FaSignature,
  FaSave,
  FaArrowLeft,
  FaDownload,
  FaHistory,
} from "react-icons/fa";
import {
  postLaudo,
  parseJwt,
  getLaudoPDF,
  assinarLaudo,
  getLaudosByEvidencia,
  getLaudoSignatureHistory,
} from "../../../services/api_laudo";
import AssinaturaSuccess from "../AssinaturaSuccess";
import {
  Evidencia,
  Laudo,
  ModalGerarLaudoEvidenciaProps,
} from "../../types/evidencia";

interface LaudoFormData {
  titulo: string;
  texto: string;
  peritoResponsavel: string;
}

export default function ModalGerarLaudoEvidencia({
  isOpen,
  onClose,
  evidencia,
  onLaudoSaved,
}: ModalGerarLaudoEvidenciaProps) {
  const [laudoData, setLaudoData] = useState<LaudoFormData>({
    titulo: "",
    texto: "",
    peritoResponsavel: "",
  });
  const [laudoId, setLaudoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showLaudoSuccess, setShowLaudoSuccess] = useState(false);
  const [showAssinaturaSuccess, setShowAssinaturaSuccess] = useState(false);
  const [assinaturaValidada, setAssinaturaValidada] = useState(false);
  const [titulo, setTitulo] = useState<string>("");
  const [texto, setTexto] = useState<string>("");
  const [laudosExistentes, setLaudosExistentes] = useState<Laudo[]>([]);
  const [loadingLaudos, setLoadingLaudos] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setTitulo("");
      setTexto("");
      setLaudoId(null);
      setAssinaturaValidada(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && evidencia._id) {
      carregarLaudosExistentes();
    }
  }, [isOpen, evidencia._id]);

  const carregarLaudosExistentes = async () => {
    try {
      setLoadingLaudos(true);
      const laudos = await getLaudosByEvidencia(evidencia._id);
      setLaudosExistentes(laudos);
    } catch (error) {
      console.error("Erro ao carregar laudos existentes:", error);
    } finally {
      setLoadingLaudos(false);
    }
  };

  const handleDownloadLaudo = async (laudoId: string, titulo: string) => {
    try {
      setIsGeneratingPDF(true);
      await getLaudoPDF(laudoId);
      console.log("✅ PDF baixado com sucesso!");
    } catch (error: any) {
      console.error("❌ Erro ao baixar laudo:", error);
      setErrorMessage(
        error.response?.data?.message || "Erro ao baixar laudo em PDF"
      );
      setTimeout(() => setErrorMessage(""), 5000); // Limpa mensagem após 5s
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const verificarHistoricoAssinaturas = async (laudoId: string) => {
    try {
      const historico = await getLaudoSignatureHistory(laudoId);
      console.log("✅ Histórico de assinaturas:", historico);
      return historico;
    } catch (error) {
      console.error("❌ Erro ao buscar histórico de assinaturas:", error);
      return null;
    }
  };

  const handleSalvarLaudo = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado");

      const user = parseJwt(token);
      if (!user?.id) throw new Error("Usuário não encontrado");

      const data = {
        titulo: titulo,
        texto: texto,
        evidence: evidencia._id,
        peritoResponsavel: user.id,
        dataCriacao: new Date().toISOString(), // Adicionando data de criação
      };

      const saved = await postLaudo(data);
      setLaudoId(saved._id);
      setShowLaudoSuccess(true);
      setAssinaturaValidada(false);

      // Recarregar laudos existentes com a nova data
      await carregarLaudosExistentes();

      setTitulo("");
      setTexto("");
    } catch (error: any) {
      console.error(
        "Erro ao salvar o laudo:",
        error.response?.data || error.message
      );
      setErrorMessage(
        error.response?.data?.message || "Erro ao salvar o laudo"
      );
      setTimeout(() => setErrorMessage(""), 5000);
    } finally {
      setLoading(false);
    }
  };

  // Função para limpar estados
  const resetStates = () => {
    setTitulo("");
    setTexto("");
    setLaudoId(null);
    setAssinaturaValidada(false);
    setShowLaudoSuccess(false);
    setShowAssinaturaSuccess(false);
    setErrorMessage("");
  };

  // Atualizar useEffect do isOpen
  useEffect(() => {
    if (!isOpen) {
      resetStates();
    }
  }, [isOpen]);

  const handleAssinarLaudo = async () => {
    try {
      if (!laudoId) {
        alert("Salve o laudo antes de assinar!");
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado");

      const user = parseJwt(token);
      if (!user?.id) throw new Error("Usuário não encontrado");

      await assinarLaudo(laudoId);

      setShowAssinaturaSuccess(true);
      setAssinaturaValidada(true);

      // Recarrega os laudos existentes
      await carregarLaudosExistentes();
    } catch (error) {
      console.error("Erro ao assinar o laudo:", error);
      alert("Erro ao assinar o laudo.");
    }
  };

  const handleGerarPDF = async () => {
    try {
      if (!laudoId) {
        setErrorMessage("É necessário salvar o laudo antes de gerar o PDF");
        setTimeout(() => setErrorMessage(""), 5000);
        return;
      }

      setIsGeneratingPDF(true);
      await getLaudoPDF(laudoId);
      console.log("✅ PDF gerado com sucesso!");
    } catch (error: any) {
      console.error("❌ Erro ao gerar PDF:", error);
      setErrorMessage(
        error.response?.data?.message || "Erro ao gerar PDF do laudo"
      );
      setTimeout(() => setErrorMessage(""), 5000);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // Adicionar função formatadora de data
  const formatarData = (dataString: string) => {
    try {
      if (!dataString) return "Data não disponível";

      // Converter string ISO para objeto Date
      const data = new Date(dataString);

      // Verificar se a data é válida
      if (isNaN(data.getTime())) return "Data inválida";

      // Formatar para pt-BR com data e hora
      return Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(data);
    } catch (error) {
      console.error(
        "Erro ao formatar data:",
        error,
        "Data recebida:",
        dataString
      );
      return "Data inválida";
    }
  };

  const formatarDataLaudo = (data: string | undefined) => {
    if (!data) return "Data não disponível";

    try {
      const dataObj = new Date(data);
      return new Intl.DateTimeFormat("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(dataObj);
    } catch (error) {
      console.error("Erro ao formatar data do laudo:", error);
      return "Data inválida";
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-[100] backdrop-blur-md bg-gray-900/50 p-4">
        <div className="bg-[#0E1A26]/95 w-full max-w-[95%] lg:max-w-[90%] h-[90vh] lg:h-[600px] rounded-2xl shadow-2xl border border-gray-700 overflow-hidden animate-modalEntry">
          {/* Header */}
          <div className="relative p-4 border-b border-gray-700 bg-gradient-to-r from-[#0E1A26] via-[#152736] to-[#0E1A26]">
            <button
              onClick={onClose}
              className="absolute left-4 top-4 text-gray-400 hover:text-amber-500 transition-all duration-300 hover:scale-110 cursor-pointer group"
            >
              <FaArrowLeft className="h-6 w-6 group-hover:translate-x-[-4px] transition-transform" />
            </button>
            <div className="flex justify-center items-center gap-4">
              <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 text-transparent bg-clip-text animate-shimmer">
                Gerar Laudo da Evidência
              </h2>
            </div>
          </div>

          {/* Conteúdo responsivo */}
          <div className="flex flex-col lg:flex-row h-[calc(90vh-140px)] lg:h-[calc(600px-140px)]">
            {/* Lado Esquerdo - Laudos Existentes e Informações da Evidência */}
            <div className="w-full lg:w-1/3 p-4 border-b lg:border-b-0 lg:border-r border-gray-700 overflow-y-auto">
              {/* Laudos Existentes */}
              <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700 mb-4">
                <h3 className="text-lg font-medium text-amber-500 mb-3">
                  Laudos Existentes
                </h3>
                {loadingLaudos ? (
                  <div className="text-center py-4">
                    <div className="text-amber-500 animate-pulse">
                      Carregando laudos...
                    </div>
                  </div>
                ) : laudosExistentes.length === 0 ? (
                  <div className="text-center py-4">
                    <div className="text-gray-400 text-sm">
                      Nenhum laudo encontrado
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {laudosExistentes.map((laudo) => (
                      <div
                        key={laudo._id}
                        className="bg-gray-800/50 p-3 rounded-lg border border-gray-700"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-white text-sm">
                              {laudo.titulo}
                            </h4>
                            <p className="text-xs text-gray-300 line-clamp-2">
                              {laudo.texto}
                            </p>
                            <div className="flex items-center gap-2 mt-2">
                              <span
                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                  laudo.assinado
                                    ? "bg-green-500/20 text-green-400 border border-green-500/30"
                                    : "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                                }`}
                              >
                                {laudo.assinado ? "Assinado" : "Pendente"}
                              </span>
                              <span className="text-xs text-gray-400">
                                {formatarDataLaudo(laudo.dataCriacao)}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() =>
                                handleDownloadLaudo(laudo._id, laudo.titulo)
                              }
                              disabled={!laudo.assinado}
                              className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-400 border border-amber-500/30 rounded-lg hover:from-amber-500/30 hover:to-amber-600/30 hover:border-amber-400/50 hover:text-amber-300 transition-all duration-300 text-xs group hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                              title={
                                laudo.assinado
                                  ? "Baixar laudo em PDF"
                                  : "Laudo precisa ser assinado"
                              }
                            >
                              <FaDownload className="text-xs group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                              <span className="font-medium">PDF</span>
                            </button>
                            {laudo.assinado && (
                              <button
                                onClick={() =>
                                  verificarHistoricoAssinaturas(laudo._id)
                                }
                                className="p-1 text-purple-400 hover:text-purple-300 transition-colors"
                                title="Ver histórico de assinaturas"
                              >
                                <FaHistory className="text-xs" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Informações da Evidência */}
              <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700">
                <h3 className="text-lg font-medium text-amber-500 mb-3">
                  Informações da Evidência
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-amber-400">Tipo</p>
                    <p className="text-gray-200">{evidencia.tipo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-amber-400">Coletado por</p>
                    <p className="text-gray-200">{evidencia.coletadoPor}</p>
                  </div>
                  <div>
                    <p className="text-sm text-amber-400">Data de Coleta</p>
                    <p className="text-gray-200">
                      {new Date(evidencia.dataAdicao).toLocaleDateString(
                        "pt-BR"
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-amber-400">Descrição Original</p>
                    <p className="text-gray-200">{evidencia.descricao}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Lado Direito - Formulário do Laudo */}
            <div className="w-full lg:w-2/3 p-4 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-amber-500 mb-2">
                    Título do Laudo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-800/30 border border-gray-700 rounded-lg text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    placeholder="Digite o título do laudo..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-amber-500 mb-2">
                    Descrição do Laudo <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={texto}
                    onChange={(e) => setTexto(e.target.value)}
                    className="w-full h-[300px] px-4 py-2 bg-gray-800/30 border border-gray-700 rounded-lg text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 resize-none"
                    placeholder="Digite a descrição detalhada do laudo..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer com botões */}
          <div className="p-4 border-t border-gray-700 bg-gradient-to-r from-[#0E1A26] via-[#152736] to-[#0E1A26]">
            <div className="flex justify-end gap-4">
              {/* Botão Salvar - sempre habilitado se os campos estiverem preenchidos */}
              <button
                onClick={handleSalvarLaudo}
                disabled={loading || !titulo || !texto}
                className="flex items-center gap-2 px-4 py-2 bg-amber-600/30 hover:bg-amber-600/50 border border-amber-700/50 rounded-lg text-sm transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaSave className="text-amber-400" />
                <span className="text-amber-200">
                  {loading ? "Salvando..." : "Salvar Laudo"}
                </span>
              </button>

              {/* Botão Assinar - habilitado apenas após salvar */}
              <button
                onClick={handleAssinarLaudo}
                disabled={!laudoId || assinaturaValidada}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-700/50 rounded-lg text-sm transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaSignature className="text-purple-400" />
                <span className="text-purple-200">
                  {assinaturaValidada ? "Laudo Assinado" : "Assinar Laudo"}
                </span>
              </button>

              {/* Botão Gerar PDF - habilitado apenas após assinar */}
              <button
                onClick={handleGerarPDF}
                disabled={
                  loading || !laudoId || !assinaturaValidada || isGeneratingPDF
                }
                className="flex items-center gap-2 px-4 py-2 bg-red-600/30 hover:bg-red-600/50 border border-red-700/50 rounded-lg text-sm transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaFilePdf
                  className={`text-red-400 ${
                    isGeneratingPDF ? "animate-spin" : ""
                  }`}
                />
                <span className="text-red-200">
                  {isGeneratingPDF ? "Gerando PDF..." : "Gerar PDF"}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feedbacks de sucesso com z-index maior */}
      {showAssinaturaSuccess && (
        <AssinaturaSuccess
          isOpen={showAssinaturaSuccess}
          onClose={() => setShowAssinaturaSuccess(false)}
        />
      )}

      {/* Adicionar mensagem de erro */}
      {errorMessage && (
        <div className="fixed top-4 right-4 bg-red-500/90 text-white px-4 py-2 rounded-lg shadow-lg z-[200] animate-fade-in">
          <p className="text-sm">{errorMessage}</p>
        </div>
      )}

      <style jsx global>{`
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
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }
        @keyframes glow {
          0%,
          100% {
            filter: brightness(1) drop-shadow(0 0 8px rgba(251, 191, 36, 0.3));
          }
          50% {
            filter: brightness(1.2)
              drop-shadow(0 0 12px rgba(251, 191, 36, 0.5));
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-modalEntry {
          animation: modalEntry 0.3s ease-out forwards;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-shimmer {
          animation: shimmer 3s linear infinite;
          background-size: 200% auto;
        }
        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </>
  );
}
