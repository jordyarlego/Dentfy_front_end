import { FaCheckCircle, FaTimes } from 'react-icons/fa';

interface FeedbackEvidenciaProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FeedbackEvidencia({ isOpen, onClose }: FeedbackEvidenciaProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[60] animate-fadeIn">
      <div className="relative bg-[#0E1A26]/95 p-8 rounded-2xl border border-amber-500/30 shadow-2xl max-w-md w-full mx-4 animate-slideUp">
        <div className="absolute -top-12 left-1/2 transform -translate-x-1/2">
          <div className="relative">
            <div className="absolute inset-0 bg-amber-500 rounded-full blur-xl opacity-20 animate-pulse"></div>
            <div className="bg-[#0E1A26] p-4 rounded-full border-2 border-amber-500">
              <FaCheckCircle className="text-4xl text-amber-500 animate-scaleIn" />
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-400 hover:text-amber-500 transition-all duration-300 hover:rotate-90 transform"
        >
          <FaTimes className="text-xl" />
        </button>

        <div className="text-center mt-6">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-amber-200 via-amber-400 to-amber-200 text-transparent bg-clip-text animate-shimmer">
            Evidência Salva!
          </h3>
          <p className="text-gray-300 mt-2 animate-fadeIn delay-150">
            A evidência foi adicionada com sucesso ao caso.
          </p>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-all duration-300 transform hover:scale-105 animate-fadeIn delay-300"
          >
            Continuar
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            transform: scale(0);
          }
          to {
            transform: scale(1);
          }
        }

        @keyframes shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .animate-slideUp {
          animation: slideUp 0.5s ease-out forwards;
        }

        .animate-scaleIn {
          animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        .animate-shimmer {
          animation: shimmer 3s linear infinite;
          background-size: 200% auto;
        }

        .delay-150 {
          animation-delay: 150ms;
        }

        .delay-300 {
          animation-delay: 300ms;
        }
      `}</style>
    </div>
  );
} 