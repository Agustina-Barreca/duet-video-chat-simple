
import { useState, useRef, useEffect } from "react";

interface ResizeHookProps {
  isMinimized: boolean;
  videoWidth: number;
  videoHeight: number;
  minimizedSize: number;
}

export const useLocalVideoResize = ({
  isMinimized,
  videoWidth,
  videoHeight,
  minimizedSize
}: ResizeHookProps) => {
  const [size, setSize] = useState({ width: videoWidth, height: videoHeight });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string>('');
  const startSizeRef = useRef({ width: 0, height: 0 });
  const startMouseRef = useRef({ x: 0, y: 0 });

  // Actualizar tamaño cuando cambia el estado minimizado
  useEffect(() => {
    if (isMinimized) {
      setSize({ width: minimizedSize, height: minimizedSize });
    } else {
      setSize({ width: videoWidth, height: videoHeight });
    }
  }, [isMinimized, videoWidth, videoHeight, minimizedSize]);

  const handleResizeMouseDown = (e: React.MouseEvent, direction: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeDirection(direction);
    startSizeRef.current = { width: size.width, height: size.height };
    startMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || isMinimized) return;

      const deltaX = e.clientX - startMouseRef.current.x;
      const deltaY = e.clientY - startMouseRef.current.y;

      let newWidth = startSizeRef.current.width;
      let newHeight = startSizeRef.current.height;

      // Calcular nuevas dimensiones basado en la dirección del redimensionado
      switch (resizeDirection) {
        case 'se': // Esquina inferior derecha
          newWidth += deltaX;
          newHeight += deltaY;
          break;
        case 'sw': // Esquina inferior izquierda
          newWidth -= deltaX;
          newHeight += deltaY;
          break;
        case 'ne': // Esquina superior derecha
          newWidth += deltaX;
          newHeight -= deltaY;
          break;
        case 'nw': // Esquina superior izquierda
          newWidth -= deltaX;
          newHeight -= deltaY;
          break;
      }

      // Aplicar límites para video local
      const minWidth = 128;
      const minHeight = 96;
      const maxWidth = 400;
      const maxHeight = 300;

      newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
      newHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));

      setSize({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeDirection('');
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, resizeDirection, isMinimized]);

  return {
    size,
    isResizing,
    handleResizeMouseDown
  };
};
