'use client';

import { FaUser, FaEnvelope, FaUserTie, FaIdCard, FaTimes } from 'react-icons/fa';
import Image from 'next/image';
import Logo from '../../../public/assets/Logo.png';
import CaveiraPeste from '../../../public/assets/CaveiraPeste.png';

interface Usuario {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  cargo: string;
  status: string;
}

interface ModalVisualizacaoUsuarioProps {
  usuario: Usuario;
  onClose: () => void;
  onEdit: (usuario: Usuario) => void;
  onDelete: (id: string) => void;
}

export default function ModalVisualizacaoUsuario({
  usuario,
  onClose,
  onEdit,
  onDelete,
}: ModalVisualizacaoUsuarioProps) {
  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="relative bg-[#0E1A26] border border-amber-500/30 rounded-xl shadow-2xl w-full max-w-4xl animate-slideIn">
        <div className="absolute inset-0 pointer-events-none opacity-5 mix-blend-overlay">
          <Image
            src={CaveiraPeste}
            alt="Caveira decorativa"
            fill
            className="object-cover"
          />
        </div>

        <div className="flex justify-between items-center p-6 border-b border-amber-500/30">
          <div className="flex items-center gap-4">
            <div className="relative w-12 h-12 animate-pulse">
              <Image src={Logo} alt="Logo" fill className="object-contain" />
            </div>
            <h2 className="text-xl font-bold text-amber-100 border-l-4 border-amber-600 pl-3">
              Detalhes do Usuário
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-amber-100 hover:text-amber-500 transition-colors group"
          >
            <FaTimes className="h-6 w-6 group-hover:rotate-90 transition-transform" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-amber-500">
                  <FaUser className="inline mr-2" />
                  Nome Completo
                </label>
                <p className="text-amber-100">{usuario.nome}</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-amber-500">
                  <FaEnvelope className="inline mr-2" />
                  E-mail
                </label>
                <p className="text-amber-100">{usuario.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-amber-500">
                  <FaIdCard className="inline mr-2" />
                  CPF
                </label>
                <p className="text-amber-100">{usuario.cpf}</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-amber-500">
                  <FaUserTie className="inline mr-2" />
                  Cargo
                </label>
                <p className="text-amber-100">{usuario.cargo}</p>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-3">
            <button
              onClick={() => onDelete(usuario.id)}
              className="px-4 py-2 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/30 transition-colors duration-200"
            >
              Excluir
            </button>
            <button
              onClick={() => onEdit(usuario)}
              className="px-4 py-2 rounded-lg bg-amber-600 text-[#0E1A26] hover:bg-amber-700 transition-colors duration-200 font-medium"
            >
              Editar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 