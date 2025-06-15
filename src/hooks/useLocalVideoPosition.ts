
import { useState, useEffect, useMemo } from "react";

export const useLocalVideoPosition = (isMinimized: boolean) => {
  // Optimizar cálculos de posición inicial con useMemo
  const { videoWidth, videoHeight, initialX, initialY, minimizedSize, minimizedX, minimizedY } = useMemo(() => {
    const isMobile = window.innerWidth < 768;
    const width = isMobile ? 128 : 192;
    const height = isMobile ? 96 : 144;
    const margin = 16;
    const bottomOffset = isMobile ? 160 : 70;
    
    const x = Math.min(window.innerWidth - width - margin, window.innerWidth - width - margin);
    const y = window.innerHeight - height - bottomOffset;
    
    // Posición para el modo minimizado (esquina superior derecha, pero alejado del selector de tema)
    const minSize = 60;
    // Dejamos más espacio a la derecha para el selector de tema (aprox 120px + margen)
    const minX = window.innerWidth - minSize - margin - 140; // Ajustado para evitar superposición
    const minY = margin + 80; // Debajo del header
    
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

  // Actualizar posición cuando se minimiza/maximiza
  useEffect(() => {
    if (isMinimized) {
      setPosition({ x: minimizedX, y: minimizedY });
    } else {
      setPosition({ x: initialX, y: initialY });
    }
  }, [isMinimized, minimizedX, minimizedY, initialX, initialY]);

  return {
    position,
    setPosition,
    videoWidth,
    videoHeight,
    minimizedSize,
    initialProperties: { initialX, initialY }
  };
};
