"use client";

export const useSound = () => {
  const playSound = (soundName: string) => {
    const isMuted = localStorage.getItem('soundMuted') === 'true';
    if (isMuted) return;

    const soundPaths: { [key: string]: string } = {
      hover: '/assets/toinn.mp3',
      success: '/assets/papagaio.mp3'
    };

    const audio = new Audio(soundPaths[soundName]);
    audio.volume = 0.3;
    audio.play().catch(error => {
      console.log("Erro ao reproduzir som:", error);
    });
  };

  return {
    playHover: () => playSound("hover"),
    playSuccess: () => playSound("success")
  };
}; 