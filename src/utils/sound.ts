export const playSound = (soundPath: string, volume: number = 0.3) => {
  const isMuted = localStorage.getItem('soundMuted') === 'true';
  if (isMuted) return Promise.resolve();

  const audio = new Audio(soundPath);
  audio.volume = volume;
  return audio.play().catch(error => {
    console.log("Erro ao reproduzir som:", error);
  });
}; 