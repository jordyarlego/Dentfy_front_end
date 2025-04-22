"use client";
import { useState, useEffect } from "react";
import { FaTimes, FaSave, FaUpload, FaEye } from "react-icons/fa";
import Image from "next/image";
import CaveiraPeste from "../../../public/assets/CaveiraPeste.png";
import Logo from "../../../public/assets/Logo.png";
import EvidenciasSalvaSucess from "../EvidenciasSalvaSucess";
import { useRouter } from "next/navigation";

interface Caso {
  _id: string;
  evidencias: {
    _id: string;
    nome: string;
    tipo: string;
    dataAdicao: string;
  }[];
}

interface NovaEvidencia {
  descricao: string;
  data: string;
  tipo: string;
  coletadoPor: string;
  arquivo: File | null;
}

interface NovaEvidenciaErros {
  descricao?: string;
  data?: string;
  tipo?: string;
  coletadoPor?: string;
  arquivo?: string;
}

export default function ModalNovaEvidencia({
  isOpen,
  onClose,
  caso,
  onSave,
}: {
  isOpen: boolean;
  onClose: () => void;
  caso: Caso;
  onSave: (evidencia: NovaEvidencia) => void;
}) {
  const router = useRouter();
  const [formData, setFormData] = useState<NovaEvidencia>({
    descricao: "",
    data: "",
    tipo: "",
    coletadoPor: "",
    arquivo: null,
  });
  const [errors, setErrors] = useState<Partial<NovaEvidenciaErros>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        descricao: "",
        data: "",
        tipo: "",
        coletadoPor: "",
        arquivo: null,
      });
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors: Partial<NovaEvidenciaErros> = {};
    if (!formData.descricao.trim())
      newErrors.descricao = "Descrição obrigatória";
    if (!formData.data) newErrors.data = "Data obrigatória";
    if (!formData.tipo) newErrors.tipo = "Tipo obrigatório";
    if (!formData.coletadoPor.trim())
      newErrors.coletadoPor = "Coletor obrigatório";
    if (!formData.arquivo) newErrors.arquivo = "Arquivo obrigatório";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSave(formData);
      setShowSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, arquivo: file }));
  };

  const handleViewCases = () => {
    router.push(`/casos/${caso._id}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[200]">
      {showSuccess ? (
        <EvidenciasSalvaSucess
          onClose={() => {
            setShowSuccess(false);
            onClose();
          }}
        />
      ) : (
        <>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

          <div className="relative flex items-center justify-center h-full p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl w-full max-w-xl relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none opacity-5 mix-blend-overlay">
                <Image
                  src={CaveiraPeste}
                  alt="Caveira decorativa"
                  className="object-cover"
                  fill
                  priority
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
                        priority
                      />
                    </div>
                    <h2 className="text-xl font-bold text-gray-100 border-l-4 border-amber-600 pl-3">
                      Nova Evidência - Caso #{caso._id}
                    </h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-amber-500 transition-colors cursor-pointer group"
                  >
                    <FaTimes className="h-6 w-6 group-hover:rotate-90 transition-transform" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-amber-500">
                      Descrição
                    </label>
                    <textarea
                      value={formData.descricao}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          descricao: e.target.value,
                        }))
                      }
                      className={`w-full px-4 py-2 text-sm border-2 ${
                        errors.descricao ? "border-red-500" : "border-gray-700"
                      } bg-gray-700/50 text-gray-200 rounded-lg focus:outline-none focus:border-amber-600 hover:border-amber-500/50 transition-colors`}
                      rows={3}
                    />
                    {errors.descricao && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.descricao}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2 text-amber-500">
                        Data
                      </label>
                      <input
                        type="date"
                        value={formData.data}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            data: e.target.value,
                          }))
                        }
                        className={`w-full px-4 py-2 text-sm border-2 ${
                          errors.data ? "border-red-500" : "border-gray-700"
                        } bg-gray-700/50 text-gray-200 rounded-lg focus:outline-none focus:border-amber-600 hover:border-amber-500/50 transition-colors`}
                      />
                      {errors.data && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.data}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-2 text-amber-500">
                        Tipo
                      </label>
                      <select
                        value={formData.tipo}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            tipo: e.target.value,
                          }))
                        }
                        className={`w-full px-4 py-2 text-sm border-2 ${
                          errors.tipo ? "border-red-500" : "border-gray-700"
                        } bg-gray-700/50 text-gray-200 rounded-lg focus:outline-none focus:border-amber-600 hover:border-amber-500/50 transition-colors cursor-pointer`}
                      >
                        <option value="">Selecione o tipo</option>
                        <option value="foto">Foto</option>
                        <option value="documento">Documento</option>
                        <option value="video">Vídeo</option>
                      </select>
                      {errors.tipo && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.tipo}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-amber-500">
                      Coletado por
                    </label>
                    <input
                      type="text"
                      value={formData.coletadoPor}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          coletadoPor: e.target.value,
                        }))
                      }
                      className={`w-full px-4 py-2 text-sm border-2 ${
                        errors.coletadoPor
                          ? "border-red-500"
                          : "border-gray-700"
                      } bg-gray-700/50 text-gray-200 rounded-lg focus:outline-none focus:border-amber-600 hover:border-amber-500/50 transition-colors`}
                    />
                    {errors.coletadoPor && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.coletadoPor}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-amber-500">
                      Arquivo
                    </label>
                    <label
                      className={`w-full flex flex-col items-center p-6 rounded-lg border-2 border-dashed ${
                        errors.arquivo
                          ? "border-red-500 bg-red-500/10"
                          : "border-amber-600 bg-gray-700/50"
                      } cursor-pointer hover:border-amber-500 transition-colors relative`}
                    >
                      <FaUpload className="w-8 h-8 mb-2 text-amber-500" />
                      <span className="text-sm text-center">
                        {formData.arquivo ? (
                          <span className="text-gray-200">
                            {formData.arquivo.name}
                          </span>
                        ) : (
                          <>
                            <span className="text-amber-500">
                              Clique para enviar
                            </span>{" "}
                            <span className="text-gray-400">
                              ou arraste o arquivo
                            </span>
                          </>
                        )}
                      </span>
                      <input
                        type="file"
                        className="hidden"
                        onChange={handleFileChange}
                        accept="image/*,video/*,application/pdf"
                      />
                    </label>
                    {errors.arquivo && (
                      <p className="text-red-500 text-sm mt-1">
                        {errors.arquivo}
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between mt-6">
                    <button
                      type="button"
                      onClick={handleViewCases}
                      className="px-5 py-2.5 text-sm font-medium rounded-lg border-2 border-gray-700 bg-gray-700/50 text-gray-300 hover:border-blue-500 hover:bg-blue-500/20 hover:text-blue-400 transition-all cursor-pointer flex items-center gap-2"
                    >
                      <FaEye />
                      Visualizar Caso
                    </button>
                    
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-5 py-2.5 text-sm font-medium rounded-lg border-2 border-gray-700 bg-gray-700/50 text-gray-300 hover:border-red-500 hover:bg-red-500/20 hover:text-red-400 transition-all cursor-pointer"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-5 py-2.5 text-sm font-medium rounded-lg border-2 border-amber-600 bg-amber-900/30 text-amber-400 hover:bg-amber-900/50 disabled:opacity-50 transition-all flex items-center cursor-pointer"
                      >
                        <FaSave className="mr-2" />
                        {isSubmitting ? "Salvando..." : "Salvar Evidência"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}