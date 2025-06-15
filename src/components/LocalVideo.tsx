import { useState, useRef } from "react";
import { User, Move } from "lucide-react";

interface LocalVideoProps {
  isVideoOff: boolean;
  userName: string | null;
}

const LocalVideo = ({ isVideoOff, userName }: LocalVideoProps) => {
  // Calcular posición inicial - bien arriba de los controles remotos
  const isMobile = window.innerWidth < 768;
  const videoWidth = isMobile ? 128 : 192; // w-32 = 128px, w-48 = 192px
  const videoHeight = isMobile ? 96 : 144; // h-24 = 96px, h-36 = 144px
  const margin = 20;
  // Aumentar significativamente el espacio desde abajo para evitar controles
  const bottomOffset = isMobile ? 180 : 80; // Mucho más espacio en móviles
  
  const initialX = window.innerWidth - videoWidth - margin;
  const initialY = window.innerHeight - videoHeight - bottomOffset;
  
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number }>({
    startX: 0,
    startY: 0,
    initialX: initialX,
    initialY: initialY
  });

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y
    };

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragRef.current.startX;
      const deltaY = e.clientY - dragRef.current.startY;
      
      const newX = Math.max(0, Math.min(window.innerWidth - videoWidth, dragRef.current.initialX + deltaX));
      const newY = Math.max(0, Math.min(window.innerHeight - videoHeight, dragRef.current.initialY + deltaY));
      
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

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    setIsDragging(true);
    
    const touch = e.touches[0];
    dragRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      initialX: position.x,
      initialY: position.y
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const deltaX = touch.clientX - dragRef.current.startX;
      const deltaY = touch.clientY - dragRef.current.startY;
      
      const newX = Math.max(0, Math.min(window.innerWidth - videoWidth, dragRef.current.initialX + deltaX));
      const newY = Math.max(0, Math.min(window.innerHeight - videoHeight, dragRef.current.initialY + deltaY));
      
      setPosition({ x: newX, y: newY });
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  };

  return (
    <div
      className={`fixed z-20 w-48 h-36 md:w-48 md:h-36 sm:w-32 sm:h-24 rounded-xl overflow-hidden border-2 border-white/30 shadow-2xl cursor-move transition-transform hover:scale-105 ${
        isDragging ? 'scale-105 shadow-3xl' : ''
      }`}
      style={{ 
        left: `${position.x}px`,
        top: `${position.y}px`,
        userSelect: 'none',
        touchAction: 'none'
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {isVideoOff ? (
        <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 sm:w-8 sm:h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <User className="w-6 h-6 sm:w-4 sm:h-4 text-white" />
            </div>
            <p className="text-white text-xs sm:text-[10px]">Cámara off</p>
            {userName && (
              <p className="text-white text-xs sm:text-[10px] font-medium mt-1">{userName}</p>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full h-full relative">
          {/* Simulación de video local con gradiente diferente */}
          <div className="absolute inset-0 bg-gradient-to-br from-green-500 via-blue-500 to-purple-500 opacity-90"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-12 h-12 sm:w-8 sm:h-8 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-2 border-2 border-white/50">
                <User className="w-6 h-6 sm:w-4 sm:h-4 text-white" />
              </div>
              <p className="text-white text-xs sm:text-[10px] font-medium">{userName || "Tú"}</p>
            </div>
          </div>
          
          {/* Indicador de que se puede arrastrar */}
          <div className="absolute top-2 right-2 opacity-0 hover:opacity-100 transition-opacity">
            <Move className="w-4 h-4 sm:w-3 sm:h-3 text-white/70" />
          </div>
        </div>
      )}
    </div>
  );
};

export default LocalVideo;
