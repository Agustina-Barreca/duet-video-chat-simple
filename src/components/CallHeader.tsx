
import { Clock, Wifi } from "lucide-react";
import { useState, useEffect } from "react";

const CallHeader = () => {
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
        </div>
        
        <div className="text-right">
          <h1 className="text-white text-lg font-semibold">Usuario Remoto</h1>
          <p className="text-gray-300 text-sm">En llamada</p>
        </div>
      </div>
    </div>
  );
};

export default CallHeader;
