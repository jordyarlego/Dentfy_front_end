'use client';

import Link from 'next/link';
import { 
  FolderIcon, 
  UserGroupIcon,
  ArrowLeftOnRectangleIcon,
  ChartBarIcon,
  ChevronLeftIcon,
  ChevronRightIcon
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('@dentfy:usuario');
    router.push('/Login');
  };

  if (!isAuthenticated && pathname !== '/Login') {
    return null;
  }

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className={`relative bg-[#0E1A26] border-r border-cyan-900/30 h-full transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-64'}`}>
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

      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#0E1A26] p-6 rounded-xl border border-amber-500/30 max-w-md w-full mx-4 shadow-xl">
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
                className="px-4 py-2 rounded-lg bg-amber-600 text-[#12212B] hover:bg-amber-700 transition-all duration-300 cursor-pointer hover:scale-105 font-medium"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}