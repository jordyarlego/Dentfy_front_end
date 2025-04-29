"use client";
import { useState, useEffect } from "react";
import { FaFilePdf, FaSignature, FaSave, FaArrowLeft } from "react-icons/fa";
import { postLaudo, parseJwt, getLaudoPDF, assinarLaudo } from "../../../services/api_laudo";
import AssinaturaSuccess from '../AssinaturaSuccess';
import { Evidencia, Laudo, ModalGerarLaudoEvidenciaProps } from '../../types/evidencia';

interface LaudoFormData {
  titulo: string;
  texto: string;
  peritoResponsavel: string;
}

export default function ModalGerarLaudoEvidencia({
  isOpen,
  onClose,
  evidencia,
  onLaudoSaved
}: ModalGerarLaudoEvidenciaProps) {
  const [laudoData, setLaudoData] = useState<LaudoFormData>({
    titulo: "",
    texto: "",
    peritoResponsavel: ""
  });
  const [laudoId, setLaudoId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showLaudoSuccess, setShowLaudoSuccess] = useState(false);
  const [showAssinaturaSuccess, setShowAssinaturaSuccess] = useState(false);
  const [assinaturaValidada, setAssinaturaValidada] = useState(false);
  const [titulo, setTitulo] = useState<string>("");  // Definindo o tipo como string
const [texto, setTexto] = useState<string>("");  // Definindo o tipo como string


  
  useEffect(() => {
    if (!isOpen) {
      setTitulo("");
      setTexto("");
      setLaudoId(null);
      setAssinaturaValidada(false);
    }
  }, [isOpen]);
  
  
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
        evidence: evidencia._id,        // <<< nome correto do campo esperado pelo backend
        peritoResponsavel: user.id,      // <<< id do usuário logado
      };
      
      
  
      const saved = await postLaudo(data);
      setLaudoId(saved._id);
      setShowLaudoSuccess(true);
  
      // Limpa os campos depois de salvar
      setTitulo("");
      setTexto("");
    } catch (error: any) {
      console.error("Erro ao salvar o laudo:", error.response?.data || error.message);
      alert(`Erro ao salvar o laudo: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };
  
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
    } catch (error) {
      console.error("Erro ao assinar o laudo:", error);
      alert("Erro ao assinar o laudo.");
    }
  };
  

  const handleGerarPDF = async () => {
    try {
      if (!laudoId) {
        alert("Salve o laudo antes de gerar o PDF!");
        return;
      }
      const blob = await getLaudoPDF(laudoId);
      const url = window.URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `laudo_${laudoId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Erro ao gerar PDF do laudo:", error);
      alert("Erro ao gerar PDF do laudo.");
    }
  };
  

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center z-[100] backdrop-blur-md bg-gray-900/50">
        <div className="bg-[#0E1A26]/95 w-full max-w-[90%] h-[600px] rounded-2xl shadow-2xl border border-gray-700 overflow-hidden animate-modalEntry">
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

          {/* Conteúdo em layout horizontal */}
          <div className="flex h-[calc(600px-140px)]">
            {/* Lado Esquerdo - Informações da Evidência */}
            <div className="w-1/3 p-4 border-r border-gray-700 overflow-y-auto">
              <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700">
                <h3 className="text-lg font-medium text-amber-500 mb-3">Informações da Evidência</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-amber-400">Nome</p>
                    <p className="text-gray-200">{evidencia.nome}</p>
                  </div>
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
                      {new Date(evidencia.dataAdicao).toLocaleDateString('pt-BR')}
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
            <div className="flex-1 p-4 overflow-y-auto">
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
                disabled={loading || !laudoId || assinaturaValidada}
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
                disabled={loading || !laudoId|| !assinaturaValidada}
                className="flex items-center gap-2 px-4 py-2 bg-red-600/30 hover:bg-red-600/50 border border-red-700/50 rounded-lg text-sm transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaFilePdf className="text-red-400" />
                <span className="text-red-200">
                  {loading ? "Gerando PDF..." : "Gerar PDF"}
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
      
      <style jsx global>{`
        @keyframes modalEntry {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes glow {
          0%, 100% { filter: brightness(1) drop-shadow(0 0 8px rgba(251, 191, 36, 0.3)); }
          50% { filter: brightness(1.2) drop-shadow(0 0 12px rgba(251, 191, 36, 0.5)); }
        }
        .animate-modalEntry { animation: modalEntry 0.3s ease-out forwards; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-shimmer { animation: shimmer 3s linear infinite; background-size: 200% auto; }
        .animate-glow { animation: glow 2s ease-in-out infinite; }
      `}</style>
    </>
  );
}

