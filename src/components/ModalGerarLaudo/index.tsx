"use client";
import { useState, useEffect, useMemo } from "react";
import {
  FaTimes,
  FaFilePdf,
  FaSignature,
  FaSave,
  FaFile,
  FaDownload,
} from "react-icons/fa";
import Image from "next/image";
import CaveiraPeste from "../../../public/assets/CaveiraPeste.png";
import Logo from "../../../public/assets/Logo.png";
import EvidenciasSalvaSucess from "../EvidenciasSalvaSucess";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";

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

interface ModalGerarLaudoProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (laudo: string, evidenciaId: string) => void;
  evidencia: Evidencia;
}

export default function ModalGerarLaudo({
  isOpen,
  onClose,
  onSave,
  evidencia,
}: ModalGerarLaudoProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [assinatura, setAssinatura] = useState("");
  const [laudo, setLaudo] = useState(evidencia.laudo || "");
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const fileUrl = useMemo(() => {
    if (!evidencia) return "";
    return evidencia.arquivo;
  }, [evidencia]);

  const fileType = useMemo(() => {
    if (!evidencia) return "other";

    if (evidencia.mimeType) {
      if (evidencia.mimeType.startsWith("image/")) return "image";
      if (evidencia.mimeType.startsWith("video/")) return "video";
      if (evidencia.mimeType === "application/pdf") return "pdf";
    }

    const extension = evidencia.nome.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp", "bmp"].includes(extension!))
      return "image";
    if (["mp4", "mov", "avi", "mkv", "webm"].includes(extension!))
      return "video";
    if (extension === "pdf") return "pdf";

    return "other";
  }, [evidencia]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "auto";
      };
    }
  }, [isOpen]);

  useEffect(() => {
    setLaudo(evidencia.laudo || "");
    setAssinatura("");
    setIsValid(false);
  }, [evidencia]);

  const handleValidateSignature = async () => {
    setIsValidating(true);
    try {
      // Simular validação da assinatura
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsValid(true);
    } catch (error) {
      console.error("Erro ao validar a assinatura:", error);
      alert("Ocorreu um erro ao validar a assinatura. Tente novamente.");
      setIsValid(false);
    } finally {
      setIsValidating(false);
    }
  };

  const handleSalvar = () => {
    if (!isValid) {
      alert("Por favor, valide sua assinatura digital primeiro");
      return;
    }
    onSave(laudo, evidencia._id);
    setShowSuccess(true);
  };

  const handleGerarPDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const doc = new jsPDF();
      const canvas = await html2canvas(
        document.querySelector(".laudo-content") as HTMLElement
      );
      const imgData = canvas.toDataURL("image/png");

      doc.addImage(imgData, "PNG", 10, 10, 190, 277);
      doc.save(`laudo-${evidencia.nome}.pdf`);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Erro ao gerar PDF");
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleDownload = () => {
    if (fileUrl) {
      const link = document.createElement("a");
      link.href = fileUrl;
      link.download = evidencia.nome;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[1000] bg-black/80 flex items-center justify-center p-4 backdrop-blur-xl">
        <div className="relative z-[1001] bg-gray-800 border-2 border-amber-900/50 rounded-xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col">
          <div className="absolute inset-0 opacity-10 mix-blend-overlay">
            <Image
              src={CaveiraPeste}
              alt="Background"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="relative z-10 h-full flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-amber-900/30 bg-gray-850/90">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-5">
                  <Image
                    src={Logo}
                    alt="Logo"
                    fill
                    className="object-contain opacity-80"
                    priority
                  />
                </div>
                <h2 className="text-xl font-bold text-amber-500">
                  Laudo: {evidencia.nome}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-amber-500 transition-colors duration-200 hover:scale-110 cursor-pointer"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-1 min-h-0 gap-4 p-4">
              <div className="w-1/3 flex flex-col gap-4">
                <div className="relative h-40 bg-gray-700/50 rounded-lg overflow-hidden flex items-center justify-center">
                  {fileType === "image" && fileUrl && (
                    <Image
                      src={fileUrl}
                      alt={evidencia.nome}
                      fill
                      className="object-contain"
                      quality={100}
                      priority
                    />
                  )}

                  {fileType === "video" && fileUrl && (
                    <video
                      controls
                      className="w-full h-full object-contain"
                      key={fileUrl}
                    >
                      <source src={fileUrl} type={evidencia.mimeType} />
                      Seu navegador não suporta o elemento de vídeo.
                    </video>
                  )}

                  {fileType === "pdf" && fileUrl && (
                    <iframe
                      src={fileUrl}
                      className="w-full h-full"
                      title="Visualizador de PDF"
                    />
                  )}

                  {fileType === "other" && (
                    <div className="flex flex-col items-center p-4 text-center text-amber-400">
                      <FaFile className="text-4xl mb-2" />
                      <span className="text-sm">
                        Visualização não disponível
                      </span>
                      <button
                        onClick={handleDownload}
                        className="mt-2 text-sm text-amber-500 hover:text-amber-400 transition-colors underline flex items-center gap-1"
                      >
                        <FaDownload className="text-sm" />
                        Baixar arquivo
                      </button>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="bg-gray-700/50 p-2 rounded-lg hover:bg-gray-700/70 transition-colors">
                    <p className="text-xs text-amber-500 mb-1">Descrição</p>
                    <p className="text-sm text-gray-200">
                      {evidencia.descricao}
                    </p>
                  </div>

                  <div className="bg-gray-700/50 p-2 rounded-lg hover:bg-gray-700/70 transition-colors">
                    <p className="text-xs text-amber-500 mb-1">Tipo</p>
                    <p className="text-sm text-gray-200">{evidencia.tipo}</p>
                  </div>

                  <div className="bg-gray-700/50 p-2 rounded-lg hover:bg-gray-700/70 transition-colors">
                    <p className="text-xs text-amber-500 mb-1">Coletado por</p>
                    <p className="text-sm text-gray-200">
                      {evidencia.coletadoPor}
                    </p>
                  </div>

                  <div className="bg-gray-700/50 p-2 rounded-lg hover:bg-gray-700/70 transition-colors">
                    <p className="text-xs text-amber-500 mb-1">
                      Data de Coleta
                    </p>
                    <p className="text-sm text-gray-200">
                      {new Date(evidencia.dataAdicao).toLocaleDateString(
                        "pt-BR"
                      )}
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-2/3 flex flex-col gap-4">
                <div className="flex-1 flex flex-col">
                  <p className="text-xs text-amber-500 mb-2">
                    Conteúdo do Laudo
                  </p>
                  <textarea
                    value={laudo}
                    onChange={(e) => setLaudo(e.target.value)}
                    className="w-full h-full p-3 bg-gray-700/50 border border-amber-900/30 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-amber-500 resize-none hover:border-amber-400 transition-colors laudo-content"
                    placeholder="Digite o conteúdo do laudo..."
                  />
                </div>

                <div className="bg-gray-700/50 p-3 rounded-lg hover:bg-gray-700/70 transition-colors">
                  <p className="text-xs text-amber-500 mb-2">
                    Assinatura Digital
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={assinatura}
                      onChange={(e) => {
                        setAssinatura(e.target.value);
                        setIsValid(false);
                      }}
                      placeholder="Insira sua chave de assinatura"
                      className="flex-1 p-2 bg-gray-600/50 border border-amber-900/30 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-amber-500 hover:border-amber-400 transition-colors"
                    />
                    <button
                      onClick={handleValidateSignature}
                      disabled={!assinatura || isValidating}
                      className="px-3 py-2 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-700/50 rounded-lg text-sm transition-all duration-300 hover:scale-[1.02] cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <FaSignature className="inline mr-1 text-purple-400" />
                      <span className="text-purple-200">
                        {isValidating
                          ? "Validando..."
                          : isValid
                          ? "Validado"
                          : "Validar"}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-amber-900/30 bg-gray-850">
              <div className="flex justify-end gap-3">
                <button
                  onClick={handleGerarPDF}
                  disabled={isGeneratingPDF}
                  className="px-4 py-2 bg-red-600/30 hover:bg-red-600/50 border border-red-700/50 rounded-lg text-sm transition-all duration-300 hover:scale-[1.02] cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaFilePdf className="inline mr-1 text-red-400" />
                  <span className="text-red-200">
                    {isGeneratingPDF ? "Gerando PDF..." : "Gerar PDF"}
                  </span>
                </button>

                <button
                  onClick={handleSalvar}
                  className="px-4 py-2 bg-green-600/30 hover:bg-green-600/50 border border-green-700/50 rounded-lg text-sm transition-all duration-300 hover:scale-[1.02] cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!isValid}
                >
                  <FaSave className="inline mr-1 text-green-400" />
                  <span className="text-green-200">
                    {evidencia.laudo ? "Atualizar" : "Salvar"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSuccess && (
        <EvidenciasSalvaSucess
          onClose={() => {
            setShowSuccess(false);
            onClose();
          }}
        />
      )}
    </>
  );
}
