import api from "../../../lib/axios";
import { AxiosError } from "axios";

// Tipagem para os dados do formulário de criação de evidência
export interface EvidenciaFormData {
  descricao: string;
  data: string;
  tipo: string;
  coletadoPor: string;
  arquivo: File | null;
}

// Resposta esperada da API
export interface EvidenciaResponse {
  id: number;
  tipo: string;
  dataColeta: string;
  coletadoPor: string;
  // Outros campos que o backend possa retornar
}

/**
 * Cria uma nova evidência para um caso específico
 * @param evidenciaData Dados da evidência a ser criada
 * @param casoId ID do caso relacionado
 * @returns Promise com os dados da evidência criada
 */
export async function criarEvidencia(
  evidenciaData: EvidenciaFormData,
  casoId: number
): Promise<EvidenciaResponse> {
  try {
    // Obter o token do localStorage
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("Usuário não autenticado");
    }

    // Criar um FormData para enviar arquivos
    const formData = new FormData();

    // Adicionar os campos conforme esperado pelo backend
    formData.append("tipo", evidenciaData.tipo);
    formData.append("dataColeta", evidenciaData.data);
    formData.append("coletadoPor", evidenciaData.coletadoPor);
    formData.append("caso", casoId.toString());

    // Para o tipo texto, adicionar descrição como conteúdoTexto
    if (evidenciaData.tipo === "texto") {
      formData.append("conteudoTexto", evidenciaData.descricao);
    } else {
      // Para imagens, adicionar a descrição e o arquivo
      formData.append("descricao", evidenciaData.descricao);
      if (evidenciaData.arquivo) {
        formData.append("imagem", evidenciaData.arquivo);
      }
    }

    // Configurar headers com o token
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    // Log antes de enviar para debug
    console.log("Enviando dados para API:", {
      tipo: evidenciaData.tipo,
      dataColeta: evidenciaData.data,
      coletadoPor: evidenciaData.coletadoPor,
      caso: casoId,
      temArquivo: !!evidenciaData.arquivo,
    });

    const response = await api.post<EvidenciaResponse>(
      "/api/evidences",
      formData,
      config
    );

    console.log("Resposta da API:", response.data);
    return response.data;
  } catch (error) {
    console.error("Erro ao criar evidência:", error);

    if (error instanceof AxiosError) {
      // Detalhar o erro do Axios para diagnosticar melhor
      if (error.response) {
        console.error("Detalhes do erro:", {
          data: error.response.data,
          status: error.response.status,
          headers: error.response.headers,
        });
      }

      // Tratamento de erros HTTP específicos
      if (error.response?.status === 401) {
        localStorage.removeItem("token");
        throw new Error("Sessão expirada. Por favor, faça login novamente.");
      }

      if (error.response?.status === 404) {
        throw new Error("Endpoint não encontrado. Verifique a URL da API.");
      }

      if (error.response?.status === 400) {
        // Erros de validação de dados
        const errorMessage =
          error.response?.data?.message ||
          "Dados inválidos enviados para o servidor.";
        throw new Error(errorMessage);
      }

      if (error.response?.status === 500) {
        throw new Error(
          "Erro no servidor. Por favor, tente novamente mais tarde."
        );
      }

      // Extrair mensagem de erro da resposta do backend
      const errorMessage =
        error.response?.data?.message || "Erro ao salvar evidência";
      throw new Error(errorMessage);
    }

    throw new Error("Erro ao salvar evidência. Tente novamente.");
  }
}
