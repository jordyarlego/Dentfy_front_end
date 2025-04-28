"use client";

import { useState, useEffect } from "react";
import { FaTimes, FaFilePdf, FaSignature, FaSave, FaArrowLeft } from "react-icons/fa";
import Image from "next/image";
import CaveiraPeste from "../../../public/assets/CaveiraPeste.png";
import Logo from "../../../public/assets/Logo.png";
import { PostRelatorio, GetRelatorios, parseJwt, ExportRelatorioPDF, AssinarRelatorio } from "../../../services/api_relatorio";

interface ModalRelatorioProps {
  isOpen: boolean;
  onClose: () => void;
  caso: {
    titulo: string;
    _id: string;
  };
}

interface RelatorioData {
  _id?: string;
  titulo: string;
  conteudo: string;
  peritoResponsavel: string;
  caso: string;
  criadoEm?: string;
}

export default function ModalRelatorio({ isOpen, onClose, caso }: ModalRelatorioProps) {
  const casoId = caso._id;

  const [relatorioData, setRelatorioData] = useState({ titulo: "", conteudo: "", peritoResponsavel: "" });
  const [relatorios, setRelatorios] = useState<Relatorio[]>([]);
  const [relatorioId, setRelatorioId] = useState<string | null>(null); // 👈 novo para guardar o ID
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null); // 👈 você estava usando mas não tinha declarado no código que mandou

  useEffect(() => {
    async function loadRelatorios() {
      try {
        const all = await GetRelatorios();
        const filtrados = all.filter((r: RelatorioData) => r.caso === casoId);
        setRelatorios(filtrados);
        if (filtrados.length > 0) {
          setRelatorioId(filtrados[0]._id); // 👈 já seta o primeiro encontrado
        }
      } catch (err) {
        console.error("Erro ao carregar relatórios:", err);
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
      setRelatorios(prev => [saved, ...prev]);
      setRelatorioId(saved._id); // 👈 salva o ID retornado
      setSuccessMessage("Relatório salvo com sucesso!");
      setRelatorioData({ titulo: "", conteudo: "", peritoResponsavel: "" });
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (error: any) {
      console.error("Erro ao enviar o relatório:", error.response?.data || error.message);
      alert(`Erro ao enviar o relatório: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGerarPDF = async () => {
    try {
      if (!relatorioId) {
        alert("Salve o relatório antes de gerar o PDF!");
        return;
      }
      const blob = await ExportRelatorioPDF(relatorioId); // 👈 usa o ID salvo
      const url = window.URL.createObjectURL(new Blob([blob], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `relatorio_${relatorioId}.pdf`);
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

    await AssinarRelatorio(relatorioId, user.id); // 👈 agora passa o user.id também
    alert("Relatório assinado com sucesso!");
  } catch (error) {
    console.error("Erro ao assinar relatório:", error);
    alert("Erro ao assinar relatório.");
  }
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-gray-900/50">
      <div className="bg-[#0E1A26]/95 w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-700 overflow-hidden animate-modalEntry" style={{ boxShadow: "0 0 40px rgba(251, 191, 36, 0.1)" }}>

        {/* Header */}
        <div className="relative p-6 border-b border-gray-700 bg-gradient-to-r from-[#0E1A26] via-[#152736] to-[#0E1A26]">
          <button onClick={onClose} className="absolute left-4 top-4 text-gray-400 hover:text-amber-500 transition-all duration-300 hover:scale-110">
            <FaArrowLeft className="h-6 w-6" />
          </button>
          <div className="flex justify-center items-center gap-4">
            <div className="relative group animate-glow">
              <Image src={CaveiraPeste} alt="Logo Caveira" width={40} height={40} className="animate-float transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute -inset-2 bg-amber-500/20 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 text-transparent bg-clip-text animate-shimmer">Relatório do Caso</h2>
            <div className="relative group animate-glow">
              <Image src={Logo} alt="Logo Dentfy" width={40} height={40} className="opacity-75 transition-all duration-300 group-hover:opacity-100 group-hover:scale-110" />
              <div className="absolute -inset-2 bg-amber-500/20 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <button onClick={onClose} className="absolute right-4 top-4 text-gray-400 hover:text-amber-500 transition-all duration-300 hover:scale-110 hover:rotate-90 transform">
              <FaTimes className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">

          {/* Feedback */}
          {successMessage && (
            <div className="bg-green-600 text-white text-center py-2 rounded">{successMessage}</div>
          )}

          {/* Caso Info */}
          <div className="bg-gray-800/30 p-4 rounded-xl border border-gray-700 backdrop-blur-sm">
            <h3 className="text-lg font-medium text-amber-500 mb-1">Título do Caso:</h3>
            <p className="text-white font-semibold">{caso.titulo}</p>
            <p className="text-sm text-gray-400 mt-1">ID: {casoId}</p>
          </div>

          {/* Formulário */}
          <div className="space-y-4">
            <label className="block text-gray-300">Título do Relatório</label>
            <input
              type="text"
              placeholder="Digite o título..."
              value={relatorioData.titulo}
              onChange={e => setRelatorioData({ ...relatorioData, titulo: e.target.value })}
              className="w-full px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-gray-400 transition"
            />

            <label className="block text-gray-300">Conteúdo do Relatório</label>
            <textarea
              placeholder="Digite o conteúdo..."
              value={relatorioData.conteudo}
              onChange={e => setRelatorioData({ ...relatorioData, conteudo: e.target.value })}
              className="w-full h-32 px-4 py-3 bg-gray-800 text-white rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-amber-500 placeholder-gray-400 transition resize-none"
            />
          </div>

          {/* Lista de Relatórios */}
          <div className={`${relatorios.length > 0 ? 'space-y-2' : ''} ${relatorios.length > 3 ? 'max-h-64 overflow-y-auto' : ''}`}>
            {relatorios.map(r => (
              <div key={r._id} className="bg-gray-800/50 p-3 rounded-lg border border-gray-700">
                <h4 className="font-semibold text-white">{r.titulo}</h4>
                <p className="text-sm text-gray-300 line-clamp-2">{r.conteudo}</p>
                <span className="text-xs text-gray-500">{new Date(r.criadoEm || '').toLocaleString()}</span>
              </div>
            ))}
            {!relatorios.length && <p className="text-gray-400 text-sm">Nenhum relatório ainda.</p>}
          </div>
        </div>

         {/* Footer */}
      <div className="flex justify-between items-center p-6 border-t border-gray-700 bg-gray-900">
        <div className="flex gap-4">
          <button
            onClick={handleGerarPDF}
            disabled={!relatorioId} // 👈 desabilita se não tiver ID
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaFilePdf /> Gerar PDF
          </button>
          <button
            onClick={handleAssinarRelatorio}
            disabled={!relatorioId}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaSignature /> Assinar
          </button>
        </div>
        <button
          onClick={handleSaveRelatorio}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl hover:from-amber-600 hover:to-amber-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FaSave className={loading ? "animate-spin" : undefined} />
          <span>Salvar Relatório</span>
        </button>
      </div>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes modalEntry { from { opacity: 0; transform: scale(0.95) translateY(10px);} to { opacity: 1; transform: scale(1) translateY(0);} }
        @keyframes float { 0%,100% { transform: translateY(0);} 50% { transform: translateY(-5px);} }
        @keyframes shimmer { 0% { background-position: -200% center;} 100% { background-position: 200% center;} }
        @keyframes glow { 0%,100% { filter: brightness(1) drop-shadow(0 0 8px rgba(251, 191, 36, 0.3));} 50% { filter: brightness(1.2) drop-shadow(0 0 12px rgba(251, 191, 36, 0.5));} }
        .animate-modalEntry { animation: modalEntry 0.3s ease-out forwards; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-shimmer { animation: shimmer 3s linear infinite; background-size: 200% auto; }
        .animate-glow { animation: glow 2s ease-in-out infinite; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
      `}</style>
    </div>
  );
}
