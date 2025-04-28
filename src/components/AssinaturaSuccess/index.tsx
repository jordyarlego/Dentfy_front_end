"use client";

import { useEffect, useState } from 'react';
import { FaSignature } from 'react-icons/fa';
import Image from 'next/image';

interface AssinaturaSuccessProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AssinaturaSuccess({ isOpen, onClose }: AssinaturaSuccessProps) {
  const [progress, setProgress] = useState(100);
  const DURATION = 3000; // 3 segundos
  const UPDATE_INTERVAL = 10; // Atualiza a cada 10ms para animação suave

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, DURATION);
      
      // Atualiza a barra de progresso
      const startTime = Date.now();
      const progressInterval = setInterval(() => {
        const elapsedTime = Date.now() - startTime;
        const newProgress = Math.max(0, 100 - (elapsedTime / DURATION) * 100);
        setProgress(newProgress);
        
        if (elapsedTime >= DURATION) {
          clearInterval(progressInterval);
        }
      }, UPDATE_INTERVAL);

      return () => {
        clearTimeout(timer);
        clearInterval(progressInterval);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[200]">
      <div className="bg-[#0E1A26]/90 backdrop-blur-md rounded-2xl p-8 border border-purple-500/30 shadow-lg shadow-purple-500/20 animate-feedbackEntry">
        <div className="relative flex flex-col items-center gap-4">
          <div className="relative w-32 h-32">
            <Image
              src="/assets/CaveiraPeste.png"
              alt="Caveira"
              fill
              className="object-contain animate-float"
            />
          </div>
          <div className="absolute -inset-2 bg-purple-500/20 rounded-full blur-xl opacity-75 animate-pulse"></div>
          <FaSignature className="text-6xl text-purple-500 animate-bounce" />
          <h3 className="text-xl font-bold text-purple-400 animate-fadeIn">
            Relatório Assinado com Sucesso!
          </h3>
          
          {/* Barra de Progresso */}
          <div className="w-full h-1 bg-gray-700 rounded-full mt-2 overflow-hidden">
            <div 
              className="h-full bg-purple-500 transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 