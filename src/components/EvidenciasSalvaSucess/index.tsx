'use client';
import { useEffect, useState } from 'react';
import { FaCheck } from 'react-icons/fa';
import Image from 'next/image';
import Logo from '../../../public/assets/Logo.png';
import CaveiraPeste from '../../../public/assets/CaveiraPeste.png';
import et from '../../../public/assets/et.gif';
import tititicaveira from '../../../public/assets/tititicaveira.gif';
import thunder2 from '../../../public/assets/thunder2.gif';

interface EvidenciasSalvaSucessProps {
  onClose: () => void;
}

export default function EvidenciasSalvaSucess({ onClose }: EvidenciasSalvaSucessProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed inset-0 z-[300] flex items-center justify-center transition-opacity duration-500 ${
      isVisible 
        ? 'bg-black/80 backdrop-blur-lg' 
        : 'opacity-0 backdrop-blur-0 pointer-events-none'
    }`}>
      {/* Background com Thunder2 */}
      <div className="absolute inset-0 z-0 opacity-60">
        <Image
          src={thunder2}
          alt="Thunder Background"
          fill
          className="object-cover"
        />
      </div>

      <div className={`relative bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80 border-2 border-amber-900/80 rounded-xl p-8 shadow-2xl max-w-2xl w-full mx-4 transform transition-all duration-500 z-10 ${
        isVisible ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
      }`}>

        {/* ET na Esquerda */}
        <div className="absolute -bottom-4 -left-8 opacity-80 hover:opacity-100 transition-opacity z-0">
          <Image
            src={et}
            alt="ET"
            width={70}
            height={70}
            className="object-contain"
          />
        </div>

        {/* Container Principal Horizontal */}
        <div className="flex items-center justify-between gap-8 relative z-10">
          
          {/* Check com Animação Moderna */}
          <div className="relative w-32 h-32 flex items-center justify-center">
            <FaCheck className="text-amber-500 text-6xl animate-checkModern" />
          </div>

          {/* Container Mensagem + Logo */}
          <div className="flex-1 flex flex-col items-center gap-4">
            {/* Mensagem Principal */}
            <div className="text-center">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent tracking-wider mb-2">
                EVIDÊNCIA SALVA
              </h1>
              <p className="text-lg text-amber-700 font-mono">Registro confirmado no sistema</p>
            </div>

            {/* Logo Pulsante */}
            <div className="animate-logoPulse">
              <Image
                src={Logo}
                alt="Logo"
                width={40}
                height={16}
                className="opacity-80"
              />
            </div>
          </div>

          {/* Caveiras na Direita */}
          <div className="flex flex-col items-end gap-4">
            {/* Titicaveira Pequena */}
            <div className="relative w-20 h-20">
              <Image
                src={tititicaveira}
                alt="Titicaveira"
                fill
                className="object-contain animate-bounce"
              />
            </div>

            {/* Caveira da Paste Animada */}
            <div className="relative w-24 h-24">
              <Image
                src={CaveiraPeste}
                alt="Caveira"
                fill
                className="object-contain animate-skullFloat"
              />
            </div>
          </div>
        </div>

        <style jsx global>{`
          @keyframes checkModern {
            0% { transform: scale(0) rotate(-90deg); opacity: 0; }
            30% { transform: scale(1.2) rotate(15deg); opacity: 1; }
            50% { transform: scale(0.9) rotate(-5deg); }
            70% { transform: scale(1.1) rotate(5deg); }
            100% { transform: scale(1) rotate(0); }
          }

          @keyframes skullFloat {
            0%, 100% { transform: translateY(0) rotate(-5deg); }
            50% { transform: translateY(-10px) rotate(5deg); }
          }

          @keyframes logoPulse {
            0%, 100% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.1); opacity: 1; }
          }

          .animate-checkModern {
            animation: checkModern 1s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }

          .animate-skullFloat {
            animation: skullFloat 2s ease-in-out infinite;
          }

          .animate-logoPulse {
            animation: logoPulse 1.5s ease-in-out infinite;
          }

          .animate-bounce {
            animation: bounce 1.5s ease-in-out infinite;
          }

          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
        `}</style>
      </div>
    </div>
  );
}