import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import { User, Move, Minimize2, Maximize2 } from "lucide-react";

interface LocalVideoProps {
  isVideoOff: boolean;
  userName: string | null;
  isBlurEnabled?: boolean;
  currentBackground?: string | null;
}

const LocalVideo = ({ 
  isVideoOff, 
  userName, 
  isBlurEnabled = false, 
  currentBackground = null 
}: LocalVideoProps) => {
  // Estados locales que se sincronizan con los props
  const [isBlurEnabledState, setIsBlurEnabled] = useState(isBlurEnabled);
  const [currentBackgroundState, setCurrentBackground] = useState(currentBackground);
  const [isMinimized, setIsMinimized] = useState(false);

  // Sincronizar estados locales con props cuando cambien
  useEffect(() => {
    setIsBlurEnabled(isBlurEnabled);
    console.log('LocalVideo: Blur updated to:', isBlurEnabled);
  }, [isBlurEnabled]);

  useEffect(() => {
    setCurrentBackground(currentBackground);
    console.log('LocalVideo: Background updated to:', currentBackground);
  }, [currentBackground]);

  // Optimizar cálculos de posición inicial con useMemo
  const { videoWidth, videoHeight, initialX, initialY, minimizedSize, minimizedX, minimizedY } = useMemo(() => {
    const isMobile = window.innerWidth < 768;
    const width = isMobile ? 128 : 192;
    const height = isMobile ? 96 : 144;
    const margin = 16;
    const bottomOffset = isMobile ? 160 : 70;
    
    const x = Math.min(window.innerWidth - width - margin, window.innerWidth - width - margin);
    const y = window.innerHeight - height - bottomOffset;
    
    // Posición para el modo minimizado (esquina inferior derecha)
    const minSize = 60;
    const minX = window.innerWidth - minSize - margin;
    const minY = window.innerHeight - minSize - margin - 80; // 80px desde abajo para no interferir con controles
    
    return {
      videoWidth: width,
      videoHeight: height,
      initialX: x,
      initialY: y,
      minimizedSize: minSize,
      minimizedX: minX,
      minimizedY: minY
    };
  }, []);
  
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number }>({
    startX: 0,
    startY: 0,
    initialX: initialX,
    initialY: initialY
  });

  // Actualizar posición cuando se minimiza/maximiza
  useEffect(() => {
    if (isMinimized) {
      setPosition({ x: minimizedX, y: minimizedY });
    } else {
      setPosition({ x: initialX, y: initialY });
    }
  }, [isMinimized, minimizedX, minimizedY, initialX, initialY]);

  // Optimizar handlers con useCallback
  const updatePosition = useCallback((deltaX: number, deltaY: number) => {
    const currentWidth = isMinimized ? minimizedSize : videoWidth;
    const currentHeight = isMinimized ? minimizedSize : videoHeight;
    const newX = Math.max(0, Math.min(window.innerWidth - currentWidth, dragRef.current.initialX + deltaX));
    const newY = Math.max(0, Math.min(window.innerHeight - currentHeight, dragRef.current.initialY + deltaY));
    setPosition({ x: newX, y: newY });
  }, [videoWidth, videoHeight, minimizedSize, isMinimized]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
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
      updatePosition(deltaX, deltaY);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [position.x, position.y, updatePosition]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
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
      updatePosition(deltaX, deltaY);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);
  }, [position.x, position.y, updatePosition]);

  const handleMinimizeToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinimized(!isMinimized);
    console.log('Video local', !isMinimized ? 'minimizado' : 'expandido');
  }, [isMinimized]);

  const getVideoStyle = () => {
    let style: React.CSSProperties = {};
    
    if (isBlurEnabledState) {
      style.filter = 'blur(8px)';
      style.backdropFilter = 'blur(10px)';
    }
    
    if (currentBackgroundState) {
      style.backgroundImage = `url(${currentBackgroundState})`;
      style.backgroundSize = 'cover';
      style.backgroundPosition = 'center';
      style.backgroundRepeat = 'no-repeat';
    }
    
    return style;
  };

  const containerClasses = isMinimized 
    ? `fixed z-20 rounded-full overflow-hidden border-2 border-white/30 shadow-2xl cursor-pointer select-none transition-all duration-300 ${
        isDragging ? 'scale-105 shadow-3xl' : 'hover:scale-110'
      }`
    : `fixed z-20 w-32 h-24 md:w-48 md:h-36 rounded-xl overflow-hidden border-2 border-white/30 shadow-2xl cursor-move select-none transition-all duration-300 group ${
        isDragging ? 'scale-105 shadow-3xl' : 'hover:scale-105'
      }`;

  const containerStyle = isMinimized 
    ? { 
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${minimizedSize}px`,
        height: `${minimizedSize}px`,
        touchAction: 'none',
        willChange: isDragging ? 'transform' : 'auto'
      }
    : { 
        left: `${position.x}px`,
        top: `${position.y}px`,
        touchAction: 'none',
        willChange: isDragging ? 'transform' : 'auto'
      };

  return (
    <div
      className={containerClasses}
      style={containerStyle}
      onMouseDown={isMinimized ? handleMinimizeToggle : handleMouseDown}
      onTouchStart={isMinimized ? undefined : handleTouchStart}
      onClick={isMinimized ? handleMinimizeToggle : undefined}
    >
      {isMinimized ? (
        // Modo minimizado - solo mostrar avatar pequeño
        <div className="w-full h-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center">
          <User className="w-6 h-6 text-white" />
        </div>
      ) : (
        // Modo normal
        <>
          {isVideoOff ? (
            <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center relative">
              <div className="text-center">
                <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto">
                  <User className="w-4 h-4 md:w-6 md:h-6 text-white" />
                </div>
                {userName && (
                  <p className="text-white text-[10px] md:text-xs font-medium mt-1 md:mt-2">{userName}</p>
                )}
              </div>
            </div>
          ) : (
            <div className="w-full h-full relative" style={getVideoStyle()}>
              {/* Overlay con efectos aplicados */}
              <div className={`absolute inset-0 ${currentBackgroundState ? 'bg-black/20' : 'bg-gradient-to-br from-green-500 via-blue-500 to-purple-500'} ${currentBackgroundState ? '' : 'opacity-90'}`}></div>
              
              {/* Nombre del usuario en la esquina inferior izquierda cuando el video está activado */}
              {userName && (
                <div className="absolute bottom-1 left-1 md:bottom-2 md:left-2 bg-black/50 backdrop-blur-sm px-1.5 py-0.5 md:px-2 md:py-1 rounded text-white text-[10px] md:text-xs font-medium">
                  {userName}
                </div>
              )}
            </div>
          )}
          
          {/* Botón de minimizar en la esquina superior derecha - visible en hover del contenedor */}
          <button
            onClick={handleMinimizeToggle}
            className="absolute top-1 right-1 md:top-2 md:right-2 w-6 h-6 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
          >
            <Minimize2 className="w-3 h-3 text-white" />
          </button>
          
          {/* Icono de mover */}
          <div className="absolute top-1 left-1 md:top-2 md:left-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Move className="w-3 h-3 md:w-4 md:h-4 text-white/70" />
          </div>
        </>
      )}
    </div>
  );
};

export default LocalVideo;
