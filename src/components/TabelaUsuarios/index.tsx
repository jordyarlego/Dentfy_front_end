"use client";
import { useState } from "react";
import Registro from "../ComponentRegistro";
import ModalVisualizacaoUsuario from "../ModalVisualizacaoUsuario";
import FeedbackModal from "../FeedbackModal";
import ModalConfirmacaoExclusao from "../ModalConfirmacaoExclusao";
import { FaSearch, FaPlus, FaEdit, FaTrash, FaUser, FaEnvelope, FaUserTie, FaLock, FaUnlock, FaEye } from "react-icons/fa";

type Cargo = "Perito" | "Assistente";
type Status = "ativo" | "inativo";

interface Usuario {
  id: string;
  nome: string;
  email: string;
  senha: string;
  cpf: string;
  cargo: Cargo;
  status: Status;
}

interface UsuarioVisualizacao {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  cargo: Cargo;
  status: Status;
}

export default function TabelaUsuarios() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showRegistro, setShowRegistro] = useState(false);
  const [showVisualizacao, setShowVisualizacao] = useState(false);
  const [usuarioSelecionado, setUsuarioSelecionado] = useState<Usuario | null>(null);
  const [showConfirmacaoExclusao, setShowConfirmacaoExclusao] = useState(false);
  const [usuarioParaExcluir, setUsuarioParaExcluir] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    title: string;
    message: string;
    subMessage?: string;
  } | null>(null);
  const [usuarios, setUsuarios] = useState<Usuario[]>([
    {
      id: "1",
      nome: "João Silva",
      email: "joao@email.com",
      senha: "••••••••",
      cpf: "12345678900",
      cargo: "Perito",
      status: "ativo"
    },
    {
      id: "2",
      nome: "Maria Souza",
      email: "maria@email.com",
      senha: "••••••••",
      cpf: "98765432100",
      cargo: "Assistente",
      status: "ativo"
    },
    {
      id: "3",
      nome: "Carlos Oliveira",
      email: "carlos@email.com",
      senha: "••••••••",
      cpf: "45678912300",
      cargo: "Perito",
      status: "inativo"
    }
  ]);

  const filteredUsuarios = usuarios.filter((usuario) => {
    const term = searchTerm.toLowerCase();
    return (
      usuario.nome.toLowerCase().includes(term) ||
      usuario.email.toLowerCase().includes(term) ||
      usuario.cargo.toLowerCase().includes(term) ||
      usuario.cpf.includes(term)
    );
  });

  const handleNovoUsuario = () => setShowRegistro(true);
  const handleCloseRegistro = () => setShowRegistro(false);

  const handleVisualizarUsuario = (usuario: Usuario) => {
    setUsuarioSelecionado(usuario);
    setShowVisualizacao(true);
  };

  const handleCloseVisualizacao = () => {
    setShowVisualizacao(false);
    setUsuarioSelecionado(null);
  };

  const handleEditarUsuario = (usuario: Usuario) => {
    setShowVisualizacao(false);
    setUsuarioSelecionado(usuario);
    setShowRegistro(true);
  };

  const handleAddUsuario = (novoUsuario: Omit<Usuario, 'id' | 'status'>) => {
    if (usuarioSelecionado) {
      // Edição
      setUsuarios(usuarios.map(usuario => 
        usuario.id === usuarioSelecionado.id
          ? { ...usuario, ...novoUsuario }
          : usuario
      ));
      setUsuarioSelecionado(null);
      setFeedback({
        isOpen: true,
        type: "success",
        title: "Usuário Atualizado!",
        message: "As alterações foram salvas com sucesso.",
        subMessage: "O usuário foi atualizado no sistema."
      });
    } else {
      // Novo usuário
      const novoUsuarioCompleto: Usuario = {
        id: Math.random().toString(36).substring(2, 9),
        ...novoUsuario,
        status: "ativo"
      };
      setUsuarios(prevUsuarios => [...prevUsuarios, novoUsuarioCompleto]);
      setFeedback({
        isOpen: true,
        type: "success",
        title: "Usuário Cadastrado!",
        message: "O usuário foi cadastrado com sucesso.",
        subMessage: "Bem-vindo à equipe!"
      });
    }
    handleCloseRegistro();
  };

  const handleExcluirUsuario = (id: string) => {
    setUsuarioParaExcluir(id);
    setShowConfirmacaoExclusao(true);
  };

  const confirmarExclusao = () => {
    if (usuarioParaExcluir) {
      setUsuarios(usuarios.filter(usuario => usuario.id !== usuarioParaExcluir));
      setFeedback({
        isOpen: true,
        type: "success",
        title: "Usuário Excluído!",
        message: "O usuário foi removido do sistema.",
        subMessage: "A operação foi concluída com sucesso."
      });
      setUsuarioParaExcluir(null);
    }
  };

  const toggleStatus = (id: string) => {
    setUsuarios(usuarios.map(usuario => 
      usuario.id === id 
        ? { ...usuario, status: usuario.status === "ativo" ? "inativo" : "ativo" } 
        : usuario
    ));
    setFeedback({
      isOpen: true,
      type: "success",
      title: "Status Atualizado!",
      message: "O status do usuário foi alterado.",
      subMessage: "A operação foi concluída com sucesso."
    });
  };

  return (
    <div className="p-4 sm:p-6 bg-transparent min-h-screen">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-100">
          
        </h1>

        <button
          onClick={handleNovoUsuario}
          className="relative bg-gray-800/90 text-gray-100 px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-gray-700 transition-all duration-300 font-medium shadow-md border border-gray-700 hover:border-gray-600 group cursor-pointer w-full sm:w-auto"
        >
          <span className="relative z-10 flex items-center justify-center sm:justify-start gap-2">
            <FaPlus className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors" />
            <span className="truncate">Cadastrar Usuário</span>
          </span>
          <span className="absolute inset-0 bg-gray-600 opacity-0 group-hover:opacity-10 rounded-lg transition-opacity duration-300"></span>
        </button>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Pesquisar usuários..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full border border-gray-700 bg-gray-800/80 text-gray-200 rounded-lg px-4 sm:px-5 py-2 sm:py-3 focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition-all duration-300 shadow cursor-text placeholder-gray-500 backdrop-blur-sm"
          />
          <FaSearch className="absolute right-3 top-2.5 sm:top-3.5 h-5 w-5 text-gray-500 cursor-pointer hover:text-gray-400 transition-colors" />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-700 bg-gray-800/80 backdrop-blur-sm">
        <table className="min-w-full">
          <thead className="bg-gray-800/90">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                <FaUser className="inline mr-2" /> Nome
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                <FaEnvelope className="inline mr-2" /> Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                <FaUserTie className="inline mr-2" /> Cargo
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredUsuarios.length > 0 ? (
              filteredUsuarios.map((usuario) => (
                <tr key={usuario.id} className="hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                    {usuario.nome}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {usuario.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      usuario.cargo === "Perito" 
                        ? "bg-gray-700/50 text-gray-300" 
                        : "bg-gray-700/50 text-gray-300"
                    }`}>
                      {usuario.cargo}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      onClick={() => toggleStatus(usuario.id)}
                      className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
                        usuario.status === "ativo"
                          ? "bg-green-900/30 text-green-400 hover:bg-green-900/40"
                          : "bg-red-900/30 text-red-400 hover:bg-red-900/40"
                      }`}
                    >
                      {usuario.status === "ativo" ? (
                        <><FaLock size={10} /> Ativo</>
                      ) : (
                        <><FaUnlock size={10} /> Inativo</>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleVisualizarUsuario(usuario)}
                        className="text-amber-500 hover:text-amber-400 p-1 transition-colors"
                        title="Visualizar"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleEditarUsuario(usuario)}
                        className="text-gray-400 hover:text-white p-1 transition-colors"
                        title="Editar"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleExcluirUsuario(usuario.id)}
                        className="text-red-500 hover:text-red-400 p-1 transition-colors"
                        title="Excluir"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                  Nenhum usuário encontrado com os critérios de busca.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Registro */}
      {showRegistro && (
        <Registro 
          onClose={handleCloseRegistro}
          onSave={handleAddUsuario}
          usuarioEditando={usuarioSelecionado}
        />
      )}

      {/* Modal de Visualização */}
      {showVisualizacao && usuarioSelecionado && (
        <ModalVisualizacaoUsuario
          usuario={usuarioSelecionado as UsuarioVisualizacao}
          onClose={handleCloseVisualizacao}
          onEdit={handleEditarUsuario}
          onDelete={handleExcluirUsuario}
        />
      )}

      {showConfirmacaoExclusao && (
        <ModalConfirmacaoExclusao
          isOpen={showConfirmacaoExclusao}
          onClose={() => setShowConfirmacaoExclusao(false)}
          onConfirm={confirmarExclusao}
          title="Confirmar Exclusão"
          message="Tem certeza que deseja excluir este usuário? Esta ação não pode ser desfeita."
        />
      )}

      {feedback && (
        <FeedbackModal
          isOpen={feedback.isOpen}
          onClose={() => setFeedback(null)}
          type={feedback.type}
          title={feedback.title}
          message={feedback.message}
          subMessage={feedback.subMessage}
        />
      )}
    </div>
  );
}
