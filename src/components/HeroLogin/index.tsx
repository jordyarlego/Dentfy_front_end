'use client';

export default function HeroLogin() {
  return (
    <div className="hidden lg:block lg:w-[65%] bg-[#1A3446] relative overflow-hidden">
     
      <div 
        className="absolute inset-0 bg-contain bg-no-repeat bg-center z-0 opacity-60"
        style={{
          backgroundImage: "url('/assets/backgroundsplash.png')",
          backgroundSize: '80%',
          backgroundPosition: 'center center'
        }}
      />

      
      <div 
        className="absolute w-80 h-80 bg-contain bg-no-repeat bg-center z-20"
        style={{
          backgroundImage: "url('/assets/notes.png')",
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          filter: 'drop-shadow(0 20px 15px rgba(0,0,0,0.6))',
          animation: 'floatNotes 12s ease-in-out infinite'
        }}
      />

      
      <div 
        className="absolute w-64 h-64 bg-contain bg-no-repeat bg-center z-30"
        style={{
          backgroundImage: "url('/assets/lupa.png')",
          top: '45%',
          left: '35%',
          filter: 'drop-shadow(0 15px 12px rgba(0,0,0,0.5)) brightness(1.1)',
          animation: 'floatLupa 8s ease-in-out infinite 1s, investigate 15s ease-in-out infinite'
        }}
      />

      
      <div 
        className="absolute bg-contain bg-no-repeat bg-center z-40"
        style={{
          backgroundImage: "url('/assets/dente.png')",
          top: 'calc(50% - 90px)',
          left: 'calc(50% - 90px)',
          width: '0px',
          height: '0px',
          transform: 'translate(-50%, -50%)',
          filter: 'drop-shadow(0 0 15px rgba(255,255,255,0.8)) brightness(1.2)',
          borderRadius: '9999px',
          animation: `
            growTooth 6s ease-out forwards,
            floatDente 5s ease-in-out infinite 6s,
            lightPulse 3s ease-in-out infinite 6s,
            borderPulse 2s ease-in-out infinite 6s
          `
        }}
      />

      
      <div 
        className="absolute inset-0 pointer-events-none z-50"
        style={{
          background: 'radial-gradient(circle at 60% 55%, rgba(255,255,255,0.15) 0%, transparent 40%)',
          mixBlendMode: 'screen'
        }}
      />
    </div>
  );
}
