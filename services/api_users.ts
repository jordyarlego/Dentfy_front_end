import api from "../lib/axios";

interface apiUsuario {
  name: string;
  email: string;
  password: string;
  confirmarSenha: string;
  cpf: string;
  role: "perito" | "assistente";
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


export async function PutUsuario(id: string, data: apiUsuario) {
  console.log("Atualizando usuário:", id);
  try {
    const token = localStorage.getItem("token");

    const response = await api.put(`/api/users/${id}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar usuario", error);
    throw error;
  }
}

export async function DeleteUsuario(id: string) {
  console.log("Deletando usuário:", id);
  try {
    const token = localStorage.getItem("token");

    const response = await api.delete(`/api/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Erro ao deletar usuário", error);
    throw error;
  }
}