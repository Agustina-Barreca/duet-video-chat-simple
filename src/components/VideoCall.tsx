
import { useState } from "react";
import RemoteVideo from "./RemoteVideo";
import LocalVideo from "./LocalVideo";
import CallControls from "./CallControls";
import CallHeader from "./CallHeader";
import NameForm from "./NameForm";

const VideoCall = () => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isCallActive, setIsCallActive] = useState(true);
  const [userName, setUserName] = useState<string | null>(null);
  const [showNameForm, setShowNameForm] = useState(true);

  const handleNameSubmit = (name: string) => {
    setUserName(name);
    setShowNameForm(false);
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

  const startNewCall = () => {
    setIsCallActive(true);
    setShowNameForm(true);
    setUserName(null);
  };

  // Mostrar formulario de nombre si no se ha ingresado
  if (showNameForm) {
    return <NameForm onSubmit={handleNameSubmit} />;
  }

  if (!isCallActive) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <div className="w-8 h-8 bg-white rounded-sm"></div>
          </div>
          <h2 className="text-2xl font-semibold text-white mb-2">Llamada terminada</h2>
          <p className="text-gray-300 mb-2">La videollamada ha finalizado</p>
          <p className="text-gray-400 text-sm mb-6">Hasta luego, {userName}</p>
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
    <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      <CallHeader userName={userName} />
      
      {/* Video principal (remoto) */}
      <RemoteVideo isVideoOff={false} />
      
      {/* Video local flotante */}
      <LocalVideo isVideoOff={isVideoOff} userName={userName} />
      
      {/* Controles de llamada */}
      <CallControls 
        isMuted={isMuted}
        isVideoOff={isVideoOff}
        onToggleMute={toggleMute}
        onToggleVideo={toggleVideo}
        onEndCall={handleEndCall}
      />
    </div>
  );
};

export default VideoCall;
