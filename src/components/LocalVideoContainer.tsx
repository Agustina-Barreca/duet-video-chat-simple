
import { useState, useCallback } from "react";
import { Minimize2 } from "lucide-react";
import LocalVideoContent from "./LocalVideoContent";
import { useLocalVideoPosition } from "../hooks/useLocalVideoPosition";
import { useLocalVideoDrag } from "../hooks/useLocalVideoDrag";
import { useLocalVideoResize } from "../hooks/useLocalVideoResize";

interface LocalVideoContainerProps {
  isVideoOff: boolean;
  userName: string | null;
  isBlurEnabled: boolean;
  currentBackground: string | null;
}

const LocalVideoContainer = ({
  isVideoOff,
  userName,
  isBlurEnabled,
  currentBackground
}: LocalVideoContainerProps) => {
  const [isMinimized, setIsMinimized] = useState(false);
  
  const {
    position,
    setPosition,
    videoWidth,
    videoHeight,
    minimizedSize
  } = useLocalVideoPosition(isMinimized);

  const {
    size,
    isResizing,
    handleResizeMouseDown
  } = useLocalVideoResize({
    isMinimized,
    videoWidth,
    videoHeight,
    minimizedSize,
    position,
    setPosition
  });

  const {
    isDragging,
    hasDragged,
    setHasDragged,
    handleMouseDown,
    handleTouchStart
  } = useLocalVideoDrag({
    position,
    setPosition,
    videoWidth: size.width,
    videoHeight: size.height,
    minimizedSize,
    isMinimized
  });

  const handleMinimizeToggle = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMinimized(!isMinimized);
    console.log('Video local', !isMinimized ? 'minimizado' : 'expandido');
  }, [isMinimized]);

  const handleMinimizedClick = useCallback((e: React.MouseEvent) => {
    // Solo expandir si no se ha arrastrado
    if (!hasDragged) {
      handleMinimizeToggle(e);
    }
    setHasDragged(false);
  }, [hasDragged, handleMinimizeToggle, setHasDragged]);

  const containerClasses = isMinimized 
    ? `fixed z-20 rounded-full overflow-hidden border-2 border-white/30 shadow-2xl cursor-pointer select-none transition-all duration-300 ${
        isDragging ? 'scale-105 shadow-3xl' : 'hover:scale-110'
      }`
    : `fixed z-20 rounded-xl overflow-hidden border-2 border-white/30 shadow-2xl cursor-move select-none transition-all duration-300 group ${
        isDragging || isResizing ? 'scale-105 shadow-3xl' : 'hover:scale-105'
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
        width: `${size.width}px`,
        height: `${size.height}px`,
        touchAction: 'none',
        willChange: isDragging || isResizing ? 'transform' : 'auto',
        cursor: isDragging ? 'grabbing' : isResizing ? 'default' : 'grab'
      };

  return (
    <div
      className={containerClasses}
      style={containerStyle}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onClick={isMinimized ? handleMinimizedClick : undefined}
    >
      {/* Resize handles en las cuatro esquinas - solo visible cuando no está minimizado */}
      {!isMinimized && (
        <>
          {/* Esquina superior izquierda */}
          <div 
            className="absolute top-0 left-0 w-4 h-4 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity cursor-nw-resize z-10 rounded-br-lg"
            onMouseDown={(e) => handleResizeMouseDown(e, 'nw')}
          >
            <div className="absolute top-0.5 left-0.5 w-1.5 h-1.5 bg-white/40 rounded-full"></div>
          </div>

          {/* Esquina superior derecha */}
          <div 
            className="absolute top-0 right-0 w-4 h-4 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity cursor-ne-resize z-10 rounded-bl-lg"
            onMouseDown={(e) => handleResizeMouseDown(e, 'ne')}
          >
            <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-white/40 rounded-full"></div>
          </div>

          {/* Esquina inferior izquierda */}
          <div 
            className="absolute bottom-0 left-0 w-4 h-4 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity cursor-sw-resize z-10 rounded-tr-lg"
            onMouseDown={(e) => handleResizeMouseDown(e, 'sw')}
          >
            <div className="absolute bottom-0.5 left-0.5 w-1.5 h-1.5 bg-white/40 rounded-full"></div>
          </div>

          {/* Esquina inferior derecha */}
          <div 
            className="absolute bottom-0 right-0 w-4 h-4 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity cursor-se-resize z-10 rounded-tl-lg"
            onMouseDown={(e) => handleResizeMouseDown(e, 'se')}
          >
            <div className="absolute bottom-0.5 right-0.5 w-1.5 h-1.5 bg-white/40 rounded-full"></div>
          </div>
        </>
      )}

      <LocalVideoContent
        isVideoOff={isVideoOff}
        userName={userName}
        isBlurEnabled={isBlurEnabled}
        currentBackground={currentBackground}
        isMinimized={isMinimized}
      />
      
      {/* Botón de minimizar en la esquina superior derecha - visible en hover del contenedor */}
      {!isMinimized && (
        <button
          onClick={handleMinimizeToggle}
          className="absolute top-1 right-1 md:top-2 md:right-2 w-6 h-6 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-20"
        >
          <Minimize2 className="w-3 h-3 text-white" />
        </button>
      )}
    </div>
  );
};

export default LocalVideoContainer;
