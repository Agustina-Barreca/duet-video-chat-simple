
import { Clock, Wifi, Mic, MicOff, Video, VideoOff } from "lucide-react";
import { useState, useEffect } from "react";

interface CallHeaderProps {
  userName: string | null;
  isRemoteAudioActive?: boolean;
  isRemoteVideoActive?: boolean;
}

const CallHeader = ({ userName, isRemoteAudioActive = true, isRemoteVideoActive = true }: CallHeaderProps) => {
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-10 p-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-black/30 backdrop-blur-sm rounded-lg px-3 py-2">
            <Clock className="w-4 h-4 text-white" />
            <span className="text-white font-mono text-sm">{formatTime(callDuration)}</span>
          </div>
          <div className="flex items-center space-x-2 bg-black/30 backdrop-blur-sm rounded-lg px-3 py-2">
            <Wifi className="w-4 h-4 text-green-400" />
            <span className="text-white text-sm">Conectado</span>
          </div>
          {userName && (
            <div className="flex items-center space-x-2 bg-green-500/20 backdrop-blur-sm rounded-lg px-3 py-2 border border-green-500/30">
              <span className="text-green-400 text-sm font-medium">{userName}</span>
            </div>
          )}
        </div>
        
        <div className="text-right">
          <div className="flex items-center justify-end space-x-2 mb-2">
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-md ${isRemoteAudioActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {isRemoteAudioActive ? (
                <Mic className="w-3 h-3" />
              ) : (
                <MicOff className="w-3 h-3" />
              )}
              <span className="text-xs">{isRemoteAudioActive ? 'Audio' : 'Sin audio'}</span>
            </div>
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-md ${isRemoteVideoActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
              {isRemoteVideoActive ? (
                <Video className="w-3 h-3" />
              ) : (
                <VideoOff className="w-3 h-3" />
              )}
              <span className="text-xs">{isRemoteVideoActive ? 'Video' : 'Sin video'}</span>
            </div>
          </div>
          <h1 className="text-white text-lg font-semibold">Usuario Remoto</h1>
          <p className="text-gray-300 text-sm">En llamada</p>
        </div>
      </div>
    </div>
  );
};

export default CallHeader;
