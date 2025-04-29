'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Logo from '../../../public/assets/Logo.png';

interface Usuario {
  nome: string;
  cargo: string;
}

export default function HeaderPerito() {
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  useEffect(() => {
    const usuarioStorage = localStorage.getItem('@dentfy:usuario');
    console.log("Dados do usuário no localStorage:", usuarioStorage);
    
    if (usuarioStorage) {
      try {
        const usuarioData = JSON.parse(usuarioStorage);
        console.log("Dados do usuário parseados:", usuarioData);
        setUsuario(usuarioData);
      } catch (error) {
        console.error("Erro ao fazer parse dos dados do usuário:", error);
      }
    }
  }, []);

  const getIniciais = (nome: string) => {
    const palavras = nome.split(' ');
    if (palavras.length >= 2) {
      return `${palavras[0][0]}${palavras[1][0]}`;
    }
    return palavras[0][0];
  };

  return (
    <header className="bg-[#0E1A26] border-b border-cyan-900/30 h-16">
      <div className="h-full flex items-center justify-between px-4">
        <div className="flex items-center space-x-2 md:space-x-4">
          <div className="relative w-8 h-8 md:w-10 md:h-10 animate-pulse">
            <Image
              src={Logo}
              alt="Logo"
              fill
              className="object-contain animate-logoGlow"
            />
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold text-amber-100 animate-fadeIn">
              Dentify <span className="text-amber-500">Perito</span>
            </h1>
            <p className="text-xs md:text-sm text-amber-100/70 animate-fadeIn hidden sm:block">
              Identificação Criminal
            </p>
          </div>
        </div>

        {usuario && (
          <div className="flex items-center space-x-2 md:space-x-4 animate-fadeIn">
            <div className="text-right hidden sm:block">
              <p className="text-amber-100 font-medium">{usuario.nome}</p>
              <p className="text-sm text-amber-100/70">{usuario.cargo}</p>
            </div>
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-amber-600 flex items-center justify-center animate-pulse">
              <span className="text-[#0E1A26] font-bold text-sm md:text-base">
                {getIniciais(usuario.nome)}
              </span>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes logoGlow {
          0%, 100% {
            filter: drop-shadow(0 0 5px rgba(234, 179, 8, 0.5));
          }
          50% {
            filter: drop-shadow(0 0 15px rgba(234, 179, 8, 0.8));
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-logoGlow {
          animation: logoGlow 2s ease-in-out infinite;
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </header>
  );
}