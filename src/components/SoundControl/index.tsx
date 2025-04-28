"use client";

import { useState } from 'react';
import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa';

export default function SoundControl() {
  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // Armazena a preferência do usuário
    localStorage.setItem('soundMuted', (!isMuted).toString());
  };

  return (
    <button
      onClick={toggleMute}
      className="fixed bottom-4 right-4 z-50 p-3 bg-gray-800/80 rounded-full hover:bg-gray-700/80 transition-all duration-300 text-amber-500 hover:text-amber-400"
      title={isMuted ? "Ativar sons" : "Desativar sons"}
    >
      {isMuted ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
    </button>
  );
} 