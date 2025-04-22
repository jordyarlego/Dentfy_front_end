'use client';
import { useState, useEffect, useMemo } from 'react';
import { FaTimes, FaFilePdf, FaSignature, FaSave, FaFile,  } from 'react-icons/fa';
import Image from 'next/image';
import CaveiraPeste from '../../../public/assets/CaveiraPeste.png';
import Logo from '../../../public/assets/Logo.png';
import EvidenciasSalvaSucess from '../EvidenciasSalvaSucess';

interface Evidencia {
  id: number;
  nome: string;
  tipo: string;
  descricao: string;
  coletadoPor: string;
  arquivo: string | File;
  laudo?: string;
  dataAdicao: string;
  mimeType?: string;
}

interface ModalGerarLaudoProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (laudo: string, evidenciaId: number) => void;
  evidencia?: Evidencia;
}

export default function ModalGerarLaudo({
  isOpen,
  onClose,
  onSave,
  evidencia
}: ModalGerarLaudoProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [assinatura, setAssinatura] = useState('');
  const [laudoContent, setLaudoContent] = useState(evidencia?.laudo || '');

  const fileUrl = useMemo(() => {
    if (!evidencia) return '';
    if (typeof evidencia.arquivo === 'string') return evidencia.arquivo;
    return URL.createObjectURL(evidencia.arquivo);
  }, [evidencia]);

  const fileType = useMemo(() => {
    if (!evidencia) return 'other';
    
    // Verifica pelo mimeType primeiro
    if (evidencia.mimeType) {
      if (evidencia.mimeType.startsWith('image/')) return 'image';
      if (evidencia.mimeType.startsWith('video/')) return 'video';
      if (evidencia.mimeType === 'application/pdf') return 'pdf';
    }
    
    // Fallback pela extensão do arquivo
    const extension = evidencia.nome.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp'].includes(extension!)) return 'image';
    if (['mp4', 'mov', 'avi', 'mkv', 'webm'].includes(extension!)) return 'video';
    if (extension === 'pdf') return 'pdf';
    
    return 'other';
  }, [evidencia]);

  useEffect(() => {
    if (evidencia) {
      setLaudoContent(evidencia.laudo || '');
    }
  }, [evidencia]);

  useEffect(() => {
    return () => {
      if (fileUrl && typeof evidencia?.arquivo !== 'string') {
        URL.revokeObjectURL(fileUrl);
      }
    };
  }, [fileUrl, evidencia?.arquivo]);

  const handleSalvar = () => {
    if (evidencia) {
      onSave(laudoContent, evidencia.id);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000);
    }
  };

  if (!isOpen || !evidencia) return null;

  return (
    <>
      <div className="fixed inset-0 z-[1000] bg-black/80 flex items-center justify-center p-4 backdrop-blur-xl">
        <div className="relative z-[1001] bg-gray-800 border-2 border-amber-900/50 rounded-xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col">
          <div className="absolute inset-0 opacity-10 mix-blend-overlay">
            <Image
              src={CaveiraPeste}
              alt="Background"
              fill
              className="object-cover"
              priority
            />
          </div>

          <div className="relative z-10 h-full flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-amber-900/30 bg-gray-850/90">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-5">
                  <Image
                    src={Logo}
                    alt="Logo"
                    fill
                    className="object-contain opacity-80"
                    priority
                  />
                </div>
                <h2 className="text-xl font-bold text-amber-500">
                  Laudo: {evidencia.nome}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-amber-500 transition-colors duration-200 hover:scale-110 cursor-pointer"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-1 min-h-0 gap-4 p-4">
              <div className="w-1/3 flex flex-col gap-4">
                <div className="relative h-40 bg-gray-700/50 rounded-lg overflow-hidden flex items-center justify-center">
                  {fileType === 'image' && fileUrl && (
                    <Image
                      src={fileUrl}
                      alt={evidencia.nome}
                      fill
                      className="object-contain"
                      quality={100}
                      priority
                      unoptimized={typeof evidencia.arquivo !== 'string'}
                    />
                  )}
                  
                  {fileType === 'video' && fileUrl && (
                    <video 
                      controls 
                      className="w-full h-full object-contain"
                      key={fileUrl}
                    >
                      <source src={fileUrl} type={evidencia.mimeType} />
                      Seu navegador não suporta o elemento de vídeo.
                    </video>
                  )}

                  {fileType === 'pdf' && fileUrl && (
                    <iframe 
                      src={fileUrl}
                      className="w-full h-full"
                      title="Visualizador de PDF"
                    />
                  )}

                  {fileType === 'other' && (
                    <div className="flex flex-col items-center p-4 text-center text-amber-400">
                      <FaFile className="text-4xl mb-2" />
                      <span className="text-sm">Visualização não disponível</span>
                      <a
                        href={fileUrl}
                        download={evidencia.nome}
                        className="mt-2 text-sm text-amber-500 hover:text-amber-400 transition-colors underline"
                      >
                        Baixar arquivo
                      </a>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="bg-gray-700/50 p-2 rounded-lg hover:bg-gray-700/70 transition-colors">
                    <p className="text-xs text-amber-500 mb-1">Descrição</p>
                    <p className="text-sm text-gray-200">{evidencia.descricao}</p>
                  </div>

                  <div className="bg-gray-700/50 p-2 rounded-lg hover:bg-gray-700/70 transition-colors">
                    <p className="text-xs text-amber-500 mb-1">Tipo</p>
                    <p className="text-sm text-gray-200">{evidencia.tipo}</p>
                  </div>

                  <div className="bg-gray-700/50 p-2 rounded-lg hover:bg-gray-700/70 transition-colors">
                    <p className="text-xs text-amber-500 mb-1">Coletado por</p>
                    <p className="text-sm text-gray-200">{evidencia.coletadoPor}</p>
                  </div>

                  <div className="bg-gray-700/50 p-2 rounded-lg hover:bg-gray-700/70 transition-colors">
                    <p className="text-xs text-amber-500 mb-1">Data de Coleta</p>
                    <p className="text-sm text-gray-200">
                      {new Date(evidencia.dataAdicao).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="w-2/3 flex flex-col gap-4">
                <div className="flex-1 flex flex-col">
                  <p className="text-xs text-amber-500 mb-2">Conteúdo do Laudo</p>
                  <textarea
                    value={laudoContent}
                    onChange={(e) => setLaudoContent(e.target.value)}
                    className="w-full h-full p-3 bg-gray-700/50 border border-amber-900/30 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-amber-500 resize-none hover:border-amber-400 transition-colors"
                    placeholder="Digite o conteúdo do laudo..."
                  />
                </div>

                <div className="bg-gray-700/50 p-3 rounded-lg hover:bg-gray-700/70 transition-colors">
                  <p className="text-xs text-amber-500 mb-2">Assinatura Digital</p>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={assinatura}
                      onChange={(e) => setAssinatura(e.target.value)}
                      placeholder="Insira sua chave de assinatura"
                      className="flex-1 p-2 bg-gray-600/50 border border-amber-900/30 rounded-lg text-sm text-gray-200 focus:outline-none focus:border-amber-500 hover:border-amber-400 transition-colors"
                    />
                    <button
                      onClick={() => console.log('Assinatura validada')}
                      className="px-3 py-2 bg-purple-600/30 hover:bg-purple-600/50 border border-purple-700/50 rounded-lg text-sm transition-all duration-300 hover:scale-[1.02] cursor-pointer active:scale-95"
                    >
                      <FaSignature className="inline mr-1 text-purple-400" />
                      <span className="text-purple-200">Validar</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-amber-900/30 bg-gray-850">
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => console.log('Gerando PDF...')}
                  className="px-4 py-2 bg-red-600/30 hover:bg-red-600/50 border border-red-700/50 rounded-lg text-sm transition-all duration-300 hover:scale-[1.02] cursor-pointer active:scale-95"
                >
                  <FaFilePdf className="inline mr-1 text-red-400" />
                  <span className="text-red-200">Gerar PDF</span>
                </button>
                
                <button
                  onClick={handleSalvar}
                  className="px-4 py-2 bg-green-600/30 hover:bg-green-600/50 border border-green-700/50 rounded-lg text-sm transition-all duration-300 hover:scale-[1.02] cursor-pointer active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!assinatura}
                >
                  <FaSave className="inline mr-1 text-green-400" />
                  <span className="text-green-200">
                    {evidencia.laudo ? 'Atualizar' : 'Salvar'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSuccess && (
        <EvidenciasSalvaSucess 
          onClose={() => setShowSuccess(false)}
        />
      )}
    </>
  );
}