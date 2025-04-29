'use client';

import Image from 'next/image';

export default function HeroLogin() {
  return (
    <div className="hidden lg:block lg:w-[65%] h-screen relative bg-[#1A3446]">
      <div className="absolute inset-0 w-full h-full flex items-center ml-[35%]">
        {/* Container do Background Splash */}
        <div className="relative w-[1200px] h-[1200px]">
          {/* Fundo com opacidade reduzida */}
          <div 
            className="absolute inset-0 bg-contain bg-center bg-no-repeat opacity-50"
            style={{ backgroundImage: 'url(/assets/backgroundsplash.png)' }}
          />

          {/* Container central da animação */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative animate-floatNotes">
              {/* Notas aumentadas em 10% */}
              <Image 
                src="/assets/notes.png"
                alt="Notas"
                width={550}
                height={550}
                priority
                className="relative z-[5]"
              />

              {/* Dente com brilho intenso e atrás da lupa */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[9] animate-growTooth">
                <div className="relative animate-floatDente">
                  <Image 
                    src="/assets/dente.png"
                    alt="Dente"
                    width={330}
                    height={330}
                    priority
                    className="animate-intenseGlow"
                  />
                </div>
              </div>

              {/* Lupa aumentada em 10% e na frente */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[10] w-[385px] h-[385px] animate-lupaLendo">
                <Image 
                  src="/assets/lupa.png"
                  alt="Lupa"
                  layout="fill"
                  objectFit="contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}