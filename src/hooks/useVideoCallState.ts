
import { useState, useEffect } from "react";

export const useVideoCallState = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isCallActive, setIsCallActive] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);
  const [showNameForm, setShowNameForm] = useState(true);
  
  // Estados para efectos de video
  const [isBlurEnabled, setIsBlurEnabled] = useState(false);
  const [currentBackground, setCurrentBackground] = useState<string | null>(null);
  
  // Estados simulados del usuario remoto
  const [isRemoteAudioActive, setIsRemoteAudioActive] = useState(true);
  const [isRemoteVideoActive, setIsRemoteVideoActive] = useState(true);

  // Simular cambios aleatorios en el estado del usuario remoto
  useEffect(() => {
    if (!isCallActive) return;

    const interval = setInterval(() => {
      // Cambiar estado de audio aleatoriamente cada 10-15 segundos
      if (Math.random() < 0.1) {
        setIsRemoteAudioActive(prev => !prev);
      }
      
      // Cambiar estado de video aleatoriamente cada 15-20 segundos
      if (Math.random() < 0.05) {
        setIsRemoteVideoActive(prev => !prev);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isCallActive]);

  const resetCallState = () => {
    setIsMuted(false);
    setIsVideoOff(false);
    setIsBlurEnabled(false);
    setCurrentBackground(null);
    setIsRemoteAudioActive(true);
    setIsRemoteVideoActive(true);
  };

  return {
    isMuted,
    setIsMuted,
    isVideoOff,
    setIsVideoOff,
    isCallActive,
    setIsCallActive,
    userName,
    setUserName,
    showNameForm,
    setShowNameForm,
    isBlurEnabled,
    setIsBlurEnabled,
    currentBackground,
    setCurrentBackground,
    isRemoteAudioActive,
    isRemoteVideoActive,
    resetCallState
  };
};
