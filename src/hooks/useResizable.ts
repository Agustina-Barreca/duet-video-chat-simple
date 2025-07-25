
import { useState, useRef, useEffect } from 'react';

interface Size {
  width: number;
  height: number;
}

interface Position {
  x: number;
  y: number;
}

type ResizeHandle = 'se' | 'sw' | 'ne' | 'nw';

export const useResizable = (initialSize: Size, minSize: Size, position?: Position) => {
  const [size, setSize] = useState<Size>(initialSize);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<ResizeHandle | null>(null);
  const resizeRef = useRef<HTMLDivElement>(null);
  const startPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const startSize = useRef<Size>({ width: 0, height: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !resizeHandle || !position) return;

      const deltaX = e.clientX - startPos.current.x;
      const deltaY = e.clientY - startPos.current.y;

      let newWidth = startSize.current.width;
      let newHeight = startSize.current.height;

      // Calculate new dimensions according to handle
      switch (resizeHandle) {
        case 'se':
          newWidth = startSize.current.width + deltaX;
          newHeight = startSize.current.height + deltaY;
          break;
        case 'sw':
          newWidth = startSize.current.width - deltaX;
          newHeight = startSize.current.height + deltaY;
          break;
        case 'ne':
          newWidth = startSize.current.width + deltaX;
          newHeight = startSize.current.height - deltaY;
          break;
        case 'nw':
          newWidth = startSize.current.width - deltaX;
          newHeight = startSize.current.height - deltaY;
          break;
      }

      // Apply minimum sizes
      newWidth = Math.max(minSize.width, newWidth);
      newHeight = Math.max(minSize.height, newHeight);

      // Verificar límites del viewport
      const maxWidth = window.innerWidth - position.x - 20; // 20px de margen
      const maxHeight = window.innerHeight - position.y - 20; // 20px de margen

      // Para handles que afectan posición (sw, ne, nw), considerar posición actual
      if (resizeHandle === 'sw' || resizeHandle === 'nw') {
        const maxWidthLeft = position.x + startSize.current.width - minSize.width;
        newWidth = Math.min(newWidth, maxWidthLeft);
      } else {
        newWidth = Math.min(newWidth, maxWidth);
      }

      if (resizeHandle === 'ne' || resizeHandle === 'nw') {
        const maxHeightTop = position.y + startSize.current.height - minSize.height;
        newHeight = Math.min(newHeight, maxHeightTop);
      } else {
        newHeight = Math.min(newHeight, maxHeight);
      }

      setSize({
        width: newWidth,
        height: newHeight,
      });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setResizeHandle(null);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, resizeHandle, minSize, position]);

  const handleResizeStart = (handle: ResizeHandle) => (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsResizing(true);
    setResizeHandle(handle);
    startPos.current = { x: e.clientX, y: e.clientY };
    startSize.current = { ...size };
  };

  return {
    size,
    resizeRef,
    handleResizeStart,
    isResizing,
  };
};
