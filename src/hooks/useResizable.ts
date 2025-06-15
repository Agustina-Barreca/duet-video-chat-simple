
import { useState, useRef, useEffect } from 'react';

interface Size {
  width: number;
  height: number;
}

type ResizeHandle = 'se' | 'sw' | 'ne' | 'nw';

export const useResizable = (initialSize: Size, minSize: Size) => {
  const [size, setSize] = useState<Size>(initialSize);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<ResizeHandle | null>(null);
  const resizeRef = useRef<HTMLDivElement>(null);
  const startPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const startSize = useRef<Size>({ width: 0, height: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing || !resizeHandle) return;

      const deltaX = e.clientX - startPos.current.x;
      const deltaY = e.clientY - startPos.current.y;

      let newWidth = startSize.current.width;
      let newHeight = startSize.current.height;

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

      setSize({
        width: Math.max(minSize.width, newWidth),
        height: Math.max(minSize.height, newHeight),
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
  }, [isResizing, resizeHandle, minSize]);

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
