"use client";

import { useState } from "react";
import InputTeste from "../../components/ComponentInput";
import HeroLogin from "../../components/HeroLogin";

import { useRouter } from "next/navigation";
import api from "../../../lib/axios";
import { AxiosError } from "axios";

export default function Login() {
  const router = useRouter();
  const [cpf, setCpf] = useState("");
  const [password, setPassword] = useState("");
  const [cpfError, setCpfError] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateCpf = (cpf: string) => {
    const cleanedCpf = cpf.replace(/[^\d]+/g, "");
    if (cleanedCpf.length !== 11) {
      return "CPF deve conter 11 dígitos";
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setCpfError("");
    setLoading(true);

    const cpfValidationError = validateCpf(cpf);
    if (cpfValidationError) {
      setCpfError(cpfValidationError);
      setLoading(false);
      return;
    }

    const cleanedCpf = cpf.replace(/[^\d]+/g, "");

    try {
      const response = await api.post("/api/users/login", {
        cpf: cleanedCpf,
        password,
      });

      console.log("Resposta da API:", response.data);

      if (!response.data.token) {
        throw new Error("Token não encontrado na resposta");
      }

      const { token, user } = response.data;
      console.log("Dados do usuário:", user);

      localStorage.setItem("token", token);
      localStorage.setItem("@dentfy:usuario", JSON.stringify({
        nome: user.name,
        cargo: user.role === "admin" ? "Administrador" : 
               user.role === "perito" ? "Perito Criminal" : "Assistente"
      }));

      console.log("Dados salvos no localStorage:", {
        token,
        usuario: {
          nome: user.name,
          cargo: user.role === "admin" ? "Administrador" : 
                 user.role === "perito" ? "Perito Criminal" : "Assistente"
        }
      });

      router.push("/CasosPerito");
    } catch (err) {
      const axiosError = err as AxiosError<{ message?: string }>;
      console.error("Erro na requisição de login:", axiosError);
      setError(
        axiosError.response?.data?.message ||
          "Erro ao fazer login. Tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#12212B] p-4">
      <div className="w-full lg:w-[35%] flex items-center justify-center p-4 lg:p-8">
        <div className="bg-[#12212B] p-6 lg:p-8 rounded-2xl shadow-md w-full max-w-md">
          <div className="flex flex-col items-center mb-6 lg:mb-8">
            <h1 className="text-white font-bold text-4xl lg:text-5xl mb-2 tracking-tighter transform hover:scale-105 transition duration-300">
              Dent<span className="text-amber-500">ify</span>
            </h1>
            <p className="text-cyan-100 text-center mb-4 text-sm lg:text-base max-w-md">
              Bem-vindo à plataforma de registros periciais odonto-legais!
              Gerencie e consulte casos de forma segura e prática.
            </p>
            <div className="h-1 w-16 lg:w-20 bg-cyan-400 rounded-full mb-4 lg:mb-6"></div>
            <h1 className="text-xl lg:text-2xl font-bold text-center text-white">
              Login
            </h1>
          </div>

          {error && (
            <div className="text-red-500 text-center mb-4">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <InputTeste
              label="CPF"
              type="text"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              error={cpfError}
              placeholder="Digite seu CPF"
            />

            <InputTeste
              label="Senha"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Digite sua senha"
            />

            <button
              type="submit"
              disabled={loading}
              className={`w-[200px] h-[50px] bg-[#01777B] hover:bg-amber-600 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-cyan-500/20 flex items-center justify-center mx-auto ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Carregando..." : "Entrar"}
            </button>
          </form>
        </div>
      </div>
      
      {/* Hero section - hidden on mobile */}
      <div className="hidden lg:block lg:w-[65%] bg-[#1A3446] relative overflow-hidden">
        <HeroLogin />
      </div>
    </div>
  );
}
