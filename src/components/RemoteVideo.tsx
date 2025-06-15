
import { User } from "lucide-react";

interface RemoteVideoProps {
  isVideoOff: boolean;
}

const RemoteVideo = ({ isVideoOff }: RemoteVideoProps) => {
  return (
    <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900">
      {isVideoOff ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-16 h-16 text-white" />
            </div>
            <h3 className="text-2xl font-semibold text-white">Usuario Remoto</h3>
          </div>
        </div>
      ) : (
        <div className="w-full h-full relative overflow-hidden rounded-lg">
          {/* Simulación de video con gradiente animado */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 opacity-80 animate-pulse"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-32 h-32 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white/30">
                <User className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white mb-2">Usuario Remoto</h3>
              <p className="text-white/80">Video simulado</p>
            </div>
          </div>
          
          {/* Efecto de brillo para simular movimiento */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 animate-[slide_3s_ease-in-out_infinite]"></div>
        </div>
      )}
    </div>
  );
};

export default RemoteVideo;
