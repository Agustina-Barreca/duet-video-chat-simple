import { User } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface RemoteVideoProps {
  isVideoOff: boolean;
}

const RemoteVideo = ({ isVideoOff }: RemoteVideoProps) => {
  const [size, setSize] = useState({ width: 780, height: 520 }); // Incrementado ~30% desde 600x400
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [resizeDirection, setResizeDirection] = useState<string>('');
  const containerRef = useRef<HTMLDivElement>(null);
  const startSizeRef = useRef({ width: 0, height: 0 });
  const startMouseRef = useRef({ x: 0, y: 0 });
  const startPositionRef = useRef({ x: 0, y: 0 });

  // Inicializar posición centrada
  useEffect(() => {
    const centerX = (window.innerWidth - size.width) / 2;
    const centerY = (window.innerHeight - size.height) / 2;
    setPosition({ x: centerX, y: centerY });
  }, []);

  const handleResizeMouseDown = (e: React.MouseEvent, direction: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeDirection(direction);
    startSizeRef.current = { width: size.width, height: size.height };
    startMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleDragMouseDown = (e: React.MouseEvent) => {
    // Solo iniciar drag si no estamos redimensionando
    if (isResizing) return;
    
    e.preventDefault();
    setIsDragging(true);
    startPositionRef.current = { x: position.x, y: position.y };
    startMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
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

        // Aplicar límites
        newWidth = Math.max(300, Math.min(1200, newWidth));
        newHeight = Math.max(200, Math.min(800, newHeight));

        setSize({ width: newWidth, height: newHeight });
      } else if (isDragging) {
        const deltaX = e.clientX - startMouseRef.current.x;
        const deltaY = e.clientY - startMouseRef.current.y;

        const newX = Math.max(0, Math.min(window.innerWidth - size.width, startPositionRef.current.x + deltaX));
        const newY = Math.max(0, Math.min(window.innerHeight - size.height, startPositionRef.current.y + deltaY));

        setPosition({ x: newX, y: newY });
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      setIsDragging(false);
      setResizeDirection('');
    };

    if (isResizing || isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, isDragging, resizeDirection, size.width, size.height]);

  return (
    <div className="absolute inset-0 p-8 pt-32 pb-24 flex items-center justify-center pointer-events-none">
      <div 
        ref={containerRef}
        className="absolute bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10 group pointer-events-auto"
        style={{ 
          width: `${size.width}px`, 
          height: `${size.height}px`,
          left: `${position.x}px`,
          top: `${position.y}px`,
          minWidth: '300px',
          minHeight: '200px',
          maxWidth: '1200px',
          maxHeight: '800px',
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
        onMouseDown={handleDragMouseDown}
      >
        {/* Resize handles en las cuatro esquinas */}
        
        {/* Esquina superior izquierda */}
        <div 
          className="absolute top-0 left-0 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity cursor-nw-resize z-10 border-l-2 border-t-2 border-white/60"
          onMouseDown={(e) => handleResizeMouseDown(e, 'nw')}
        />

        {/* Esquina superior derecha */}
        <div 
          className="absolute top-0 right-0 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity cursor-ne-resize z-10 border-r-2 border-t-2 border-white/60"
          onMouseDown={(e) => handleResizeMouseDown(e, 'ne')}
        />

        {/* Esquina inferior izquierda */}
        <div 
          className="absolute bottom-0 left-0 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity cursor-sw-resize z-10 border-l-2 border-b-2 border-white/60"
          onMouseDown={(e) => handleResizeMouseDown(e, 'sw')}
        />

        {/* Esquina inferior derecha */}
        <div 
          className="absolute bottom-0 right-0 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity cursor-se-resize z-10 border-r-2 border-b-2 border-white/60"
          onMouseDown={(e) => handleResizeMouseDown(e, 'se')}
        />

        {isVideoOff ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-center">
              <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-16 h-16 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-white">Usuario Remoto</h3>
            </div>
          </div>
        ) : (
          <div className="w-full h-full relative overflow-hidden">
            {/* Simulación de video con gradiente animado */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 opacity-80 animate-pulse"></div>
            
            {/* Efecto de brillo para simular movimiento */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 animate-[slide_3s_ease-in-out_infinite]"></div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RemoteVideo;
