"use client";
import { criarCaso, CasoData } from "../ModalNovoCasoPerito/API_NovoCaso";
import { useState, useEffect } from "react";
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
  onSubmit: (data: CasoData) => void;
  casoEditando?: CasoData;
};

export default function ModalNovoCasoPerito({
  isOpen,
  onClose,
  onSubmit,
  casoEditando,
}: ModalNovoCasoPeritoProps) {
  const [formData, setFormData] = useState<CasoData>({
    titulo: "",
    descricao: "",
    responsavel: "",
    status: "Em andamento",
    tipo: "Vitima",
    dataAbertura: new Date().toISOString().split('T')[0],
    sexo: "Masculino",
    local: "",
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (casoEditando) {
      setFormData({
        titulo: casoEditando.titulo,
        descricao: casoEditando.descricao,
        responsavel: casoEditando.responsavel,
        status: casoEditando.status,
        tipo: casoEditando.tipo,
        dataAbertura: casoEditando.dataAbertura,
        sexo: casoEditando.sexo,
        local: casoEditando.local,
      });
    } else {
      setFormData({
        titulo: "",
        descricao: "",
        responsavel: "",
        status: "Em andamento",
        tipo: "Vitima",
        dataAbertura: new Date().toISOString().split('T')[0],
        sexo: "Masculino",
        local: "",
      });
    }
  }, [casoEditando]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validações
    if (!formData.titulo.trim()) {
      setError("O título é obrigatório");
      return;
    }

    if (!formData.descricao.trim()) {
      setError("A descrição é obrigatória");
      return;
    }

    if (!formData.responsavel.trim()) {
      setError("O responsável é obrigatório");
      return;
    }

    if (!formData.local.trim()) {
      setError("O local é obrigatório");
      return;
    }

    try {
      const casoCriado = await criarCaso(formData);
      onSubmit(casoCriado);
      onClose();

      // Reseta o formulário
      setFormData({
        titulo: "",
        descricao: "",
        responsavel: "",
        status: "Em andamento",
        tipo: "Vitima",
        dataAbertura: new Date().toISOString().split('T')[0],
        sexo: "Masculino",
        local: "",
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
        <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 animate-fadeIn">
          <div className="relative bg-[#0E1A26] border border-amber-500/30 rounded-xl shadow-2xl w-full max-w-6xl animate-slideIn">
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
                    {casoEditando ? "Editar Caso" : "Novo Caso"}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="text-amber-100 hover:text-amber-500 transition-colors group"
                >
                  <FaTimes className="h-6 w-6 group-hover:rotate-90 transition-transform" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-amber-500">
                      Título
                    </label>
                    <input
                      type="text"
                      name="titulo"
                      value={formData.titulo}
                      onChange={handleChange}
                      className="w-full px-4 py-2 text-sm border-2 border-amber-500/30 bg-[#0E1A26] text-amber-100 rounded-lg focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-600/30"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-amber-500">
                      <FaCalendarAlt className="inline mr-2" />
                      Data de Abertura
                    </label>
                    <input
                      type="date"
                      name="dataAbertura"
                      value={formData.dataAbertura}
                      onChange={handleChange}
                      className="w-full px-4 py-2 text-sm border-2 border-amber-500/30 bg-[#0E1A26] text-amber-100 rounded-lg focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-600/30"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-amber-500">
                      Sexo
                    </label>
                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, sexo: "Feminino" })}
                        className={`flex-1 flex items-center justify-center p-3 rounded-lg border-2 text-sm transition-all ${
                          formData.sexo === "Feminino"
                            ? "border-pink-500 bg-pink-500/20 text-pink-400"
                            : "border-gray-700 bg-gray-700/50 text-gray-300 hover:border-pink-500 hover:text-pink-400"
                        }`}
                      >
                        <FaVenus className="mr-2" />
                        Feminino
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, sexo: "Masculino" })}
                        className={`flex-1 flex items-center justify-center p-3 rounded-lg border-2 text-sm transition-all ${
                          formData.sexo === "Masculino"
                            ? "border-blue-500 bg-blue-500/20 text-blue-400"
                            : "border-gray-700 bg-gray-700/50 text-gray-300 hover:border-blue-500 hover:text-blue-400"
                        }`}
                      >
                        <FaMars className="mr-2" />
                        Masculino
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2 text-amber-500">
                      <FaMapMarkerAlt className="inline mr-2" />
                      Local
                    </label>
                    <input
                      type="text"
                      name="local"
                      value={formData.local}
                      onChange={handleChange}
                      className="w-full px-4 py-2 text-sm border-2 border-amber-500/30 bg-[#0E1A26] text-amber-100 rounded-lg focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-600/30"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-amber-500">
                      Responsável
                    </label>
                    <input
                      type="text"
                      name="responsavel"
                      value={formData.responsavel}
                      onChange={handleChange}
                      className="w-full px-4 py-2 text-sm border-2 border-amber-500/30 bg-[#0E1A26] text-amber-100 rounded-lg focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-600/30"
                      required
                    />
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

                  <div>
                    <label className="block text-sm font-medium mb-2 text-amber-500">
                      Tipo do Caso
                    </label>
                    <select
                      name="tipo"
                      value={formData.tipo}
                      onChange={handleChange}
                      className="w-full px-4 py-2 text-sm border-2 border-amber-500/30 bg-[#0E1A26] text-amber-100 rounded-lg focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-600/30"
                      required
                    >
                      <option value="Vitima">Vítima</option>
                      <option value="Desaparecido">Desaparecido</option>
                      <option value="Outro">Outro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2 text-amber-500">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-4 py-2 text-sm border-2 border-amber-500/30 bg-[#0E1A26] text-amber-100 rounded-lg focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-600/30"
                      required
                    >
                      <option value="Em andamento">Em andamento</option>
                      <option value="Finalizado">Finalizado</option>
                      <option value="Arquivado">Arquivado</option>
                    </select>
                  </div>
                </div>

                {error && (
                  <div className="col-span-2">
                    <p className="text-red-500 text-sm">{error}</p>
                  </div>
                )}

                <div className="col-span-2 flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2 text-sm text-amber-100 hover:text-amber-500 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors flex items-center gap-2"
                  >
                    <FaSave />
                    {casoEditando ? "Salvar Alterações" : "Salvar Caso"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
