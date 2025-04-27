"use client";

import { useState } from "react";
import { FaTimes, FaFilePdf, FaSignature, FaSave, FaArrowLeft } from "react-icons/fa";
import Image from "next/image";
import CaveiraPeste from "../../../public/assets/CaveiraPeste.png";
import Logo from "../../../public/assets/Logo.png";

interface ModalRelatorioProps {
  isOpen: boolean;
  onClose: () => void;
  caso: {
    titulo: string;
    
  };
}

export default function ModalRelatorio({ isOpen, onClose, caso }: ModalRelatorioProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-gray-900/50">
      <div 
        className="bg-[#0E1A26]/95 w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-700 overflow-hidden animate-modalEntry"
        style={{
          boxShadow: '0 0 40px rgba(251, 191, 36, 0.1)'
        }}
      >
        
        <div className="relative p-6 border-b border-gray-700 bg-gradient-to-r from-[#0E1A26] via-[#152736] to-[#0E1A26]">
          <div className="absolute left-4 top-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-amber-500 transition-all duration-300 hover:scale-110"
            >
              <FaArrowLeft className="h-6 w-6" />
            </button>
          </div>
          
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
              Relatório do Caso
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

          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-amber-500 transition-all duration-300 hover:scale-110 hover:rotate-90 transform"
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>

        
        <div className="p-6 space-y-6">
          <div className="bg-gray-800/30 p-6 rounded-xl border border-gray-700 backdrop-blur-sm transform transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10 hover:border-amber-500/30">
            <h3 className="text-lg font-medium text-amber-500 mb-3 flex items-center gap-2">
              <span className="inline-block w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
              Título do Caso
            </h3>
            <p className="text-gray-300 font-medium">{caso.titulo}</p>
          </div>

          {/* Barra de Ferramentas com efeitos melhorados */}
          <div className="flex justify-between items-center pt-4">
            <div className="flex gap-4">
              <button
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 group shadow-lg hover:shadow-blue-500/30 transform hover:-translate-y-1"
              >
                <FaFilePdf className="group-hover:scale-110 transition-transform" />
                <span className="relative">
                  <span className="relative z-10">Gerar PDF</span>
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-white/30 transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
                </span>
              </button>
              
              <button
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all duration-300 group shadow-lg hover:shadow-purple-500/30 transform hover:-translate-y-1"
              >
                <FaSignature className="group-hover:scale-110 transition-transform" />
                <span className="relative">
                  <span className="relative z-10">Assinatura Digital</span>
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-white/30 transform scale-x-0 group-hover:scale-x-100 transition-transform"></span>
                </span>
              </button>
            </div>

            <button
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-300 group shadow-lg hover:shadow-amber-500/30 transform hover:-translate-y-1"
            >
              <FaSave className="group-hover:scale-110 transition-transform" />
              <span className="relative">
                <span className="relative z-10">Salvar Relatório</span>
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

        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        @keyframes glow {
          0%, 100% {
            filter: brightness(1) drop-shadow(0 0 8px rgba(251, 191, 36, 0.3));
          }
          50% {
            filter: brightness(1.2) drop-shadow(0 0 12px rgba(251, 191, 36, 0.5));
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
      `}</style>
    </div>
  );
}