import CasosPerito from "@/components/CasosPerito";
import HeaderPerito from "@/components/HeaderPerito";
import SidebarPerito from "@/components/SidebarPerito";

export default function DashboardPerito() {
  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white">
      
      <HeaderPerito />

      
      <div className="flex flex-1 overflow-hidden flex-col sm:flex-row">
        
        <SidebarPerito />

        
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto backdrop-blur-sm">
          <CasosPerito />
        </main>
      </div>
    </div>
  );
}
