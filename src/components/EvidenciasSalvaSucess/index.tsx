'use client';
import { useState, useEffect } from 'react';
import { FaCheck, FaThumbsUp } from 'react-icons/fa';
import Image from 'next/image';
import CaveiraPeste from '../../../public/assets/CaveiraPeste.png';


interface EvidenciasSalvaSucessProps {
  onClose: () => void;
}

export default function EvidenciasSalvaSucess({ onClose }: EvidenciasSalvaSucessProps) {
  const [progress, setProgress] = useState(0);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    const duration = 2000; // 2 segundos
    const interval = 50; // Atualizar a cada 50ms
    const steps = duration / interval;
    const increment = 100 / steps;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + increment;
      });
    }, interval);

    // Mostrar mensagem após 500ms
    const messageTimer = setTimeout(() => {
      setShowMessage(true);
    }, 500);

    return () => {
      clearInterval(timer);
      clearTimeout(messageTimer);
    };
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const closeTimer = setTimeout(() => {
        onClose();
      }, 500);
      return () => clearTimeout(closeTimer);
    }
  }, [progress, onClose]);

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/80 backdrop-blur-xl">
      <div className="relative bg-[#0E1A26] border-2 border-amber-500/30 rounded-xl shadow-2xl w-full max-w-md p-6 animate-fadeIn">
        <div className="absolute inset-0 opacity-5 mix-blend-overlay">
          <Image
            src={CaveiraPeste}
            alt="Caveira decorativa"
            className="object-cover"
            fill
          />
        </div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="relative w-16 h-16 mb-4">
            <div className="absolute inset-0 bg-amber-500/20 rounded-full animate-ping" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-amber-500/30 rounded-full flex items-center justify-center">
                <FaCheck className="text-amber-400 text-2xl animate-bounce" />
              </div>
            </div>
          </div>

          <h3 className="text-xl font-bold text-amber-100 mb-2 text-center">
            Evidência salva com sucesso!
          </h3>

          {showMessage && (
            <div className="text-center mb-4 animate-fadeIn">
              <p className="text-amber-400 mb-2">A evidencia foi salva e anexada ao caso!</p>
              <div className="flex items-center justify-center gap-2 text-amber-500">
                <FaThumbsUp className="animate-bounce" />
                <span>Ótimo trabalho!</span>
              </div>
            </div>
          )}

          <div className="w-full bg-gray-700/50 rounded-full h-2 mb-4">
            <div
              className="bg-amber-500 h-2 rounded-full transition-all duration-50 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>

          <p className="text-sm text-amber-400">
            Fechando em {Math.ceil((100 - progress) / 100 * 2)}s...
          </p>
        </div>
      </div>
    </div>
  );
}