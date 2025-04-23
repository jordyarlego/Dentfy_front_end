"use client";
import { useEffect } from "react";
import { FaCheck, FaTimes } from "react-icons/fa";

interface ToastProps {
  message: string;
  type: "success" | "error";
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, type, onClose, duration = 3000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div className="fixed top-4 right-4 z-[300] animate-slideInRight">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg ${
        type === "success" 
          ? "bg-green-500/90 text-white" 
          : "bg-red-500/90 text-white"
      }`}>
        <div className={`p-1 rounded-full ${
          type === "success" 
            ? "bg-green-600" 
            : "bg-red-600"
        }`}>
          {type === "success" ? (
            <FaCheck className="w-4 h-4" />
          ) : (
            <FaTimes className="w-4 h-4" />
          )}
        </div>
        <p className="text-sm font-medium">{message}</p>
        <button
          onClick={onClose}
          className="ml-2 p-1 hover:bg-white/10 rounded-full transition-colors"
        >
          <FaTimes className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
} 