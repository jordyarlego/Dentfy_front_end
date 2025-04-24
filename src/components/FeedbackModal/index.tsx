"use client";
import { useState, useEffect } from "react";
import { FaCheck,  FaEdit, FaTrash } from "react-icons/fa";
import Image from "next/image";

import CaveiraPeste from "../../../public/assets/CaveiraPeste.png";

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "success" | "edit" | "delete";
  message: string;
}

export default function FeedbackModal({
  isOpen,
  onClose,
  type,
  message,
}: FeedbackModalProps) {
  const [progress, setProgress] = useState(0);
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const duration = 2000; // 2 segundos
      const interval = 50; // Atualizar a cada 50ms
      const steps = duration / interval;
      const increment = 100 / steps;

      const timer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(timer);
            return 100;
          }
          return prev + increment;
        });
      }, interval);

      // Mostrar mensagem após 500ms
      const messageTimer = setTimeout(() => {
        setShowMessage(true);
      }, 500);

      return () => {
        clearInterval(timer);
        clearTimeout(messageTimer);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    if (progress >= 100) {
      const closeTimer = setTimeout(() => {
        onClose();
      }, 500);
      return () => clearTimeout(closeTimer);
    }
  }, [progress, onClose]);

  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case "success":
        return <FaCheck className="text-green-500 text-2xl" />;
      case "edit":
        return <FaEdit className="text-blue-500 text-2xl" />;
      case "delete":
        return <FaTrash className="text-red-500 text-2xl" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-green-500/20";
      case "edit":
        return "bg-blue-500/20";
      case "delete":
        return "bg-red-500/20";
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="relative bg-[#0E1A26] border border-amber-500/30 rounded-xl shadow-2xl w-full max-w-md p-6 animate-slideIn">
        <div className="absolute inset-0 pointer-events-none opacity-5 mix-blend-overlay">
          <Image
            src={CaveiraPeste}
            alt="Caveira decorativa"
            className="object-cover"
            fill
          />
        </div>

        <div className="flex flex-col items-center text-center">
          <div className={`w-16 h-16 rounded-full ${getBgColor()} flex items-center justify-center mb-4 animate-bounce`}>
            {getIcon()}
          </div>
          <h3 className="text-xl font-bold text-amber-100 mb-2">
            {type === "success" && "Sucesso!"}
            {type === "edit" && "Caso Atualizado!"}
            {type === "delete" && "Caso Excluído!"}
          </h3>
          <p className="text-gray-300 mb-6">{message}</p>
          <button
            onClick={onClose}
            className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
} 