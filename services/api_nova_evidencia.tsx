import api from "../lib/axios";

interface CriarEvidenciaAPI {
  tipo: string;
  dataColeta: Date;
  coletadoPor: string; 
  imagemURL: string;
  caso: string; 
}

export const postEvidencia = async (dados: CriarEvidenciaAPI) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Token não encontrado!");
  }

  try {
    const response = await api.post("/api/evidences", dados, {
      headers: {
        Authorization: ⁠ Bearer ${token} ⁠,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error: any) {
    console.error(
      "Erro no Axios:",
      error.response?.data || error.message || error
    );
    throw error;
  }
};
// falta verificar o caso para ver se é o certo
export const getEvidencia = async (caso: string) => {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Token JWT não encontrado.");
  }

  const response = await api.get("/api/evidences/by-case{caseId}", {
    headers: {
      Authorization: ⁠ Bearer ${token} ⁠,
    },
    params: caso ? { caso } : {},
  });
  return response.data;
};

export const putEvidencia = async (caso: string) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Token JWT não encontrado.");
  }

  const response = await api.put("/api/evidences/{id}", {
    headers: {
      Authorization: ⁠ Bearer ${token} ⁠,
    },
    params: caso ? { caso } : {},
  });
  return response.data;
};

export const deleteEvidencia = async (caso: string) => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Token JWT não encontrado.");
  }

  const response = await api.delete("/api/evidences/{id}", {
    headers: {
      Authorization: ⁠ Bearer ${token} ⁠,
    },
    params: caso ? { caso } : {},
  });
  return response.data;
};