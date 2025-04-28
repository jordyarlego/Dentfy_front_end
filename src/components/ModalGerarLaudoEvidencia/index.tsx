"use client";

import { useState } from "react";
import { FaTimes, FaFilePdf, FaSignature, FaSave, FaArrowLeft } from "react-icons/fa";
import Image from "next/image";
import CaveiraPeste from "../../../public/assets/CaveiraPeste.png";
import Logo from "../../../public/assets/Logo.png";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { putEvidencia } from "../../../services/api_nova_evidencia";
import { assinarLaudo } from "../../../services/api_laudo";
import AssinaturaSuccess from '../AssinaturaSuccess';
import RelatorioSuccess from '../RelatorioSuccess';

interface Evidencia {
  _id: string;
  nome: string;
  tipo: string;
  descricao: string;
  coletadoPor: string;
  arquivo: string;
  dataAdicao: string;
  laudo?: string;
}

interface ModalGerarLaudoEvidenciaProps {
  isOpen: boolean;
  onClose: () => void;
  evidencia: Evidencia;
  onLaudoSaved: () => void;
}

export default function ModalGerarLaudoEvidencia({
  isOpen,
  onClose,
  evidencia,
  onLaudoSaved
}: ModalGerarLaudoEvidenciaProps) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [loading, setLoading] = useState(false);
  const [assinaturaValidada, setAssinaturaValidada] = useState(false);
  const [laudoSalvo, setLaudoSalvo] = useState(false);
  const [laudoId, setLaudoId] = useState<string | null>(null);
  const [showAssinaturaSuccess, setShowAssinaturaSuccess] = useState(false);
  const [showRelatorioSuccess, setShowRelatorioSuccess] = useState(false);

  // Salvar laudo
  const handleSalvarLaudo = async () => {
    if (!titulo || !descricao) return;

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado");

      const user = parseJwt(token);
      if (!user?.id) throw new Error("Usuário não encontrado no token");

      const data = {
        titulo,
        descricao,
        evidenciaId: evidencia._id,
        peritoResponsavel: user.id,
      };

      const savedLaudo = await PostLaudo(data);
      setLaudoId(savedLaudo._id);
      setLaudoSalvo(true);
      
      // Toca o som e mostra o feedback
      const audio = new Audio('/assets/papagaio.mp3');
      audio.volume = 0.3;
      await audio.play();
      
      // Importante: Mostra o feedback de sucesso
      setShowRelatorioSuccess(true);
    } catch (error) {
      console.error("Erro ao salvar o laudo:", error);
    } finally {
      setLoading(false);
    }
  };

  // Validar assinatura digital
  const handleValidarAssinatura = async () => {
    if (!laudoSalvo) return;

    setLoading(true);
    try {
      await assinarLaudo(laudoId!);
      setAssinaturaValidada(true);
      
      // Importante: Mostra o feedback de sucesso
      setShowAssinaturaSuccess(true);
    } catch (error) {
      console.error("Erro ao assinar laudo:", error);
    } finally {
      setLoading(false);
    }
  };

  // Gerar PDF do laudo
  const handleGerarPDF = async () => {
    if (!laudoSalvo || !assinaturaValidada) {
      return;
    }

    setLoading(true);
    try {
      const conteudo = document.getElementById('laudo-content');
      if (!conteudo) return;

      const canvas = await html2canvas(conteudo);
      const pdf = new jsPDF();
      
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, 190, 277);
      pdf.save(`laudo_${evidencia.nome}.pdf`);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
    } finally {
      setLoading(false);
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
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
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
                disabled={loading || !titulo || !descricao}
                className="flex items-center gap-2 px-4 py-2 bg-amber-600/30 hover:bg-amber-600/50 border border-amber-700/50 rounded-lg text-sm transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FaSave className="text-amber-400" />
                <span className="text-amber-200">
                  {loading ? "Salvando..." : "Salvar Laudo"}
                </span>
              </button>

              {/* Botão Assinar - habilitado apenas após salvar */}
              <button
                onClick={handleValidarAssinatura}
                disabled={loading || !laudoSalvo || assinaturaValidada}
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
                disabled={loading || !laudoSalvo || !assinaturaValidada}
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
          onClose={() => setShowAssinaturaSuccess(false)} 
        />
      )}
      
      {showRelatorioSuccess && (
        <RelatorioSuccess 
          onClose={() => setShowRelatorioSuccess(false)} 
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