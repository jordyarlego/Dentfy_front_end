"use client";

import { useState, useEffect, useRef } from "react";
import {
  FaTimes,
  FaSave,
  FaTooth,
  FaHistory,
  FaSkullCrossbones,
  FaWrench,
  FaMinusSquare,
  FaCrown,
  FaCheckCircle,
  FaPoo,
  FaTools,
  FaPlusSquare,
} from "react-icons/fa";
import OdontogramaSuccess from "../OdontogramaSuccess";
import {
  UpdateOdontograma,
  GetOdontograma,
} from "../../../services/api_vitima";

interface VitimaData {
  _id: string;
  nomeCompleto: string;
  dataNascimento: string;
  sexo: string;
  endereco: string;
  etnia: string;
  cpf: string;
  nic: string;
  caso: string;
}

interface ModalOdontogramaProps {
  isOpen: boolean;
  onClose: () => void;
  vitima: VitimaData | null;
}

interface Dente {
  numero: number;
  status: "saudavel" | "cariado" | "restaurado" | "extraido" | "protesado";
  observacoes: string;
}

interface DentePosicao {
  numero: number;
  top: string;
  left: string;
  width: string;
  height: string;
}

const allToothNumbers = [
  18, 17, 16, 15, 14, 13, 12, 11,
  21, 22, 23, 24, 25, 26, 27, 28,
  48, 47, 46, 45, 44, 43, 42, 41,
  31, 32, 33, 34, 35, 36, 37, 38,
];

export default function ModalOdontograma({
  isOpen,
  onClose,
  vitima,
}: ModalOdontogramaProps) {
  const [dentes, setDentes] = useState<Dente[]>([]);
  const [denteSelecionado, setDenteSelecionado] = useState<number>(allToothNumbers[0]);
  const [statusSelecionado, setStatusSelecionado] = useState<Dente["status"]>("saudavel");
  const [observacao, setObservacao] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessFeedback, setShowSuccessFeedback] = useState(false);
  const [odontogramaSalvo, setOdontogramaSalvo] = useState<Dente[]>([]);
  const [loadingOdontograma, setLoadingOdontograma] = useState(false);

  // Refs para os elementos de áudio
  const toinnAudio = useRef<HTMLAudioElement | null>(null);
  const pancadaChavesAudio = useRef<HTMLAudioElement | null>(null);
  const cartoonRisadaAudio = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    toinnAudio.current = new Audio('/assets/toinn.mp3');
    pancadaChavesAudio.current = new Audio('/assets/pancada_chaves.mp3');
    cartoonRisadaAudio.current = new Audio('/assets/cartoonrisada.mp3');
  }, []);

  // Toca 'toinn.mp3' ao selecionar dente ou avaria
  useEffect(() => {
    if (isOpen) { // Só toca se o modal estiver aberto
      toinnAudio.current?.play().catch(e => console.error("Erro ao tocar toinn.mp3:", e));
    }
  }, [denteSelecionado, statusSelecionado, isOpen]);

  const dentesPosicoes: DentePosicao[] = [
    { numero: 18, top: '22%', left: '10%', width: '5%', height: '8%' },
    { numero: 17, top: '22%', left: '13.5%', width: '5%', height: '8%' },
    { numero: 16, top: '22%', left: '17%', width: '5%', height: '8%' },
    { numero: 15, top: '22%', left: '20.5%', width: '5%', height: '8%' },
    { numero: 14, top: '22%', left: '24%', width: '5%', height: '8%' },
    { numero: 13, top: '22%', left: '27.5%', width: '5%', height: '8%' },
    { numero: 12, top: '22%', left: '31%', width: '5%', height: '8%' },
    { numero: 11, top: '22%', left: '34.5%', width: '5%', height: '8%' },
    { numero: 21, top: '22%', left: '38%', width: '5%', height: '8%' },
    { numero: 22, top: '22%', left: '41.5%', width: '5%', height: '8%' },
    { numero: 23, top: '22%', left: '45%', width: '5%', height: '8%' },
    { numero: 24, top: '22%', left: '48.5%', width: '5%', height: '8%' },
    { numero: 25, top: '22%', left: '52%', width: '5%', height: '8%' },
    { numero: 26, top: '22%', left: '55.5%', width: '5%', height: '8%' },
    { numero: 27, top: '22%', left: '59%', width: '5%', height: '8%' },
    { numero: 28, top: '22%', left: '62.5%', width: '5%', height: '8%' },
    { numero: 48, top: '63%', left: '10%', width: '5%', height: '8%' },
    { numero: 47, top: '63%', left: '13.5%', width: '5%', height: '8%' },
    { numero: 46, top: '63%', left: '17%', width: '5%', height: '8%' },
    { numero: 45, top: '63%', left: '20.5%', width: '5%', height: '8%' },
    { numero: 44, top: '63%', left: '24%', width: '5%', height: '8%' },
    { numero: 43, top: '63%', left: '27.5%', width: '5%', height: '8%' },
    { numero: 42, top: '63%', left: '31%', width: '5%', height: '8%' },
    { numero: 41, top: '63%', left: '34.5%', width: '5%', height: '8%' },
    { numero: 31, top: '63%', left: '38%', width: '5%', height: '8%' },
    { numero: 32, top: '63%', left: '41.5%', width: '5%', height: '8%' },
    { numero: 33, top: '63%', left: '45%', width: '5%', height: '8%' },
    { numero: 34, top: '63%', left: '48.5%', width: '5%', height: '8%' },
    { numero: 35, top: '63%', left: '52%', width: '5%', height: '8%' },
    { numero: 36, top: '63%', left: '55.5%', width: '5%', height: '8%' },
    { numero: 37, top: '63%', left: '59%', width: '5%', height: '8%' },
    { numero: 38, top: '63%', left: '62.5%', width: '5%', height: '8%' },
  ];

  // Inicializar dentes com a numeração correta
  useEffect(() => {
    if (isOpen) {
      const dentesIniciais: Dente[] = allToothNumbers.map((numero) => ({
        numero,
        status: "saudavel",
        observacoes: "",
      }));
      setDentes(dentesIniciais);
      setDenteSelecionado(allToothNumbers[0]);
      setStatusSelecionado("saudavel");
      setObservacao("");
    }
  }, [isOpen]);

  // Buscar odontograma salvo
  useEffect(() => {
    const fetchOdontograma = async () => {
      if (isOpen && vitima?._id) {
        setLoadingOdontograma(true);
        try {
          const response = await GetOdontograma(vitima._id);
          console.log("API Response (GetOdontograma):", response); // DEBUG: Log da resposta da API
          if (response.length > 0) {
            // Garantir que os dentes salvos sejam mesclados com a estrutura completa
            const mergedDentes: Dente[] = allToothNumbers.map((num) => {
              const savedDenteFromApi = response.find((d: { numero: number; status: string; observacoes?: string; }) => d.numero === num);
              
              if (savedDenteFromApi) {
                // Assegura que o status é do tipo correto
                const validatedStatus: Dente["status"] = validateStatus(savedDenteFromApi.status);
                return {
                  numero: savedDenteFromApi.numero,
                  status: validatedStatus,
                  observacoes: savedDenteFromApi.observacoes || "",
                };
              } else {
                return { numero: num, status: "saudavel", observacoes: "" };
              }
            });
            console.log("Merged Dentes (after API fetch):", mergedDentes); // DEBUG: Log dos dentes mesclados
            setOdontogramaSalvo(mergedDentes);
            setDentes(mergedDentes); // Atualiza o odontograma atual com os dados salvos
          } else {
            // Se não houver odontograma salvo, inicializa com dentes saudáveis
            const dentesIniciais: Dente[] = allToothNumbers.map((numero) => ({
              numero,
              status: "saudavel",
              observacoes: "",
            }));
            setDentes(dentesIniciais);
            setOdontogramaSalvo([]);
          }
        } catch (error) {
          console.error("❌ Erro ao buscar odontograma:", error);
        } finally {
          setLoadingOdontograma(false);
        }
      }
    };

    fetchOdontograma();
  }, [isOpen, vitima?._id]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "saudavel":
        return "text-green-500";
      case "cariado":
        return "text-red-500";
      case "restaurado":
        return "text-blue-500";
      case "extraido":
        return "text-gray-500";
      case "protesado":
        return "text-yellow-500";
      default:
        return "text-white";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "saudavel":
        return null;
      case "cariado":
        return <FaPoo className="h-4 w-4" />;
      case "restaurado":
        return <FaTools className="h-4 w-4" />;
      case "extraido":
        return <FaMinusSquare className="h-4 w-4" />;
      case "protesado":
        return <FaPlusSquare className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "saudavel":
        return "Saudável";
      case "cariado":
        return "Cariado";
      case "restaurado":
        return "Restaurado";
      case "extraido":
        return "Extraído";
      case "protesado":
        return "Protetizado";
      default:
        return "Saudável";
    }
  };

  // Função auxiliar para validar e tipar o status
  const validateStatus = (status: string): Dente["status"] => {
    const validStatuses: Dente["status"][] = ["saudavel", "cariado", "restaurado", "extraido", "protesado"];
    if (validStatuses.includes(status as Dente["status"])) {
      return status as Dente["status"];
    }
    return "saudavel"; // Retorna um status padrão caso seja inválido
  };

  const handleAplicarMudanca = () => {
    const dentesAtualizados = dentes.map((dente) =>
      dente.numero === denteSelecionado
        ? { ...dente, status: statusSelecionado, observacoes: observacao }
        : dente
    );
    setDentes(dentesAtualizados);
    // Manter a observação para o dente selecionado se ele já tiver uma, senão limpar
    const denteAtual = dentesAtualizados.find(d => d.numero === denteSelecionado);
    setObservacao(denteAtual?.observacoes || "");
    // Atualizar o status selecionado para refletir o estado atual do dente
    setStatusSelecionado(denteAtual?.status || "saudavel");

    // Toca cartoonrisada.mp3 ao aplicar mudança
    cartoonRisadaAudio.current?.play().catch(e => console.error("Erro ao tocar cartoonrisada.mp3:", e));
  };

  const handleSalvar = async () => {
    setLoading(true);
    try {
      if (!vitima?._id) {
        throw new Error("ID da vítima não encontrado");
      }

      // Formata os dentes para o formato esperado pela API
      const odontogramaFormatado = dentes.map((dente) => ({
        numero: dente.numero,
        descricao: dente.observacoes || getStatusLabel(dente.status), // Prioriza observações, senão usa o rótulo do status
        status: dente.status, // A API espera este campo
        observacoes: dente.observacoes, // A API espera este campo
      }));

      console.log("Payload enviado para UpdateOdontograma:", odontogramaFormatado); // DEBUG

      const response = await UpdateOdontograma(
        vitima._id,
        odontogramaFormatado
      );
      console.log("✅ Odontograma atualizado com sucesso!", {
        vitima: vitima.nomeCompleto,
        totalDentes: odontogramaFormatado.length,
        response,
      });

      // Toca pancada_chaves.mp3 ao salvar com sucesso
      pancadaChavesAudio.current?.play().catch(e => console.error("Erro ao tocar pancada_chaves.mp3:", e));

      setShowSuccessFeedback(true);
      setTimeout(() => {
        onClose();
        setShowSuccessFeedback(false);
      }, 3000);
    } catch (error) {
      console.error("❌ Erro ao salvar odontograma:", error);
    } finally {
      setLoading(false);
    }
  };

  // Atualizar observação e status quando o dente selecionado muda
  useEffect(() => {
    const currentDente = dentes.find(d => d.numero === denteSelecionado);
    if (currentDente) {
      setObservacao(currentDente.observacoes);
      setStatusSelecionado(currentDente.status);
    } else {
      setObservacao("");
      setStatusSelecionado("saudavel");
    }
  }, [denteSelecionado, dentes]);

  if (!isOpen || !vitima) return null;

  return (
    <>
      <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
        <div className="bg-[#0E1A26] border border-amber-500/30 rounded-xl shadow-2xl w-full max-w-6xl flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="p-6 border-b border-gray-700 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <FaTooth className="h-8 w-8 text-amber-500" />
              <div>
                <h2 className="text-2xl font-bold text-amber-500">
                  Odontograma
                </h2>
                <p className="text-gray-300 text-sm">{vitima.nomeCompleto}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-amber-100 hover:text-amber-500 transition-all duration-300 hover:rotate-90 cursor-pointer"
            >
              <FaTimes className="h-6 w-6" />
            </button>
          </div>

          {/* Conteúdo */}
          <div className="flex flex-1 min-h-0">
            {/* Odontograma */}
            <div className="flex-1 p-6 overflow-y-auto relative">
              <div
                className="relative w-full pb-[50%] bg-contain bg-no-repeat bg-center"
                style={{ backgroundImage: "url('/assets/odontograma.png')" }}
              >
                {dentesPosicoes.map((pos) => {
                  const dente = dentes.find((d) => d.numero === pos.numero);
                  if (!dente) return null;

                  return (
                    <div
                      key={pos.numero}
                      className="absolute flex items-center justify-center"
                      style={{
                        top: pos.top,
                        left: pos.left,
                        width: pos.width,
                        height: pos.height,
                      }}
                    >
                      {getStatusIcon(dente.status) && (
                        <div
                          className={`flex items-center justify-center rounded-full p-1 ${getStatusColor(dente.status)}`}
                          style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            zIndex: 10 // Garante que o ícone esteja acima da imagem
                          }}
                        >
                          {getStatusIcon(dente.status)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Legenda */}
              <div className="mt-6 p-4 bg-gray-800/50 rounded-lg">
                <h5 className="text-sm font-medium text-amber-400 mb-2">
                  Legenda:
                </h5>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-green-500 rounded-full inline-block" />
                    <FaCheckCircle className="text-green-500 mr-1" /> Saudável
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-red-500 rounded-full inline-block" />
                    <FaPoo className="text-red-500 mr-1" /> Cariado
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-blue-500 rounded-full inline-block" />
                    <FaTools className="text-blue-500 mr-1" /> Restaurado
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-gray-500 rounded-full inline-block" />
                    <FaMinusSquare className="text-gray-500 mr-1" /> Extraído
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 bg-yellow-500 rounded-full inline-block" />
                    <FaPlusSquare className="text-yellow-500 mr-1" /> Protetizado
                  </div>
                </div>
              </div>
            </div>

            {/* Controles */}
            <div className="w-80 border-l border-gray-700 p-6 flex flex-col space-y-4 overflow-y-auto">
              <h3 className="text-xl font-bold text-white border-b border-gray-700 pb-3 mb-4">
                Controles
              </h3>

              {/* Card do Último Odontograma Salvo */}
              {loadingOdontograma ? (
                <div className="mb-6 p-4 bg-gray-800/40 rounded-lg">
                  <p className="text-gray-400 text-center">
                    Carregando odontograma...
                  </p>
                </div>
              ) : odontogramaSalvo.length > 0 ? (
                <div className="mb-6 p-4 bg-gray-800/40 rounded-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <FaHistory className="text-amber-500" />
                    <h4 className="text-sm font-medium text-amber-400">
                      Último Odontograma Salvo
                    </h4>
                  </div>
                  <div className="space-y-2 text-sm text-gray-300">
                    <p>Total de dentes: {odontogramaSalvo.length}</p>
                    <p>
                      Dentes saudáveis:{" "}
                      {
                        odontogramaSalvo.filter((d) => d.status === "saudavel")
                          .length
                      }
                    </p>
                    <p>
                      Dentes cariados:{" "}
                      {
                        odontogramaSalvo.filter((d) => d.status === "cariado")
                          .length
                      }
                    </p>
                    <p>
                      Dentes restaurados:{" "}
                      {
                        odontogramaSalvo.filter(
                          (d) => d.status === "restaurado"
                        ).length
                      }
                    </p>
                    <p>
                      Dentes extraídos:{" "}
                      {
                        odontogramaSalvo.filter((d) => d.status === "extraido")
                          .length
                      }
                    </p>
                    <p>
                      Dentes protetizados:{" "}
                      {
                        odontogramaSalvo.filter((d) => d.status === "protesado")
                          .length
                      }
                    </p>
                  </div>
                </div>
              ) : (
                <div className="mb-6 p-4 bg-gray-800/40 rounded-lg">
                  <p className="text-gray-400 text-center">
                    Nenhum odontograma salvo para esta vítima.
                  </p>
                </div>
              )}

              {/* Seleção de Dente */}
              <div>
                <label className="block text-sm font-medium text-amber-400 mb-2">
                  Selecionar Dente
                </label>
                <select
                  value={denteSelecionado}
                  onChange={(e) => setDenteSelecionado(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
                >
                  {allToothNumbers.map((num) => (
                    <option key={num} value={num}>
                      Dente {num}
                    </option>
                  ))}
                </select>
              </div>

              {/* Seleção de Status */}
              <div>
                <label className="block text-sm font-medium text-amber-400 mb-2">
                  Status do Dente
                </label>
                <select
                  value={statusSelecionado}
                  onChange={(e) => setStatusSelecionado(e.target.value as Dente["status"])}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="saudavel">Saudável</option>
                  <option value="cariado">Cariado</option>
                  <option value="restaurado">Restaurado</option>
                  <option value="extraido">Extraído</option>
                  <option value="protesado">Protetizado</option>
                </select>
              </div>

              {/* Observações */}
              <div>
                <label className="block text-sm font-medium text-amber-400 mb-2">
                  Observações
                </label>
                <textarea
                  value={observacao}
                  onChange={(e) => setObservacao(e.target.value)}
                  placeholder="Adicione observações sobre o dente..."
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-amber-500 resize-none"
                  rows={3}
                />
              </div>

              {/* Botão Aplicar */}
              <button
                onClick={handleAplicarMudanca}
                className="w-full px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white font-medium rounded-lg transition-all duration-300 hover:scale-105"
              >
                Aplicar Mudança
              </button>

              {/* Botão Salvar */}
              <button
                onClick={handleSalvar}
                disabled={loading}
                className="w-full px-4 py-2 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-600 text-white font-medium rounded-lg transition-all duration-300 hover:scale-105 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Salvando...
                  </>
                ) : (
                  <>
                    <FaSave className="h-4 w-4" />
                    Salvar Odontograma
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Feedback de Sucesso */}
      {showSuccessFeedback && <OdontogramaSuccess />}
    </>
  );
}
