"use client";

import { FaTimes, FaFileAlt } from "react-icons/fa";
import Image from "next/image";

interface Evidencia {
  _id: string;
  nome: string;
  tipo: string;
  descricao: string;
  coletadoPor: string;
  arquivo: string;
  imagemURL: string;
  dataColeta: string;
  laudo?: string;
}

interface ModalDetalhesEvidenciaProps {
  isOpen: boolean;
  onClose: () => void;
  evidencia: Evidencia;
  onGerarLaudo: (evidencia: Evidencia) => void;
}

export default function ModalDetalhesEvidencia({
  isOpen,
  onClose,
  evidencia,
  onGerarLaudo
}: ModalDetalhesEvidenciaProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-[#0E1A26] border border-amber-500/30 rounded-xl shadow-2xl w-full max-w-4xl p-6 animate-modalEntry">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-amber-100">Detalhes da Evidência</h3>
          <div className="flex items-center gap-4">
            <button
              onClick={() => onGerarLaudo(evidencia)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-300 hover:scale-105 group"
            >
              <FaFileAlt className="text-sm group-hover:rotate-12 transition-transform" />
              Gerar Laudo
            </button>
            <button
              onClick={onClose}
              className="text-amber-100 hover:text-amber-500 transition-all duration-300 hover:rotate-90"
            >
              <FaTimes className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="space-y-6">
          {evidencia.tipo === "imagem" && (
            <div className="relative w-full h-64 rounded-lg overflow-hidden bg-gray-800/30">
              <Image
                src={evidencia.imagemURL || "/assets/placeholder-image.png"}
                alt={evidencia.nome}
                fill
                className="object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/assets/placeholder-image.png";
                }}
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-800/30 p-4 rounded-lg hover:bg-gray-800/40 transition-colors">
              <h4 className="text-sm font-medium text-amber-500 mb-2">Nome</h4>
              <p className="text-gray-200">{evidencia.nome}</p>
            </div>

            <div className="bg-gray-800/30 p-4 rounded-lg hover:bg-gray-800/40 transition-colors">
              <h4 className="text-sm font-medium text-amber-500 mb-2">Tipo</h4>
              <p className="text-gray-200">{evidencia.tipo}</p>
            </div>

            <div className="bg-gray-800/30 p-4 rounded-lg hover:bg-gray-800/40 transition-colors">
              <h4 className="text-sm font-medium text-amber-500 mb-2">Coletado Por</h4>
              <p className="text-gray-200">{evidencia.coletadoPor}</p>
            </div>

            <div className="bg-gray-800/30 p-4 rounded-lg hover:bg-gray-800/40 transition-colors">
              <h4 className="text-sm font-medium text-amber-500 mb-2">Data de Adição</h4>
              <p className="text-gray-200">
                {new Date(evidencia.dataColeta).toLocaleDateString("pt-BR")}
              </p>
            </div>
          </div>

          <div className="bg-gray-800/30 p-4 rounded-lg hover:bg-gray-800/40 transition-colors">
            <h4 className="text-sm font-medium text-amber-500 mb-2">Descrição</h4>
            <p className="text-gray-200">{evidencia.descricao}</p>
          </div>

          {evidencia.tipo === "texto" && (
            <div className="bg-gray-800/30 p-4 rounded-lg hover:bg-gray-800/40 transition-colors">
              <h4 className="text-sm font-medium text-amber-500 mb-2">Conteúdo</h4>
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <p className="text-gray-200 whitespace-pre-wrap">{evidencia.arquivo}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 