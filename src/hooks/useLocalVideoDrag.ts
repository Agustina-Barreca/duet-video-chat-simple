
import { useState, useRef, useCallback } from "react";

interface DragHookProps {
  position: { x: number; y: number };
  setPosition: (pos: { x: number; y: number }) => void;
  videoWidth: number;
  videoHeight: number;
  minimizedSize: number;
  isMinimized: boolean;
}

export const useLocalVideoDrag = ({
  position,
  setPosition,
  videoWidth,
  videoHeight,
  minimizedSize,
  isMinimized
}: DragHookProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [hasDragged, setHasDragged] = useState(false);
  const dragRef = useRef<{ startX: number; startY: number; initialX: number; initialY: number }>({
    startX: 0,
    startY: 0,
    initialX: position.x,
    initialY: position.y
  });

  // Optimizar handlers con useCallback
  const updatePosition = useCallback((deltaX: number, deltaY: number) => {
    const currentWidth = isMinimized ? minimizedSize : videoWidth;
    const currentHeight = isMinimized ? minimizedSize : videoHeight;
    const newX = Math.max(0, Math.min(window.innerWidth - currentWidth, dragRef.current.initialX + deltaX));
    const newY = Math.max(0, Math.min(window.innerHeight - currentHeight, dragRef.current.initialY + deltaY));
    setPosition({ x: newX, y: newY });
  }, [videoWidth, videoHeight, minimizedSize, isMinimized, setPosition]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setHasDragged(false);
    
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initialX: position.x,
      initialY: position.y
    };

    const handleMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - dragRef.current.startX;
      const deltaY = e.clientY - dragRef.current.startY;
      
      // If it moves more than 5px, consider it dragging
      if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
        setHasDragged(true);
      }
      
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
    setHasDragged(false);
    
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
      
      // If it moves more than 5px, consider it dragging
      if (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
        setHasDragged(true);
      }
      
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

  return {
    isDragging,
    hasDragged,
    setHasDragged,
    handleMouseDown,
    handleTouchStart
  };
};
