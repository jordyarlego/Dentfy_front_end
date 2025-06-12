"use client";

import { useState, useEffect } from "react";
import { FaFilePdf, FaSignature, FaSave, FaArrowLeft, FaDownload } from "react-icons/fa";
import Image from "next/image";
import CaveiraPeste from "../../../public/assets/CaveiraPeste.png";
import { PostRelatorio, GetRelatoriosPorCaso, GetRelatorios, parseJwt, ExportRelatorioPDF, AssinarRelatorio } from "../../../services/api_relatorio";
import RelatorioSuccess from '../RelatorioSuccess';
import AssinaturaSuccess from '../AssinaturaSuccess';

interface ModalRelatorioProps {
  isOpen: boolean;
  onClose: () => void;
  caso: {
    titulo: string;
    _id: string;
  };
}

// Interface específica para o componente que inclui campos adicionais
interface RelatorioDataLocal {
  _id: string;
  titulo: string;
  conteudo: string;
  peritoResponsavel: string;
  caso: string;
  criadoEm?: string;
}

// Interface para dados de entrada (sem _id)
interface RelatorioInputData {
  titulo: string;
  conteudo: string;
  peritoResponsavel: string;
  caso: string;
}

export default function ModalRelatorio({ isOpen, onClose, caso }: ModalRelatorioProps) {
  const casoId = caso._id;

  const [relatorioData, setRelatorioData] = useState<RelatorioInputData>({ titulo: "", conteudo: "", peritoResponsavel: "", caso: "" });
  const [relatorios, setRelatorios] = useState<RelatorioDataLocal[]>([]);
  const [relatorioId, setRelatorioId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [, setSuccessMessage] = useState<string | null>(null);
  const [showRelatorioSuccess, setShowRelatorioSuccess] = useState(false);
  const [showAssinaturaSuccess, setShowAssinaturaSuccess] = useState(false);
  const [assinaturaValidada, setAssinaturaValidada] = useState(false);

  useEffect(() => {
  async function loadRelatorios() {
    try {
      console.log("casoId usado no fetch:", casoId); // 👈 aqui

      const all = await GetRelatoriosPorCaso(casoId);
      setRelatorios(all as RelatorioDataLocal[]);
      if (all.length > 0) {
        setRelatorioId(all[0]._id);
      }
    } catch (err) {
      console.error("Erro ao carregar relatórios por caso:", err);
    }
  }
  loadRelatorios();
}, [casoId]);


  const handleSaveRelatorio = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado");

      const user = parseJwt(token);
      if (!user?.id) throw new Error("Usuário não encontrado no token");

      const data = {
        ...relatorioData,
        caso: casoId,
        peritoResponsavel: user.id,
      };

      const saved = await PostRelatorio(data);
      setRelatorios(prev => [saved as RelatorioDataLocal, ...prev]);
      setRelatorioId((saved as RelatorioDataLocal)._id);
      setSuccessMessage("Relatório salvo com sucesso!");
      setRelatorioData({ titulo: "", conteudo: "", peritoResponsavel: "", caso: "" });
      setTimeout(() => setSuccessMessage(null), 3000);
      setShowRelatorioSuccess(true);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error('Erro ao salvar relatório:', error.message);
      } else {
        console.error('Erro desconhecido ao salvar relatório');
      }
    }
  };

 const handleGerarPDF = async () => {
  try {
    if (relatorios.length === 0) {
      alert("Nenhum relatório disponível para gerar PDF.");
      return;
    }

    const ultimoRelatorio = relatorios[0]; // o mais recente
    const blob = await ExportRelatorioPDF(ultimoRelatorio._id);
    const url = window.URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `relatorio_${ultimoRelatorio.titulo.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Erro ao gerar PDF:", error);
    alert("Erro ao gerar PDF do relatório.");
  }
};

  const handleAssinarRelatorio = async () => {
    try {
      if (!relatorioId) {
        alert("Salve o relatório antes de assinar!");
        return;
      }
  
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Token não encontrado");
  
      const user = parseJwt(token);
      if (!user?.id) throw new Error("Usuário não encontrado no token");
  
      await AssinarRelatorio(relatorioId);
  
      setShowAssinaturaSuccess(true); // 👈 Adicione essa linha para abrir o modal
      setAssinaturaValidada(true);     // 👈 Também marque como assinado para liberar botão de PDF
    } catch (error) {
      console.error("Erro ao assinar relatório:", error);
      alert("Erro ao assinar relatório.");
    }
  };

  const handleDownloadRelatorio = async (relatorioId: string, titulo: string) => {
    try {
      const blob = await ExportRelatorioPDF(relatorioId);
      const url = window.URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `relatorio_${titulo.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Erro ao baixar relatório:", error);
      alert("Erro ao baixar relatório em PDF.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[100]">
      <div className="absolute inset-0 backdrop-blur-md bg-black/30" onClick={onClose} />
      <div className="relative bg-[#0E1A26]/95 w-[80%] max-w-4xl h-[500px] rounded-2xl shadow-2xl border border-gray-700 overflow-hidden animate-modalEntry">
        {/* Header */}
        <div className="relative p-4 border-b border-gray-700 bg-gradient-to-r from-[#0E1A26] via-[#152736] to-[#0E1A26] flex justify-between items-center">
          <button onClick={onClose} className="text-gray-400 hover:text-amber-500 transition-all duration-300 hover:scale-110">
            <FaArrowLeft className="h-6 w-6" />
          </button>
          
          <div className="flex items-center gap-4">
            <div className="relative group animate-glow">
              <Image src={CaveiraPeste} alt="Logo Caveira" width={40} height={40} className="animate-float transition-transform duration-300 group-hover:scale-110" />
            </div>
            <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 text-transparent bg-clip-text animate-shimmer">
              Relatório do Caso
            </h2>
          </div>

          <div className="w-[42px]"></div>
        </div>

        {/* Conteúdo em layout horizontal */}
        <div className="flex h-[calc(100%-120px)]">
          {/* Lado Esquerdo - 1/3 */}
          <div className="w-1/3 p-4 border-r border-gray-700 overflow-y-auto">
            <div className="bg-gray-800/30 p-3 rounded-lg border border-gray-700 mb-4">
              <h3 className="text-lg font-medium text-amber-500">Caso:</h3>
              <p className="text-white">{caso.titulo}</p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-medium text-amber-500">Relatórios Anteriores</h3>
              {relatorios.map(r => (
                <div key={r._id} className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">{r.titulo}</h4>
                      <p className="text-sm text-gray-300 line-clamp-2">{r.conteudo}</p>
                    </div>
                    <button
                      onClick={() => handleDownloadRelatorio(r._id, r.titulo)}
                      className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-400 border border-amber-500/30 rounded-lg hover:from-amber-500/30 hover:to-amber-600/30 hover:border-amber-400/50 hover:text-amber-300 transition-all duration-300 text-xs group hover:scale-105"
                      title="Baixar relatório em PDF"
                    >
                      <FaDownload className="text-xs cursor-pointer group-hover:scale-110 group-hover:rotate-12 transition-all duration-300" />
                      <span className="font-medium cursor-pointer">PDF</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Lado Direito - 2/3 */}
          <div className="w-2/3 p-4 overflow-y-auto">
            <div className="space-y-4">
              <div>
                <label className="block text-gray-300 mb-2">Título do Relatório</label>
                <input
                  type="text"
                  value={relatorioData.titulo}
                  onChange={e => setRelatorioData({ ...relatorioData, titulo: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-amber-500"
                  placeholder="Digite o título..."
                />
              </div>

              <div>
                <label className="block text-gray-300 mb-2">Conteúdo</label>
                <textarea
                  value={relatorioData.conteudo}
                  onChange={e => setRelatorioData({ ...relatorioData, conteudo: e.target.value })}
                  className="w-full h-[200px] px-4 py-2 bg-gray-800 text-white rounded-lg border border-gray-600 focus:ring-2 focus:ring-amber-500 resize-none"
                  placeholder="Digite o conteúdo..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer com botões agrupados */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700 bg-gray-900">
          <div className="flex justify-center gap-4">
            <button
              onClick={handleSaveRelatorio}
              disabled={!relatorioData.titulo || !relatorioData.conteudo}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl hover:from-amber-600 hover:to-amber-700 transition disabled:opacity-50 disabled:cursor-not-allowed group hover:scale-105"
            >
              <FaSave className={loading ? "animate-spin" : "group-hover:scale-110 transition-transform"} />
              <span>Salvar</span>
            </button>

            <button
              onClick={handleAssinarRelatorio}
              disabled={!relatorioId}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl hover:from-purple-600 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed group hover:scale-105"
            >
              <FaSignature className="group-hover:scale-110 transition-transform" />
              <span>Assinar</span>
            </button>

            <button
              onClick={handleGerarPDF}
              disabled={!relatorioId || !assinaturaValidada}
              className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r 
                ${assinaturaValidada 
                  ? 'from-red-500 to-red-600 hover:from-red-600 hover:to-red-700' 
                  : 'from-gray-500 to-gray-600'} 
                text-white rounded-xl transition disabled:opacity-50 disabled:cursor-not-allowed group hover:scale-105`}
            >
              <FaFilePdf className="group-hover:scale-110 transition-transform" />
              <span>Gerar PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Feedbacks com z-index maior que o modal */}
      <div className="fixed inset-0 pointer-events-none z-[200]">
        {showRelatorioSuccess && (
          <div className="pointer-events-auto">
            <RelatorioSuccess 
              isOpen={showRelatorioSuccess} 
              onClose={() => setShowRelatorioSuccess(false)} 
            />
          </div>
        )}

        {showAssinaturaSuccess && (
          <div className="pointer-events-auto">
            <AssinaturaSuccess 
              isOpen={showAssinaturaSuccess} 
              onClose={() => setShowAssinaturaSuccess(false)} 
            />
          </div>
        )}
      </div>

      {/* Estilos globais */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out forwards; }
      `}</style>
    </div>
  );
}