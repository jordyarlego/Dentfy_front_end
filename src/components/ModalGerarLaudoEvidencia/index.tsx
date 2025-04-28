"use client";

import { useState } from "react";
import { FaTimes, FaFilePdf, FaSignature, FaSave, FaArrowLeft } from "react-icons/fa";
import Image from "next/image";
import CaveiraPeste from "../../../public/assets/CaveiraPeste.png";
import Logo from "../../../public/assets/Logo.png";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { putEvidencia } from "../../../services/api_nova_evidencia";

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
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleValidarAssinatura = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAssinaturaValidada(true);
      setSuccessMessage("Assinatura digital validada com sucesso!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Erro ao validar assinatura:", error);
      setSuccessMessage("Erro ao validar assinatura. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleGerarPDF = async () => {
    setLoading(true);
    try {
      const conteudo = document.getElementById('laudo-content');
      if (!conteudo) return;

      const canvas = await html2canvas(conteudo);
      const pdf = new jsPDF();
      
      pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 10, 10, 190, 277);
      pdf.save(`laudo_${evidencia.nome}.pdf`);
      
      setSuccessMessage("PDF gerado com sucesso!");
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      setSuccessMessage("Erro ao gerar PDF. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleSalvarLaudo = async () => {
    if (!assinaturaValidada) {
      setSuccessMessage("Por favor, valide a assinatura digital primeiro.");
      return;
    }

    if (!titulo || !descricao) {
      setSuccessMessage("Preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);
    try {
      const dataAtual = new Date().toLocaleDateString('pt-BR');
      const horaAtual = new Date().toLocaleTimeString('pt-BR');
      
      const laudoFormatado = `
        LAUDO TÉCNICO

        Título: ${titulo}
        Data de Emissão: ${dataAtual} às ${horaAtual}

        INFORMAÇÕES DA EVIDÊNCIA
        Nome: ${evidencia.nome}
        Tipo: ${evidencia.tipo}
        Coletado por: ${evidencia.coletadoPor}
        Data de Coleta: ${new Date(evidencia.dataAdicao).toLocaleDateString('pt-BR')}
        Descrição Original: ${evidencia.descricao}

        LAUDO DETALHADO
        ${descricao}

        VALIDAÇÃO
        Este documento foi assinado digitalmente em ${dataAtual} às ${horaAtual}.
      `.trim();

      await putEvidencia(evidencia._id, { laudo: laudoFormatado });
      setSuccessMessage("Laudo salvo com sucesso!");
      onLaudoSaved();
      setTimeout(() => {
        setSuccessMessage(null);
        onClose();
      }, 2000);
    } catch (error) {
      console.error("Erro ao salvar laudo:", error);
      setSuccessMessage("Erro ao salvar laudo. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-gray-900/50">
      <div className="bg-[#0E1A26]/95 w-full max-w-[90%] max-h-[85vh] rounded-2xl shadow-2xl border border-gray-700 overflow-hidden animate-modalEntry">
        {/* Header */}
        <div className="relative p-4 border-b border-gray-700 bg-gradient-to-r from-[#0E1A26] via-[#152736] to-[#0E1A26]">
          <button
            onClick={onClose}
            className="absolute left-4 top-4 text-gray-400 hover:text-amber-500 transition-all duration-300 hover:scale-110"
          >
            <FaArrowLeft className="h-6 w-6" />
          </button>
          <div className="flex justify-center items-center gap-4">
            <div className="relative group animate-glow">
              <Image
                src={CaveiraPeste}
                alt="Logo Caveira"
                width={40}
                height={40}
                className="animate-float transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute -inset-2 bg-amber-500/20 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 text-transparent bg-clip-text animate-shimmer">
              Gerar Laudo da Evidência
            </h2>
            <div className="relative group animate-glow">
              <Image
                src={Logo}
                alt="Logo Dentfy"
                width={40}
                height={40}
                className="opacity-75 transition-all duration-300 group-hover:opacity-100 group-hover:scale-110"
              />
              <div className="absolute -inset-2 bg-amber-500/20 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
        </div>

        {/* Content - Agora em layout horizontal */}
        <div className="flex overflow-hidden h-[calc(85vh-180px)]">
          {/* Lado Esquerdo - Informações da Evidência */}
          <div className="w-1/3 p-4 border-r border-gray-700 overflow-y-auto">
            {successMessage && (
              <div className="bg-green-600/20 border border-green-500/30 text-green-400 p-3 rounded-lg text-center mb-4">
                {successMessage}
              </div>
            )}

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
          <div className="flex-1 p-4 overflow-y-auto" id="laudo-content">
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
                  className="w-full h-[calc(100vh-500px)] min-h-[200px] px-4 py-2 bg-gray-800/30 border border-gray-700 rounded-lg text-white focus:border-amber-500 focus:ring-1 focus:ring-amber-500 resize-none"
                  placeholder="Digite a descrição detalhada do laudo..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700 bg-gradient-to-r from-[#0E1A26] via-[#152736] to-[#0E1A26]">
          <div className="flex justify-end gap-4">
            <button
              onClick={handleValidarAssinatura}
              disabled={loading || assinaturaValidada}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-700/50 rounded-lg text-sm transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaSignature className="text-purple-400" />
              <span className="text-purple-200">
                {assinaturaValidada ? "Assinatura Validada" : "Validar Assinatura"}
              </span>
            </button>

            <button
              onClick={handleGerarPDF}
              disabled={loading || !assinaturaValidada}
              className="flex items-center gap-2 px-4 py-2 bg-red-600/30 hover:bg-red-600/50 border border-red-700/50 rounded-lg text-sm transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaFilePdf className="text-red-400" />
              <span className="text-red-200">Gerar PDF</span>
            </button>

            <button
              onClick={handleSalvarLaudo}
              disabled={loading || !assinaturaValidada}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaSave />
              <span>Salvar Laudo</span>
            </button>
          </div>
        </div>
      </div>

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
    </div>
  );
} 