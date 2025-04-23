'use client';

import SidebarPerito from "@/components/SidebarPerito";
import HeaderPerito from "@/components/HeaderPerito";
import TabelaUsuarios from "@/components/TabelaUsuarios";

export default function Usuarios() {
  return (
    <div className="flex h-screen bg-gray-900">
      <SidebarPerito />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <HeaderPerito />
        
        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-100 mb-6 animate-fadeIn">
            Gerenciamento de Usuários
          </h1>
          <TabelaUsuarios />
        </main>
      </div>

      <style jsx global>{`
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

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}