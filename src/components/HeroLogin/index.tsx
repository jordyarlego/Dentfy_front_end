// components/HeroLogin.js
'use client';

export default function HeroLogin() {
  return (
    <div 
      className="hidden lg:block lg:w-[65%] bg-[#1A3446] bg-contain bg-no-repeat bg-center"
      style={{
        backgroundImage: "url('/assets/dente_lupa_logo.png')",
        backgroundSize: '50%',
        animation: 'floatVertical 12s ease-in-out infinite'
      }}
    >
    </div>
  )
}