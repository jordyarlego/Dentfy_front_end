import CasosPerito from "@/components/CasosPerito";
import HeaderPerito from "@/components/HeaderPerito";
import SidebarPerito from "@/components/SidebarPerito";

export default function DashboardPerito() {
  return (
    <div className="flex flex-col h-screen">
      {/* Header no topo */}
      <HeaderPerito />

      {/* Corpo com Sidebar + Conteúdo */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar à esquerda */}
        <SidebarPerito />

        {/* Conteúdo principal */}
        <main className="flex-1 p-4 overflow-auto bg-gray-100">
          
          <CasosPerito />
        </main>
      </div>
    </div>
  );
}
