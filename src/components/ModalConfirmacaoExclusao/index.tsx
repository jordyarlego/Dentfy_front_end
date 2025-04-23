"use client";

import Image from "next/image";
import CaveiraPeste from "../../../public/assets/CaveiraPeste.png";

interface ModalConfirmacaoExclusaoProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}

export default function ModalConfirmacaoExclusao({
  isOpen,
  onClose,
  onConfirm,
  title,
  message
}: ModalConfirmacaoExclusaoProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="relative bg-[#0E1A26] border-2 border-red-500/30 rounded-xl shadow-2xl w-full max-w-md p-8 animate-slideIn">
        <div className="absolute inset-0 opacity-5 mix-blend-overlay">
          <Image
            src={CaveiraPeste}
            alt="Caveira decorativa"
            className="object-cover"
            fill
          />
        </div>

        <div className="relative z-10">
          <div className="flex flex-col items-center text-center">
            <div className="relative w-24 h-24 mb-6">
              <Image
                src={CaveiraPeste}
                alt="Caveira"
                className="object-contain"
                fill
              />
            </div>

            <h2 className="text-2xl font-bold text-red-400 mb-2">
              {title}
            </h2>

            <p className="text-gray-300 mb-6">
              {message}
            </p>

            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="px-6 py-2 rounded-lg bg-gray-700 text-gray-300 hover:bg-gray-600 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  onConfirm();
                  onClose();
                }}
                className="px-6 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors duration-200"
              >
                Confirmar Exclusão
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 