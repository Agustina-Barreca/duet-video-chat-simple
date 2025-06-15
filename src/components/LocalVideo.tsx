
import { useState } from "react";
import { User, Move } from "lucide-react";

interface LocalVideoProps {
  isVideoOff: boolean;
}

const LocalVideo = ({ isVideoOff }: LocalVideoProps) => {
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    const startX = e.clientX - position.x;
    const startY = e.clientY - position.y;

    const handleMouseMove = (e: MouseEvent) => {
      const newX = Math.max(0, Math.min(window.innerWidth - 200, e.clientX - startX));
      const newY = Math.max(0, Math.min(window.innerHeight - 150, e.clientY - startY));
      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div
      className={`absolute z-20 w-48 h-36 rounded-xl overflow-hidden border-2 border-white/30 shadow-2xl cursor-move transition-transform hover:scale-105 ${
        isDragging ? 'scale-105' : ''
      }`}
      style={{ 
        right: `${position.x}px`,
        bottom: `${position.y}px`,
        transform: isDragging ? 'scale(1.05)' : 'scale(1)'
      }}
      onMouseDown={handleMouseDown}
    >
      {isVideoOff ? (
        <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <User className="w-6 h-6 text-white" />
            </div>
            <p className="text-white text-xs">Cámara off</p>
          </div>
        </div>
      ) : (
        <div className="w-full h-full relative">
          {/* Simulación de video local con gradiente diferente */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-500 via-blue-500 to-purple-500 opacity-90"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-2 border-2 border-white/50">
                <User className="w-6 h-6 text-white" />
              </div>
              <p className="text-white text-xs font-medium">Tú</p>
            </div>
          </div>
          
          {/* Indicador de que se puede arrastrar */}
          <div className="absolute top-2 right-2 opacity-0 hover:opacity-100 transition-opacity">
            <Move className="w-4 h-4 text-white/70" />
          </div>
        </div>
      )}
    </div>
  );
};

export default LocalVideo;
