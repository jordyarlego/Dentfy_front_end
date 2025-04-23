"use client";
import { useState, useEffect } from "react";
import SuccessModal from "../SuccessModal";
import { FaSave, FaTimes } from "react-icons/fa";
import Image from "next/image";
import Logo from "../../../public/assets/Logo.png";
import CaveiraPeste from "../../../public/assets/CaveiraPeste.png";
import { PostUsuario, PutUsuario } from "../../../services/api_users";

interface FormUsuario {
  _id?: string;
  name: string;
  email: string;
  password: string;
  confirmarSenha: string;
  cpf: string;
  role: "perito" | "assistente";
}

interface RegistroProps {
  onClose: () => void;
  onSave: (usuario: FormUsuario) => void;
  usuarioEditando?: {
    _id: string;
    name: string;
    email: string;
    password: string;
    cpf: string;
    role: "perito" | "assistente";
  } | null;
}

const INITIAL_FORM: FormUsuario = {
  name: "",
  email: "",
  password: "",
  confirmarSenha: "",
  cpf: "",
  role: "perito",
};

export default function ComponentRegistro({ onClose, onSave, usuarioEditando }: RegistroProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormUsuario>({ ...INITIAL_FORM });

  useEffect(() => {
    if (usuarioEditando) {
      setFormData({
        _id: usuarioEditando._id,
        name: usuarioEditando.name,
        email: usuarioEditando.email,
        password: usuarioEditando.password,
        confirmarSenha: usuarioEditando.password,
        cpf: usuarioEditando.cpf,
        role: usuarioEditando.role,
      });
    } else if (!showSuccess) {
      setFormData({ ...INITIAL_FORM });
    }
  }, [usuarioEditando, showSuccess]);

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateCPF = (cpf: string) => {
    const cpfLimpo = cpf.replace(/\D/g, "");
    return cpfLimpo.length === 11;
  };

  const validateSenha = (password: string) => password.length >= 6;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "cpf") {
      const cpfLimpo = value.replace(/\D/g, "");
      if (cpfLimpo.length <= 11) setFormData(prev => ({ ...prev, [name]: cpfLimpo }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateEmail(formData.email)) {
      setError("Por favor, insira um email válido."); return;
    }
    if (!validateCPF(formData.cpf)) {
      setError("CPF deve conter 11 dígitos numéricos."); return;
    }
    if (!usuarioEditando) {
      if (!validateSenha(formData.password)) {
        setError("A senha deve ter no mínimo 6 caracteres."); return;
      }
      if (formData.password !== formData.confirmarSenha) {
        setError("As senhas não coincidem."); return;
      }
      
    }

    try {
      if (usuarioEditando) {
        await PutUsuario(usuarioEditando._id, {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          confirmarSenha: formData.confirmarSenha,
          cpf: formData.cpf,
          role: formData.role,
        });
      } else {
        await PostUsuario(formData);
      }
      onSave(formData);
      setShowSuccess(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro inesperado ao salvar usuário.";
      console.error("Erro ao salvar usuário:", message);
      setError(message);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccess(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[250] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="relative bg-[#0E1A26] border-2 border-amber-500/30 rounded-xl shadow-2xl w-full max-w-4xl p-8 animate-slideIn">
        <div className="absolute inset-0 opacity-5 mix-blend-overlay">
          <Image src={CaveiraPeste} alt="Caveira decorativa" className="object-cover" fill />
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <div className="relative w-16 h-8 animate-pulse">
                <Image src={Logo} alt="Logo" className="object-contain" fill />
              </div>
              <h2 className="text-2xl font-bold text-amber-100 border-l-4 border-amber-600 pl-3">
                {usuarioEditando ? "Editar Usuário" : "Registro de Usuário"}
              </h2>
            </div>
            <button onClick={onClose} className="text-amber-100 hover:text-amber-500 transition-colors group">
              <FaTimes className="h-6 w-6 group-hover:rotate-90 transition-transform" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-amber-500">Nome</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 text-sm border-2 border-amber-500/30 bg-[#0E1A26] text-amber-100 rounded-lg focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-600/30" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-amber-500">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 text-sm border-2 border-amber-500/30 bg-[#0E1A26] text-amber-100 rounded-lg focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-600/30" required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-amber-500">CPF</label>
                <input type="text" name="cpf" value={formData.cpf} onChange={handleChange} maxLength={11} placeholder="Apenas números" className="w-full px-4 py-2 text-sm border-2 border-amber-500/30 bg-[#0E1A26] text-amber-100 rounded-lg focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-600/30" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-amber-500">Cargo</label>
                <select name="role" value={formData.role} onChange={handleChange} className="w-full px-4 py-2 text-sm border-2 border-amber-500/30 bg-[#0E1A26] text-amber-100 rounded-lg focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-600/30" required>
                  <option value="perito">Perito</option>
                  <option value="assistente">Assistente</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-amber-500">Senha</label>
                <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-4 py-2 text-sm border-2 border-amber-500/30 bg-[#0E1A26] text-amber-100 rounded-lg focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-600/30" required />
                {!usuarioEditando && <p className="mt-1 text-xs text-amber-500/70">A senha deve ter no mínimo 6 caracteres.</p>}
              </div>
              <div>
                <label className="block text-sm font-medium mb-2 text-amber-500">Confirmar Senha</label>
                <input type="password" name="confirmarSenha" value={formData.confirmarSenha} onChange={handleChange} className="w-full px-4 py-2 text-sm border-2 border-amber-500/30 bg-[#0E1A26] text-amber-100 rounded-lg focus:outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-600/30" required />
              </div>
            </div>

            {error && <div className="p-3 rounded-lg bg-red-500/20 border border-red-500 text-red-400">{error}</div>}

            <div className="flex justify-end gap-3">
              <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-[#1A3446] text-amber-100 hover:bg-[#23405a] transition-colors duration-200">Cancelar</button>
              <button type="submit" className="px-4 py-2 rounded-lg bg-amber-600 text-[#0E1A26] hover:bg-amber-700 transition-colors duration-200 flex items-center gap-2"><FaSave />{usuarioEditando ? "Salvar Alterações" : "Registrar"}</button>
            </div>
          </form>
        </div>
      </div>

      <SuccessModal
        isOpen={showSuccess}
        onClose={handleSuccessClose}
        title={usuarioEditando ? "Usuário Atualizado com Sucesso!" : "Usuário Registrado com Sucesso!"}
        message={usuarioEditando ? "O usuário foi atualizado no sistema." : "O usuário foi cadastrado no sistema."}
      />
    </div>
  );
}
