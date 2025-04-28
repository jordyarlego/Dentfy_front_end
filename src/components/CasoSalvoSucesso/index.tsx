"use client";

import { useEffect } from 'react';
import { FaCheckCircle } from 'react-icons/fa';
import Image from 'next/image';

interface CasoSalvoSucessoProps {
  onClose: () => void;
}

export default function CasoSalvoSucesso({ onClose }: CasoSalvoSucessoProps) {
  useEffect(() => {
    const playSound = async () => {
      try {
        const audio = new Audio('/assets/papagaio.mp3');
        audio.volume = 0.3;
        await audio.play();
      } catch (error) {
        console.warn("Não foi possível tocar o som:", error);
      }
    };

    playSound();

    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999]">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn" />
      
      <div className="relative bg-[#0E1A26] border-2 border-amber-500/30 rounded-2xl p-8 shadow-2xl animate-modalEntry max-w-md w-full mx-4">
        {/* Efeito de brilho nas bordas */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-amber-500/0 via-amber-500/20 to-amber-500/0 animate-shimmer" />
        
        {/* Container principal */}
        <div className="relative z-10">
          {/* ET GIF */}
          <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-32 h-32">
            <div className="relative w-full h-full">
              <Image
                src="/assets/et.gif"
                alt="ET Celebration"
                fill
                className="object-contain animate-float"
              />
            </div>
          </div>

          {/* Conteúdo */}
          <div className="mt-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <FaCheckCircle className="text-6xl text-amber-500 animate-successPulse" />
                <div className="absolute inset-0 bg-amber-500 rounded-full animate-successRing opacity-0" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-amber-400 mb-2 animate-slideUp">
              Caso salvo com sucesso!
            </h3>
            
            <p className="text-amber-300/80 animate-fadeIn delay-150">
              Seus dados foram registrados com segurança
            </p>
          </div>

          {/* Efeito de progresso */}
          <div className="mt-6 w-full bg-amber-900/20 h-1 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500 animate-progress" />
          </div>
        </div>
      </div>

      {/* Estilos das animações */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes modalEntry {
          from { 
            opacity: 0;
            transform: scale(0.9) translateY(20px);
          }
          to { 
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes successPulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        @keyframes successRing {
          0% { 
            transform: scale(0.8);
            opacity: 0.5;
          }
          100% { 
            transform: scale(2);
            opacity: 0;
          }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        @keyframes slideUp {
          from { 
            opacity: 0;
            transform: translateY(10px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes progress {
          from { width: 0; }
          to { width: 100%; }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .animate-modalEntry {
          animation: modalEntry 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        .animate-successPulse {
          animation: successPulse 2s ease-in-out infinite;
        }

        .animate-successRing {
          animation: successRing 2s ease-out infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 3s linear infinite;
          background-size: 200% auto;
        }

        .animate-slideUp {
          animation: slideUp 0.5s ease-out forwards;
        }

        .animate-progress {
          animation: progress 2.5s linear forwards;
        }

        .delay-150 {
          animation-delay: 150ms;
        }
      `}</style>
    </div>
  );
} 