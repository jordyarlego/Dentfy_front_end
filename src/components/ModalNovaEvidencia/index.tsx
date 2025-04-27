import { useState, useEffect } from "react";
import { FaTimes, FaCloudUploadAlt, FaSave, FaArrowLeft } from "react-icons/fa";
import Image from "next/image";
import CaveiraPeste from "../../../public/assets/CaveiraPeste.png";
import Logo from "../../../public/assets/Logo.png";

interface NovaEvidencia {
  tipo: string;
  titulo: string;
  descricao: string;
  coletadoPor: string;
  dataColeta: string;
  local: string;
  arquivo: File | null;
  responsavel: string; // Adicionado o campo responsavel
}

interface ModalNovaEvidenciaProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (evidencia: NovaEvidencia) => void;
  casoId: string;
  usuarioId: string; // Novo campo para capturar o id do usuário logado
}

export default function ModalNovaEvidencia({
  isOpen,
  onClose,
  onSave,
  casoId,
  usuarioId
}: ModalNovaEvidenciaProps) {
  const [formData, setFormData] = useState<NovaEvidencia>({
    tipo: "",
    titulo: "",
    descricao: "",
    coletadoPor: "",
    dataColeta: new Date().toISOString().split('T')[0],
    local: "",
    arquivo: null,
    responsavel: usuarioId // Usando o id do usuário logado
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setError("Arquivo muito grande. Máximo 10MB");
        return;
      }
      setFormData(prev => ({ ...prev, arquivo: file }));
      setError(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.titulo || !formData.tipo || !formData.coletadoPor || !formData.dataColeta) {
      setError("Por favor, preencha todos os campos obrigatórios");
      return;
    }

    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-gray-900/50">
      <div className="bg-[#0E1A26]/95 w-[95%] max-w-[1200px] rounded-2xl shadow-2xl border border-gray-700 overflow-hidden animate-modalEntry">
        <div className="relative p-6 border-b border-gray-700 bg-gradient-to-r from-[#0E1A26] via-[#152736] to-[#0E1A26]">
          <div className="absolute left-4 top-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-amber-500 transition-all duration-300 hover:scale-110"
            >
              <FaArrowLeft className="h-6 w-6" />
            </button>
          </div>
          
          <div className="flex justify-center items-center gap-4">
            <div className="relative group animate-glow">
              <Image
                src={CaveiraPeste}
                alt="Logo Caveira"
                width={40}
                height={40}
                className="animate-float transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute -inset-2 bg-amber-500/20 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 text-transparent bg-clip-text animate-shimmer">
              Nova Evidência
            </h2>
            
            <div className="relative group animate-glow">
              <Image
                src={Logo}
                alt="Logo Dentfy"
                width={40}
                height={40}
                className="opacity-75 transition-all duration-300 group-hover:opacity-100 group-hover:scale-110"
              />
              <div className="absolute -inset-2 bg-amber-500/20 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-gray-400 hover:text-amber-500 transition-all duration-300 hover:scale-110 hover:rotate-90 transform"
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex gap-6">
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-amber-500">
                    Título <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-800/30 border border-gray-700 rounded-lg text-gray-100 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    placeholder="Título da evidência"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-amber-500">
                    Tipo <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="tipo"
                    value={formData.tipo}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-800/30 border border-gray-700 rounded-lg text-gray-100 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    placeholder="Tipo de evidência"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-amber-500">
                    Coletado Por <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="coletadoPor"
                    value={formData.coletadoPor}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-800/30 border border-gray-700 rounded-lg text-gray-100 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    placeholder="Nome do responsável"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium text-amber-500">
                    Data da Coleta <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="dataColeta"
                    value={formData.dataColeta}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-800/30 border border-gray-700 rounded-lg text-gray-100 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <label className="block text-sm font-medium text-amber-500">
                    Local
                  </label>
                  <input
                    type="text"
                    name="local"
                    value={formData.local}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-gray-800/30 border border-gray-700 rounded-lg text-gray-100 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    placeholder="Local da coleta"
                  />
                </div>

                <div className="space-y-2 col-span-2">
                  <label className="block text-sm font-medium text-amber-500">
                    Descrição <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-2 bg-gray-800/30 border border-gray-700 rounded-lg text-gray-100 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 resize-none"
                    placeholder="Descrição detalhada da evidência"
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col">
              <div className="flex-grow">
                <label className="block text-sm font-medium text-amber-500 mb-2">
                  Arquivo
                </label>
                <div className="h-full flex flex-col justify-center">
                  <div className="mt-1 flex flex-col justify-center px-6 pt-5 pb-6 border-2 border-gray-700 border-dashed rounded-lg hover:border-amber-500 transition-all duration-300 bg-gray-800/30 min-h-[300px]">
                    <div className="space-y-4 text-center">
                      <FaCloudUploadAlt className="mx-auto h-16 w-16 text-amber-500" />
                      <div className="flex flex-col space-y-2">
                        <label className="relative cursor-pointer rounded-md font-medium text-amber-500 hover:text-amber-400 focus-within:outline-none">
                          <span className="text-lg">Upload um arquivo</span>
                          <input
                            type="file"
                            name="arquivo"
                            onChange={handleFileChange}
                            className="sr-only"
                          />
                        </label>
                        <p className="text-gray-400">ou arraste e solte</p>
                        <p className="text-sm text-gray-400">
                          PNG, JPG, GIF até 10MB
                        </p>
                      </div>
                      {formData.arquivo && (
                        <div className="mt-4 p-4 bg-gray-800/50 rounded-lg">
                          <p className="text-amber-500">Arquivo selecionado:</p>
                          <p className="text-gray-300">{formData.arquivo.name}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-400">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-all duration-300"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all duration-300 group"
            >
              <FaSave className="group-hover:scale-110 transition-transform" />
              Salvar
            </button>
          </div>
        </form>
      </div>

      <style jsx global>{`
        @keyframes modalEntry {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        @keyframes glow {
          0%, 100% {
            filter: brightness(1) drop-shadow(0 0 8px rgba(251, 191, 36, 0.3));
          }
          50% {
            filter: brightness(1.2) drop-shadow(0 0 12px rgba(251, 191, 36, 0.5));
          }
        }

        .animate-modalEntry {
          animation: modalEntry 0.3s ease-out forwards;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-shimmer {
          animation: shimmer 3s linear infinite;
          background-size: 200% auto;
        }

        .animate-glow {
          animation: glow 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}