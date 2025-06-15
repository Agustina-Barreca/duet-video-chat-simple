
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
    
    // Posición para el modo minimizado (esquina superior derecha, fuera del video remoto)
    const minSize = 60;
    const minX = window.innerWidth - minSize - margin;
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
