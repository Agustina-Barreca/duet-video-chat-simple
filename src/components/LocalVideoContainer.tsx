
import { useState, useCallback } from "react";
import { Minimize2 } from "lucide-react";
import LocalVideoContent from "./LocalVideoContent";
import { useLocalVideoPosition } from "../hooks/useLocalVideoPosition";
import { useLocalVideoDrag } from "../hooks/useLocalVideoDrag";

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
    isDragging,
    hasDragged,
    setHasDragged,
    handleMouseDown,
    handleTouchStart
  } = useLocalVideoDrag({
    position,
    setPosition,
    videoWidth,
    videoHeight,
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
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onClick={isMinimized ? handleMinimizedClick : undefined}
    >
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
          className="absolute top-1 right-1 md:top-2 md:right-2 w-6 h-6 bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          <Minimize2 className="w-3 h-3 text-white" />
        </button>
      )}
    </div>
  );
};

export default LocalVideoContainer;
