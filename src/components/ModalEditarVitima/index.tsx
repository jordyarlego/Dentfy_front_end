"use client";

import { useState, useEffect } from 'react';
import { FaTimes } from 'react-icons/fa';

interface VitimaData {
  id: string;
  nomeCompleto: string;
  dataNascimento: string;
  sexo: string;
  endereco: string;
  etnia: string;
  cpf: string;
  nic: string;
}

interface ModalEditarVitimaProps {
  isOpen: boolean;
  onClose: () => void;
  victim: VitimaData | null;
  onSave: (updatedVictim: VitimaData) => void;
}

export default function ModalEditarVitima({
  isOpen,
  onClose,
  victim,
  onSave,
}: ModalEditarVitimaProps) {
  const [formData, setFormData] = useState<VitimaData | null>(null);

  useEffect(() => {
    if (victim) {
      setFormData(victim);
    }
  }, [victim]);

  if (!isOpen || !formData) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
     if (name === 'cpf' || name === 'nic') {
      // Permitir apenas números
      const numericValue = value.replace(/[^0-9]/g, '');
      setFormData(prevData => (prevData ? { ...prevData, [name]: numericValue } : null));
    } else {
      setFormData(prevData => (prevData ? { ...prevData, [name]: value } : null));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      // Add more specific validation if needed before saving
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-[#0E1A26] border border-amber-500/30 rounded-xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-amber-500">Editar Vítima</h2>
          <button
            onClick={onClose}
            className="text-amber-100 hover:text-amber-500 transition-all duration-300 hover:rotate-90 cursor-pointer"
          >
            <FaTimes className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} id="edit-victim-form" className="p-6 space-y-4 overflow-y-auto custom-scrollbar grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-4">
          {/* Fields */}
          <div>
            <label className="block text-sm font-medium text-amber-500">Nome Completo *</label>
            <input type="text" name="nomeCompleto" value={formData.nomeCompleto} onChange={handleChange} className="w-full px-4 py-2 bg-gray-800/30 border border-gray-700 rounded-lg text-gray-100 focus:border-amber-500 focus:ring-1 focus:ring-amber-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-amber-500">Data de Nascimento *</label>
            <input type="date" name="dataNascimento" value={formData.dataNascimento} onChange={handleChange} className="w-full px-4 py-2 bg-gray-800/30 border border-gray-700 rounded-lg text-gray-100 focus:border-amber-500 focus:ring-1 focus:ring-amber-500" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-amber-500">Sexo *</label>
            {/* Dropdown de Sexo */}
            <select name="sexo" value={formData.sexo} onChange={handleChange} className="w-full px-4 py-2 bg-gray-800/30 border border-gray-700 rounded-lg text-gray-100 focus:border-amber-500 focus:ring-1 focus:ring-amber-500" required>
              <option value="Masculino">Masculino</option>
              <option value="Feminino">Feminino</option>
              <option value="Outro">Outro</option>
            </select>
          </div>
           <div>
            <label className="block text-sm font-medium text-amber-500">Etnia</label>
            {/* Dropdown de Etnia */}
            <select name="etnia" value={formData.etnia} onChange={handleChange} className="w-full px-4 py-2 bg-gray-800/30 border border-gray-700 rounded-lg text-gray-100 focus:border-amber-500 focus:ring-1 focus:ring-amber-500">
               <option value="">Selecione</option>
               <option value="Branca">Branca</option>
               <option value="Preta">Preta</option>
               <option value="Parda">Parda</option>
               <option value="Amarela">Amarela</option>
               <option value="Indígena">Indígena</option>
               <option value="Não declarado">Não declarado</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-amber-500">Endereço</label>
            <input type="text" name="endereco" value={formData.endereco} onChange={handleChange} className="w-full px-4 py-2 bg-gray-800/30 border border-gray-700 rounded-lg text-gray-100 focus:border-amber-500 focus:ring-1 focus:ring-amber-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-amber-500">CPF</label>
            {/* CPF - Validação numérica e max 11 */}
            <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} maxLength={11} pattern="[0-9]*" title="Apenas números" className="w-full px-4 py-2 bg-gray-800/30 border border-gray-700 rounded-lg text-gray-100 focus:border-amber-500 focus:ring-1 focus:ring-amber-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-amber-500">NIC</label>
             {/* NIC - Validação numérica e max 11 */}
            <input type="text" name="nic" value={formData.nic} onChange={handleChange} maxLength={11} pattern="[0-9]*" title="Apenas números" className="w-full px-4 py-2 bg-gray-800/30 border border-gray-700 rounded-lg text-gray-100 focus:border-amber-500 focus:ring-1 focus:ring-amber-500" />
          </div>
        </form>
         <div className="flex justify-end p-6 pt-4 border-t border-gray-700">
            <button
              type="submit"
              className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all duration-300 font-semibold cursor-pointer"
              form="edit-victim-form"
            >
              Salvar Edição
            </button>
          </div>
      </div>
      {/* Custom Scrollbar Style */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(31, 41, 55, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(251, 191, 36, 0.5);
          border-radius: 4px;
          transition: all 0.3s;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(251, 191, 36, 0.7);
        }
      `}</style>
    </div>
  );
} 