import { useState } from "react";
import { FaTimes, FaSave, FaArrowLeft } from "react-icons/fa";
import Image from "next/image";
import CaveiraPeste from "../../../public/assets/CaveiraPeste.png";
import Logo from "../../../public/assets/Logo.png";

interface NovaVitima {
  nomeCompleto: string;
  dataNascimento: string;
  sexo: "Masculino" | "Feminino" | "Outro";
  endereco: string;
  etnia: "Preto" | "Pardo" | "Branco" | "Amarelo" | "Indígena";
  cpf: string;
  nic: string;
}

interface ModalNovaVitimaProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (vitima: NovaVitima) => void;
}

const etnias = ["Preto", "Pardo", "Branco", "Amarelo", "Indígena"];
const sexos = ["Masculino", "Feminino", "Outro"];

export default function ModalNovaVitima({ isOpen, onClose, onSave }: ModalNovaVitimaProps) {
  const [formData, setFormData] = useState<NovaVitima>({
    nomeCompleto: "",
    dataNascimento: "",
    sexo: "Masculino",
    endereco: "",
    etnia: "Preto",
    cpf: "",
    nic: ""
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === "cpf" || name === "nic") {
      // Permitir apenas números e até 11 dígitos
      if (!/^\d{0,11}$/.test(value)) return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validação simples
    if (
      !formData.nomeCompleto ||
      !formData.dataNascimento ||
      !formData.sexo ||
      !formData.endereco ||
      !formData.etnia ||
      !formData.cpf ||
      !formData.nic
    ) {
      setError("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    if (formData.cpf.length !== 11 || formData.nic.length !== 11) {
      setError("CPF e NIC devem ter 11 dígitos.");
      return;
    }

    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-md bg-gray-900/50">
      <div className="bg-[#0E1A26]/95 w-[95%] max-w-3xl rounded-2xl shadow-2xl border border-gray-700 overflow-hidden animate-modalEntry">
        <div className="relative p-6 border-b border-gray-700 bg-gradient-to-r from-[#0E1A26] via-[#152736] to-[#0E1A26]">
          <div className="absolute left-4 top-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-amber-500 transition-all duration-300 hover:scale-110 cursor-pointer"
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
              Nova Vítima
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
            className="absolute right-4 top-4 text-gray-400 hover:text-amber-500 transition-all duration-300 hover:scale-110 hover:rotate-90 transform cursor-pointer"
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-amber-500">Nome Completo *</label>
              <input
                type="text"
                name="nomeCompleto"
                value={formData.nomeCompleto}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800/30 border border-gray-700 rounded-lg text-gray-100 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                placeholder="Nome completo"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-amber-500">Data de Nascimento *</label>
              <input
                type="date"
                name="dataNascimento"
                value={formData.dataNascimento}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800/30 border border-gray-700 rounded-lg text-gray-100 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-amber-500">Sexo *</label>
              <select
                name="sexo"
                value={formData.sexo}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800/30 border border-gray-700 rounded-lg text-gray-100 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 appearance-none cursor-pointer"
                required
              >
                {sexos.map((sexo) => (
                  <option key={sexo} value={sexo}>{sexo}</option>
                ))}
              </select>
            </div>
            <div className="col-span-1 sm:col-span-2 md:col-span-3">
              <label className="block text-sm font-medium text-amber-500">Endereço *</label>
              <input
                type="text"
                name="endereco"
                value={formData.endereco}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800/30 border border-gray-700 rounded-lg text-gray-100 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                placeholder="Endereço"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-amber-500">Etnia *</label>
              <select
                name="etnia"
                value={formData.etnia}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-gray-800/30 border border-gray-700 rounded-lg text-gray-100 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 appearance-none cursor-pointer"
                required
              >
                {etnias.map((etnia) => (
                  <option key={etnia} value={etnia}>{etnia}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-amber-500">CPF *</label>
              <input
                type="text"
                name="cpf"
                value={formData.cpf}
                onChange={handleChange}
                maxLength={11}
                pattern="\d{11}"
                className="w-full px-4 py-2 bg-gray-800/30 border border-gray-700 rounded-lg text-gray-100 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                placeholder="Somente números"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-amber-500">NIC *</label>
              <input
                type="text"
                name="nic"
                value={formData.nic}
                onChange={handleChange}
                maxLength={11}
                pattern="\d{11}"
                className="w-full px-4 py-2 bg-gray-800/30 border border-gray-700 rounded-lg text-gray-100 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                placeholder="Somente números"
                required
              />
            </div>
          </div>
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          <div className="flex justify-end mt-4">
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg hover:from-amber-600 hover:to-amber-700 transition-all duration-300 group cursor-pointer"
            >
              Salvar
              <FaSave className="text-md group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 