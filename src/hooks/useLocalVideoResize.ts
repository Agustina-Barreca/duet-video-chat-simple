
import { useState, useRef, useEffect } from "react";

interface ResizeHookProps {
  isMinimized: boolean;
  videoWidth: number;
  videoHeight: number;
  minimizedSize: number;
  position: { x: number; y: number };
  setPosition: (pos: { x: number; y: number }) => void;
}

export const useLocalVideoResize = ({
  isMinimized,
  videoWidth,
  videoHeight,
  minimizedSize,
  position,
  setPosition
}: ResizeHookProps) => {
  const [size, setSize] = useState({ width: videoWidth, height: videoHeight });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string>('');
  const startSizeRef = useRef({ width: 0, height: 0 });
  const startMouseRef = useRef({ x: 0, y: 0 });
  const startPositionRef = useRef({ x: 0, y: 0 });

  // Update size when minimized state changes
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
    startPositionRef.current = { x: position.x, y: position.y };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || isMinimized) return;

      const deltaX = e.clientX - startMouseRef.current.x;
      const deltaY = e.clientY - startMouseRef.current.y;

      let newWidth = startSizeRef.current.width;
      let newHeight = startSizeRef.current.height;
      let newX = startPositionRef.current.x;
      let newY = startPositionRef.current.y;

      // Calculate new dimensions and position based on resize direction
      switch (resizeDirection) {
        case 'se': // Esquina inferior derecha
          newWidth += deltaX;
          newHeight += deltaY;
          break;
        case 'sw': // Esquina inferior izquierda
          newWidth -= deltaX;
          newHeight += deltaY;
          newX += deltaX;
          break;
        case 'ne': // Esquina superior derecha
          newWidth += deltaX;
          newHeight -= deltaY;
          newY += deltaY;
          break;
        case 'nw': // Esquina superior izquierda
          newWidth -= deltaX;
          newHeight -= deltaY;
          newX += deltaX;
          newY += deltaY;
          break;
      }

      // Apply size limits
      const minWidth = 128;
      const minHeight = 96;
      const maxWidth = 400;
      const maxHeight = 300;

      newWidth = Math.max(minWidth, Math.min(maxWidth, newWidth));
      newHeight = Math.max(minHeight, Math.min(maxHeight, newHeight));

      // Validate viewport limits and adjust position if necessary
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // Ajustar posición para mantener el video dentro del viewport
      if (newX < 0) {
        // Si se sale por la izquierda, ajustar el ancho también
        if (resizeDirection === 'sw' || resizeDirection === 'nw') {
          newWidth += newX;
        }
        newX = 0;
      }
      
      if (newY < 0) {
        // Si se sale por arriba, ajustar la altura también
        if (resizeDirection === 'ne' || resizeDirection === 'nw') {
          newHeight += newY;
        }
        newY = 0;
      }
      
      if (newX + newWidth > viewportWidth) {
        if (resizeDirection === 'se' || resizeDirection === 'ne') {
          newWidth = viewportWidth - newX;
        } else {
          newX = viewportWidth - newWidth;
        }
      }
      
      if (newY + newHeight > viewportHeight) {
        if (resizeDirection === 'se' || resizeDirection === 'sw') {
          newHeight = viewportHeight - newY;
        } else {
          newY = viewportHeight - newHeight;
        }
      }

      // Aplicar límites mínimos finales después de ajustes del viewport
      newWidth = Math.max(minWidth, newWidth);
      newHeight = Math.max(minHeight, newHeight);

      setSize({ width: newWidth, height: newHeight });
      setPosition({ x: newX, y: newY });
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
  }, [isResizing, resizeDirection, isMinimized, position, setPosition]);

  return {
    size,
    isResizing,
    handleResizeMouseDown
  };
};
