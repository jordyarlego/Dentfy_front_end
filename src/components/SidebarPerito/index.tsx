'use client';

import Link from 'next/link';
import { 
  FolderIcon, 
  UserGroupIcon,
  ArrowLeftOnRectangleIcon,
  ChartBarIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UsersIcon
} from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function SidebarPerito() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token && pathname !== '/Login') {
      router.push('/Login');
    } else {
      setIsAuthenticated(true);
    }
  }, [pathname, router]);

  const playLogoutSound = () => {
    const isMuted = localStorage.getItem('soundMuted') === 'true';
    if (isMuted) {
      handleLogoutComplete();
      return;
    }

    const audio = new Audio('/assets/GoodBye_devil.mp3');
    audio.volume = 0.3;
    
    audio.play()
      .then(() => {
        audio.addEventListener('ended', () => {
          handleLogoutComplete();
        });
      })
      .catch(error => {
        console.log("Erro ao reproduzir som:", error);
        handleLogoutComplete();
      });
  };

  const handleLogoutComplete = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('@dentfy:usuario');
    router.push('/Login');
  };

  const handleLogout = () => {
    playLogoutSound();
    setShowLogoutModal(false);
  };

  if (!isAuthenticated && pathname !== '/Login') {
    return null;
  }

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <>
      {/* Versão Mobile - Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#0E1A26] border-t border-cyan-900/30 z-50">
        <div className="flex justify-around items-center p-2">
          <Link 
            href="/dashboard" 
            className={`flex flex-col items-center p-2 ${
              isActive('/dashboard') ? 'text-amber-500' : 'text-amber-100'
            }`}
          >
            <ChartBarIcon className="h-6 w-6" />
            <span className="text-xs">Dashboard</span>
          </Link>
          
          <Link 
            href="/CasosPerito" 
            className={`flex flex-col items-center p-2 ${
              isActive('/CasosPerito') ? 'text-amber-500' : 'text-amber-100'
            }`}
          >
            <FolderIcon className="h-6 w-6" />
            <span className="text-xs">Casos</span>
          </Link>
          
          <Link 
            href="/Usuarios" 
            className={`flex flex-col items-center p-2 ${
              isActive('/Usuarios') ? 'text-amber-500' : 'text-amber-100'
            }`}
          >
            <UsersIcon className="h-6 w-6" />
            <span className="text-xs">Usuários</span>
          </Link>
          
          <button
            onClick={() => setShowLogoutModal(true)}
            className="flex flex-col items-center p-2 text-amber-100"
          >
            <ArrowLeftOnRectangleIcon className="h-6 w-6" />
            <span className="text-xs">Sair</span>
          </button>
        </div>
      </div>

      {/* Versão Desktop - Sidebar */}
      <div className={`hidden lg:block relative bg-[#0E1A26] border-r border-cyan-900/30 h-full transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-20 bg-[#0E1A26] border border-cyan-900/30 rounded-full p-1 text-amber-100 hover:text-white transition-all duration-300 cursor-pointer hover:scale-110"
      >
        {isCollapsed ? (
          <ChevronRightIcon className="h-4 w-4" />
        ) : (
          <ChevronLeftIcon className="h-4 w-4" />
        )}
      </button>

      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <Link 
          href="/dashboard" 
            className={`flex items-center space-x-3 p-3 rounded-lg text-amber-100 hover:bg-[#12212B] hover:text-white transition-all duration-300 group cursor-pointer ${
              isActive('/dashboard') 
                ? 'bg-[#12212B] text-white scale-105' 
                : 'hover:scale-105'
          }`}
        >
            <ChartBarIcon className={`h-5 w-5 transition-all duration-300 ${
              isActive('/dashboard') 
                ? 'text-amber-500 scale-110' 
                : 'group-hover:text-white group-hover:scale-110'
            }`} />
            {!isCollapsed && (
              <span className={`font-medium transition-all duration-300 ${
                isActive('/dashboard') 
                  ? 'text-amber-500 animate-pulse' 
                  : 'group-hover:text-white'
              }`}>
                Dashboard
              </span>
            )}
        </Link>

        <Link 
          href="/CasosPerito" 
            className={`flex items-center space-x-3 p-3 rounded-lg text-amber-100 hover:bg-[#12212B] hover:text-white transition-all duration-300 group cursor-pointer ${
              isActive('/CasosPerito') 
                ? 'bg-[#12212B] text-white scale-105' 
                : 'hover:scale-105'
          }`}
        >
            <FolderIcon className={`h-5 w-5 transition-all duration-300 ${
              isActive('/CasosPerito') 
                ? 'text-amber-500 scale-110' 
                : 'group-hover:text-white group-hover:scale-110'
            }`} />
            {!isCollapsed && (
              <span className={`font-medium transition-all duration-300 ${
                isActive('/CasosPerito') 
                  ? 'text-amber-500 animate-pulse' 
                  : 'group-hover:text-white'
              }`}>
                Casos
              </span>
            )}
        </Link>

        <Link 
          href="/Usuarios" 
            className={`flex items-center space-x-3 p-3 rounded-lg text-amber-100 hover:bg-[#12212B] hover:text-white transition-all duration-300 group cursor-pointer ${
              isActive('/Usuarios') 
                ? 'bg-[#12212B] text-white scale-105' 
                : 'hover:scale-105'
          }`}
        >
            <UserGroupIcon className={`h-5 w-5 transition-all duration-300 ${
              isActive('/Usuarios') 
                ? 'text-amber-500 scale-110' 
                : 'group-hover:text-white group-hover:scale-110'
            }`} />
            {!isCollapsed && (
              <span className={`font-medium transition-all duration-300 ${
                isActive('/Usuarios') 
                  ? 'text-amber-500 animate-pulse' 
                  : 'group-hover:text-white'
              }`}>
                Usuários
              </span>
            )}
        </Link>
      </div>

      <div className="p-4 border-t border-cyan-900/30">
        <button 
          onClick={() => setShowLogoutModal(true)}
            className="flex items-center space-x-3 p-3 rounded-lg text-amber-100 hover:bg-[#12212B] hover:text-white transition-all duration-300 group cursor-pointer w-full hover:scale-105"
        >
            <ArrowLeftOnRectangleIcon className="h-5 w-5 group-hover:scale-110 transition-transform" />
          {!isCollapsed && <span className="font-medium">Sair</span>}
        </button>
        </div>
      </div>

      {/* Modal de Confirmação de Logout (compartilhado entre mobile e desktop) */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1000]">
          <div className="bg-[#0E1A26] p-6 rounded-xl border border-amber-500/30 max-w-md w-full mx-4 shadow-xl animate-modalEntry">
            <h3 className="text-lg font-semibold text-amber-100 mb-4">Confirmar saída</h3>
            <p className="text-amber-100/80 mb-6">Tem certeza que deseja sair do sistema?</p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 rounded-lg bg-[#1A3446] text-amber-100 hover:bg-[#23405a] transition-all duration-300 cursor-pointer hover:scale-105"
              >
                Cancelar
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-lg bg-amber-600 text-[#12212B] hover:bg-amber-700 transition-all duration-300 cursor-pointer hover:scale-105 font-medium group"
              >
                <span className="flex items-center gap-2">
                  <ArrowLeftOnRectangleIcon className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
                Confirmar
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}