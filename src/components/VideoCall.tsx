import { useState, useEffect } from "react";
import RemoteVideo from "./RemoteVideo";
import LocalVideo from "./LocalVideo";
import CallControls from "./CallControls";
import CallHeader from "./CallHeader";
import NameForm from "./NameForm";
import ThemeSelector from "./ThemeSelector";
import FloatingChat from "./FloatingChat";
import { useTheme } from "../contexts/ThemeContext";

const VideoCall = () => {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isCallActive, setIsCallActive] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);
  const [showNameForm, setShowNameForm] = useState(true);
  
  // Estados para el flujo de validación de la API
  const [isValidatingAccess, setIsValidatingAccess] = useState(false);
  const [accessValidationError, setAccessValidationError] = useState<string | null>(null);
  
  // Nuevos estados para efectos de video
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

  // Función de validación de acceso a la API (aquí integrarías tu API real)
  const handleAccessValidation = async (userData: {
    name: string;
    startWithVideo: boolean;
    startWithAudio: boolean;
    initialBlurEnabled: boolean;
    initialBackground: string | null;
  }): Promise<boolean> => {
    setIsValidatingAccess(true);
    setAccessValidationError(null);

    try {
      console.log('Validando acceso a la videollamada para:', userData);
      
      // Aquí es donde integrarás tu API real
      // Simulación de delay para mostrar el estado de carga
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // SIMULACIÓN: Cambiar esta lógica por tu llamada real a la API
      const hasAccess = Math.random() > 0.3; // 70% de probabilidad de éxito
      
      if (hasAccess) {
        console.log('✅ Acceso concedido a la videollamada');
        return true;
      } else {
        setAccessValidationError('No tienes permisos para unirte a esta videollamada en este momento. Por favor, contacta al administrador.');
        console.log('❌ Acceso denegado');
        return false;
      }
    } catch (error) {
      console.error('Error al validar acceso:', error);
      setAccessValidationError('Error de conexión con el servidor. Por favor, verifica tu conexión a internet e inténtalo de nuevo.');
      return false;
    } finally {
      setIsValidatingAccess(false);
    }
  };

  const handleNameSubmit = (
    name: string, 
    startWithVideo: boolean, 
    startWithAudio: boolean,
    initialBlurEnabled: boolean,
    initialBackground: string | null
  ) => {
    console.log('✅ Acceso aprobado. Iniciando videollamada...');
    setUserName(name);
    setShowNameForm(false);
    // Configurar estados iniciales basados en las preferencias del usuario
    setIsVideoOff(!startWithVideo);
    setIsMuted(!startWithAudio);
    setIsBlurEnabled(initialBlurEnabled);
    setCurrentBackground(initialBackground);
    console.log(`Llamada iniciada - Video: ${startWithVideo ? 'activado' : 'desactivado'}, Audio: ${startWithAudio ? 'activado' : 'silenciado'}, Blur: ${initialBlurEnabled ? 'activado' : 'desactivado'}, Background: ${initialBackground || 'ninguno'}`);
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    // Aquí iría la lógica para terminar la llamada
    console.log("Llamada terminada");
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    console.log("Audio", isMuted ? "activado" : "silenciado");
  };

  const toggleVideo = () => {
    setIsVideoOff(!isVideoOff);
    console.log("Video", isVideoOff ? "activado" : "desactivado");
  };

  const toggleBlur = () => {
    setIsBlurEnabled(!isBlurEnabled);
    // Si se activa el blur, desactivar el fondo personalizado
    if (!isBlurEnabled) {
      setCurrentBackground(null);
    }
    console.log("Blur background:", !isBlurEnabled ? "activado" : "desactivado");
  };

  const handleBackgroundChange = (background: string | null) => {
    setCurrentBackground(background);
    // Si se selecciona un fondo personalizado, desactivar el blur
    if (background) {
      setIsBlurEnabled(false);
    }
    console.log('Background changed to:', background || 'none');
  };

  const startNewCall = () => {
    setIsCallActive(true);
    setShowNameForm(true);
    setUserName(null);
    // Resetear todos los estados a sus valores por defecto
    setIsMuted(false);
    setIsVideoOff(false);
    setIsBlurEnabled(false);
    setCurrentBackground(null);
    setIsRemoteAudioActive(true);
    setIsRemoteVideoActive(true);
    // Resetear estados de validación
    setIsValidatingAccess(false);
    setAccessValidationError(null);
  };

  // Mostrar formulario de nombre si no se ha ingresado
  if (showNameForm) {
    return (
      <NameForm 
        onSubmit={handleNameSubmit}
        onValidationRequired={handleAccessValidation}
        isValidating={isValidatingAccess}
        validationError={accessValidationError}
      />
    );
  }

  if (!isCallActive) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${themeClasses.background}`}>
        <div className="text-center">
          <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-8 h-8 bg-white rounded-sm"></div>
          </div>
          <h2 className={`text-2xl font-semibold mb-2 ${themeClasses.textPrimary}`}>Llamada terminada</h2>
          <p className={`mb-2 ${themeClasses.textSecondary}`}>La videollamada ha finalizado</p>
          <p className={`text-sm mb-6 ${themeClasses.textSecondary}`}>Hasta luego, {userName}</p>
          <button 
            onClick={startNewCall}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Iniciar nueva llamada
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative min-h-screen overflow-hidden ${themeClasses.background}`}>
      <ThemeSelector />
      
      <CallHeader 
        userName={userName} 
        isRemoteAudioActive={isRemoteAudioActive}
        isRemoteVideoActive={isRemoteVideoActive}
      />
      
      {/* Video principal (remoto) - con z-index bajo para evitar superposiciones */}
      <div className="relative z-0">
        <RemoteVideo isVideoOff={!isRemoteVideoActive} />
      </div>
      
      {/* Video local flotante - con z-index medio */}
      <div className="relative z-10">
        <LocalVideo 
          isVideoOff={isVideoOff} 
          userName={userName}
          isBlurEnabled={isBlurEnabled}
          currentBackground={currentBackground}
        />
      </div>
      
      {/* Controles de llamada - con z-index alto para estar siempre visibles */}
      <div className="relative z-20">
        <CallControls 
          isMuted={isMuted}
          isVideoOff={isVideoOff}
          onToggleMute={toggleMute}
          onToggleVideo={toggleVideo}
          onEndCall={handleEndCall}
          isBlurEnabled={isBlurEnabled}
          currentBackground={currentBackground}
          onToggleBlur={toggleBlur}
          onBackgroundChange={handleBackgroundChange}
        />
      </div>
      
      {/* Chat flotante */}
      <FloatingChat />
    </div>
  );
};

export default VideoCall;
