"use client";
import { useState } from "react";
import { FaTimes, FaSave, FaCloudUploadAlt } from "react-icons/fa";
import Image from "next/image";
import CaveiraPeste from "../../../public/assets/CaveiraPeste.png";
import Logo from "../../../public/assets/Logo.png";

interface NovaEvidencia {
  tipo: "imagem" | "texto";
  descricao: string;
  coletadoPor: string;
  arquivo: File | null;
}

interface ModalNovaEvidenciaProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (evidencia: NovaEvidencia) => void;
}

export default function ModalNovaEvidencia({
  isOpen,
  onClose,
  onSave,
}: ModalNovaEvidenciaProps) {
  const [formData, setFormData] = useState<NovaEvidencia>({
    tipo: "imagem",
    descricao: "",
    coletadoPor: "",
    arquivo: null,
  });

  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, arquivo: file }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.tipo === "imagem" && !formData.arquivo) {
      setError("Por favor, selecione uma imagem");
      return;
    }

    if (formData.tipo === "texto" && !formData.descricao) {
      setError("Por favor, digite o conteúdo do texto");
      return;
    }

    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="relative bg-[#0E1A26] border border-amber-500/30 rounded-xl shadow-2xl w-full max-w-4xl animate-slideIn">
        <div className="absolute inset-0 pointer-events-none opacity-5 mix-blend-overlay">
          <Image
            src={CaveiraPeste}
            alt="Caveira decorativa"
            className="object-cover"
            fill
          />
        </div>

        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-8 animate-pulse">
                <Image
                  src={Logo}
                  alt="Logo"
                  className="object-contain"
                  fill
                />
              </div>
              <h2 className="text-xl font-bold text-amber-100 border-l-4 border-amber-600 pl-3">
                Nova Evidência
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-amber-100 hover:text-amber-500 transition-colors group"
            >
              <FaTimes className="h-6 w-6 group-hover:rotate-90 transition-transform" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-amber-500">
                  Tipo de Evidência
                </label>
                <select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  className="w-full px-4 py-2 text-sm border-2 border-amber-500/30 bg-[#0E1A26] text-amber-100 rounded-lg focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-600/30"
                  required
                >
                  <option value="imagem">Imagem</option>
                  <option value="texto">Texto</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-amber-500">
                  Coletado Por
                </label>
                <input
                  type="text"
                  name="coletadoPor"
                  value={formData.coletadoPor}
                  onChange={handleChange}
                  className="w-full px-4 py-2 text-sm border-2 border-amber-500/30 bg-[#0E1A26] text-amber-100 rounded-lg focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-600/30"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2 text-amber-500">
                Descrição
              </label>
              <textarea
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
                rows={3}
                className="w-full px-4 py-2 text-sm border-2 border-amber-500/30 bg-[#0E1A26] text-amber-100 rounded-lg focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-600/30"
                required
              />
            </div>

            {formData.tipo === "imagem" && (
              <div>
                <label className="block text-sm font-medium mb-2 text-amber-500">
                  Imagem
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-amber-500/30 border-dashed rounded-lg hover:border-amber-500 transition-colors">
                  <div className="space-y-1 text-center">
                    <FaCloudUploadAlt className="mx-auto h-12 w-12 text-amber-500" />
                    <div className="flex text-sm text-amber-100">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer rounded-md font-medium text-amber-500 hover:text-amber-400 focus-within:outline-none"
                      >
                        <span>Upload uma imagem</span>
                        <input
                          id="file-upload"
                          name="arquivo"
                          type="file"
                          className="sr-only"
                          onChange={handleFileChange}
                          accept="image/*"
                          required
                        />
                      </label>
                      <p className="pl-1">ou arraste e solte</p>
                    </div>
                    <p className="text-xs text-amber-500">
                      PNG, JPG, GIF até 10MB
                    </p>
                  </div>
                </div>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-lg bg-red-500/20 border border-red-500 text-red-400">
                {error}
              </div>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-[#1A3446] text-amber-100 hover:bg-[#23405a] transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition-colors duration-200"
              >
                Salvar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}