"use client";

import { useEffect } from 'react';
import { FaExclamationTriangle, FaTimes, FaTrash } from "react-icons/fa";

interface ModalConfirmacaoDeleteProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  titulo: string;
}

export default function ModalConfirmacaoDelete({
  isOpen,
  onClose,
  onConfirm,
  titulo
}: ModalConfirmacaoDeleteProps) {
  useEffect(() => {
    if (isOpen) {
      const audio = new Audio('/assets/Apagar.mp3');
      audio.volume = 0.3;
      audio.play().catch(error => {
        console.log("Erro ao reproduzir som:", error);
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-gray-900/50">
      <div 
        className="bg-[#0E1A26]/95 w-full max-w-md rounded-2xl shadow-2xl border border-red-500/20 overflow-hidden animate-modalEntry"
        style={{
          boxShadow: '0 0 40px rgba(239, 68, 68, 0.1)'
        }}
      >
        <div className="relative p-6 border-b border-gray-700 bg-gradient-to-r from-[#0E1A26] via-[#152736] to-[#0E1A26]">
          <div className="flex justify-center items-center">
            <div className="relative group animate-float">
              <div className="p-3 bg-red-500/10 rounded-full">
                <FaExclamationTriangle className="h-8 w-8 text-red-500 animate-pulse" />
              </div>
              <div className="absolute -inset-2 bg-red-500/20 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-amber-500 transition-all duration-300 hover:scale-110 hover:rotate-90 transform"
          >
            <FaTimes className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <h3 className="text-xl font-bold text-center text-red-500 mb-2">
            Confirmar Exclusão
          </h3>
          
          <div className="text-center mb-6">
            <p className="text-gray-300 mb-2">
              Você está prestes a excluir o caso:
            </p>
            <p className="text-amber-500 font-medium">
              {titulo}
            </p>
            <p className="text-gray-400 text-sm mt-4">
              Esta ação não poderá ser desfeita e todas as evidências relacionadas serão perdidas.
            </p>
          </div>

          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-700 text-gray-200 rounded-xl hover:bg-gray-600 transition-all duration-300 group transform hover:scale-105"
            >
              Cancelar
            </button>
            
            <button
              onClick={() => {
                onConfirm();
                onClose();
              }}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 transition-all duration-300 group transform hover:scale-105 hover:shadow-lg hover:shadow-red-500/30"
            >
              <FaTrash className="h-4 w-4 group-hover:scale-110 transition-transform" />
              <span className="relative">
                <span className="relative z-10">Excluir Caso</span>
                <span className="absolute inset-x-0 bottom-0 h-0.5 bg-white/30 transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
              </span>
            </button>
          </div>
        </div>
      </div>

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
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        .animate-modalEntry {
          animation: modalEntry 0.3s ease-out forwards;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
} 