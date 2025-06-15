import { useState, useRef, useCallback, useMemo } from "react";
import { User, Move } from "lucide-react";
import LocalVideoControls from "./LocalVideoControls";

interface LocalVideoProps {
  isVideoOff: boolean;
  userName: string | null;
}

const LocalVideo = ({ isVideoOff, userName }: LocalVideoProps) => {
  const [isBlurEnabled, setIsBlurEnabled] = useState(false);
  const [currentBackground, setCurrentBackground] = useState<string | null>(null);

  // Optimizar cálculos de posición inicial con useMemo
  const { videoWidth, videoHeight, initialX, initialY } = useMemo(() => {
    const isMobile = window.innerWidth < 768;
    const width = isMobile ? 128 : 192;
    const height = isMobile ? 96 : 144;
    const margin = 16; // Reducir margen para mejor posicionamiento
    const bottomOffset = isMobile ? 160 : 70;
    
    // Asegurar que el video no se salga de la pantalla
    const x = Math.min(window.innerWidth - width - margin, window.innerWidth - width - margin);
    const y = window.innerHeight - height - bottomOffset;
    
    return {
      videoWidth: width,
      videoHeight: height,
      initialX: x,
      initialY: y
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

  // Optimizar handlers con useCallback
  const updatePosition = useCallback((deltaX: number, deltaY: number) => {
    const newX = Math.max(0, Math.min(window.innerWidth - videoWidth, dragRef.current.initialX + deltaX));
    const newY = Math.max(0, Math.min(window.innerHeight - videoHeight, dragRef.current.initialY + deltaY));
    setPosition({ x: newX, y: newY });
  }, [videoWidth, videoHeight]);

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

  const handleBlurToggle = useCallback((enabled: boolean) => {
    setIsBlurEnabled(enabled);
    console.log('Blur background:', enabled ? 'activado' : 'desactivado');
  }, []);

  const handleBackgroundChange = useCallback((background: string | null) => {
    setCurrentBackground(background);
    // Si se selecciona un fondo personalizado, desactivar el blur
    if (background) {
      setIsBlurEnabled(false);
    }
    console.log('Background changed to:', background || 'none');
  }, []);

  const getVideoStyle = () => {
    let style: React.CSSProperties = {};
    
    if (isBlurEnabled) {
      style.filter = 'blur(8px)';
      style.backdropFilter = 'blur(10px)';
    }
    
    if (currentBackground) {
      style.backgroundImage = `url(${currentBackground})`;
      style.backgroundSize = 'cover';
      style.backgroundPosition = 'center';
    }
    
    return style;
  };

  return (
    <div
      className={`fixed z-20 w-32 h-24 md:w-48 md:h-36 rounded-xl overflow-hidden border-2 border-white/30 shadow-2xl cursor-move select-none ${
        isDragging ? 'scale-105 shadow-3xl' : 'hover:scale-105 transition-transform'
      }`}
      style={{ 
        left: `${position.x}px`,
        top: `${position.y}px`,
        touchAction: 'none',
        willChange: isDragging ? 'transform' : 'auto'
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {isVideoOff ? (
        <div className="w-full h-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center relative">
          <LocalVideoControls
            onBlurToggle={handleBlurToggle}
            onBackgroundChange={handleBackgroundChange}
            isBlurEnabled={isBlurEnabled}
            currentBackground={currentBackground}
          />
          <div className="text-center">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-1 md:mb-2">
              <User className="w-4 h-4 md:w-6 md:h-6 text-white" />
            </div>
            <p className="text-white text-[10px] md:text-xs">Cámara off</p>
            {userName && (
              <p className="text-white text-[10px] md:text-xs font-medium mt-1">{userName}</p>
            )}
          </div>
        </div>
      ) : (
        <div className="w-full h-full relative" style={getVideoStyle()}>
          <LocalVideoControls
            onBlurToggle={handleBlurToggle}
            onBackgroundChange={handleBackgroundChange}
            isBlurEnabled={isBlurEnabled}
            currentBackground={currentBackground}
          />
          
          {/* Overlay con efectos aplicados */}
          <div className={`absolute inset-0 ${currentBackground ? 'bg-black/20' : 'bg-gradient-to-br from-green-500 via-blue-500 to-purple-500'} ${currentBackground ? '' : 'opacity-90'}`}></div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 md:w-12 md:h-12 bg-white/30 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-1 md:mb-2 border-2 border-white/50">
                <User className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </div>
              <p className="text-white text-[10px] md:text-xs font-medium">{userName || "Tú"}</p>
            </div>
          </div>
          
          <div className="absolute top-1 right-1 md:top-2 md:right-2 opacity-0 hover:opacity-100 transition-opacity">
            <Move className="w-3 h-3 md:w-4 md:h-4 text-white/70" />
          </div>
        </div>
      )}
    </div>
  );
};

export default LocalVideo;
