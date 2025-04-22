"use client";
import { criarCaso } from "../ModalNovoCasoPerito/API_NovoCaso";
import { useState } from "react";
import {
  FaVenus,
  FaMars,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaSave,
  FaTimes,
} from "react-icons/fa";
import Image from "next/image";
import CaveiraPeste from "../../../public/assets/CaveiraPeste.png";
import Logo from "../../../public/assets/Logo.png";

type ModalNovoCasoPeritoProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FormData) => void;
};

interface FormData {
  titulo: string;
  data: string;
  sexo: string;
  local: string;
  descricao: string;
  status: string;
}

export default function ModalNovoCasoPerito({
  isOpen,
  onClose,
  onSubmit,
}: ModalNovoCasoPeritoProps) {
  const [formData, setFormData] = useState<FormData>({
    titulo: "",
    data: "",
    sexo: "",
    local: "",
    descricao: "",
    status: "",
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Limpa erros anteriores

    try {
      await criarCaso(formData); // Envia os dados pro backend
      onSubmit(formData); // Caso queira notificar o componente pai
      onClose(); // Fecha o modal

      // Reseta o formulário
      setFormData({
        titulo: "",
        data: "",
        sexo: "",
        local: "",
        descricao: "",
        status: "",
      });
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Erro ao criar caso:", err.message);
        setError(err.message);
      } else {
        console.error("Erro desconhecido ao criar caso:", err);
        setError("Erro inesperado ao criar caso.");
      }
    }
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-[100]">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-x" />

          <div className="relative flex items-center justify-center h-full p-4">
            <div className="bg-gray-800 border border-gray-700 rounded-lg shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto relative">
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
                    <h2 className="text-xl font-bold text-gray-100 border-l-4 border-amber-600 pl-3">
                      Novo Caso de Perito
                    </h2>
                  </div>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-amber-500 transition-colors cursor-pointer group"
                  >
                    <FaTimes className="h-6 w-6 group-hover:rotate-90 transition-transform" />
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label
                      className="block text-sm font-medium mb-2 text-amber-500"
                      htmlFor="titulo"
                    >
                      Título
                    </label>
                    <input
                      type="text"
                      id="titulo"
                      name="titulo"
                      value={formData.titulo}
                      onChange={handleChange}
                      className="w-full px-4 py-2 text-sm border-2 border-gray-700 bg-gray-700/50 text-gray-200 rounded-lg focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-600/30"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      className="block text-sm font-medium mb-2 text-amber-500"
                      htmlFor="data"
                    >
                      <FaCalendarAlt className="inline mr-2" />
                      Data
                    </label>
                    <input
                      type="date"
                      id="data"
                      name="data"
                      value={formData.data}
                      onChange={handleChange}
                      className="w-full px-4 py-2 text-sm border-2 border-gray-700 bg-gray-700/50 text-gray-200 rounded-lg focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-600/30"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2 text-amber-500">
                      Sexo
                    </label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, sexo: "Feminino" })
                        }
                        className={`flex-1 flex items-center justify-center p-3 rounded-lg border-2 text-sm transition-all ${
                          formData.sexo === "Feminino"
                            ? "border-pink-500 bg-pink-500/20 text-pink-400"
                            : "border-gray-700 bg-gray-700/50 text-gray-300 hover:border-pink-500 hover:text-pink-400"
                        } hover:scale-[1.02] cursor-pointer`}
                      >
                        <FaVenus className="mr-2" />
                        Feminino
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, sexo: "Masculino" })
                        }
                        className={`flex-1 flex items-center justify-center p-3 rounded-lg border-2 text-sm transition-all ${
                          formData.sexo === "Masculino"
                            ? "border-blue-500 bg-blue-500/20 text-blue-400"
                            : "border-gray-700 bg-gray-700/50 text-gray-300 hover:border-blue-500 hover:text-blue-400"
                        } hover:scale-[1.02] cursor-pointer`}
                      >
                        <FaMars className="mr-2" />
                        Masculino
                      </button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label
                      className="block text-sm font-medium mb-2 text-amber-500"
                      htmlFor="local"
                    >
                      <FaMapMarkerAlt className="inline mr-2" />
                      Local
                    </label>
                    <input
                      type="text"
                      id="local"
                      name="local"
                      value={formData.local}
                      onChange={handleChange}
                      className="w-full px-4 py-2 text-sm border-2 border-gray-700 bg-gray-700/50 text-gray-200 rounded-lg focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-600/30"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2 text-amber-500">
                      Status
                    </label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setFormData({ ...formData, status: "Em andamento" })
                        }
                        className={`flex-1 flex items-center justify-center p-3 rounded-lg border-2 text-sm transition-all
        ${
          formData.status === "Em andamento"
            ? "border-amber-400 bg-amber-400/20 text-amber-300"
            : "border-gray-700 bg-gray-700/50 text-gray-300 hover:border-amber-400 hover:text-amber-300"
        }
        hover:scale-[1.02] cursor-pointer`}
                      >
                        <span className="mr-2">⏳</span>
                        Em andamento
                      </button>
                    </div>
                  </div>

                  <div className="mb-6">
                    <label
                      className="block text-sm font-medium mb-2 text-amber-500"
                      htmlFor="descricao"
                    >
                      Descrição
                    </label>
                    <textarea
                      id="descricao"
                      name="descricao"
                      value={formData.descricao}
                      onChange={handleChange}
                      rows={3}
                      className="w-full px-4 py-2 text-sm border-2 border-gray-700 bg-gray-700/50 text-gray-200 rounded-lg focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-600/30"
                      required
                    ></textarea>
                  </div>

                  {error && (
                    <div className="mb-4 p-3 rounded-lg bg-red-500/20 border border-red-500 text-red-400">
                      {error}
                    </div>
                  )}

                  <div className="flex justify-end gap-3">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-5 py-2.5 text-sm font-medium rounded-lg border-2 border-gray-700 bg-gray-700/50 text-gray-300 hover:border-red-500 hover:bg-red-500/20 hover:text-red-400 transition-all cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 text-sm font-medium rounded-lg border-2 border-amber-600 bg-amber-900/30 text-amber-400 hover:bg-amber-900/50 hover:scale-[1.02] transition-all cursor-pointer flex items-center"
                    >
                      <FaSave className="mr-2" />
                      Salvar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
