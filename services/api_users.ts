import api from "../lib/axios";

interface apiUsuario {
  nome: string;
  email: string;
  senha: string;
  confirmarSenha: string;
  cpf: string;
  cargo: "Perito" | "Assistente";
}

export async function PostUsuario(data: apiUsuario) {
  console.log("usuario adicionado:");
  try {
    const token = localStorage.getItem("token");

    const response = await api.post("/api/users", data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao criar usuario", error);
    throw error;
  }
}

export async function GetUsuarios() {
  try {
    const response = await api.get("/api/users");

    return response.data;
  } catch (error) {
    console.error("Erro ao carregar usuario", error);
    throw error;
  }
}
