
import { User } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface RemoteVideoProps {
  isVideoOff: boolean;
}

const RemoteVideo = ({ isVideoOff }: RemoteVideoProps) => {
  const [size, setSize] = useState({ width: 600, height: 400 });
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const startSizeRef = useRef({ width: 0, height: 0 });
  const startMouseRef = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    startSizeRef.current = { width: size.width, height: size.height };
    startMouseRef.current = { x: e.clientX, y: e.clientY };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const deltaX = e.clientX - startMouseRef.current.x;
      const deltaY = e.clientY - startMouseRef.current.y;

      const newWidth = Math.max(300, Math.min(800, startSizeRef.current.width + deltaX));
      const newHeight = Math.max(200, Math.min(600, startSizeRef.current.height + deltaY));

      setSize({ width: newWidth, height: newHeight });
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  return (
    <div className="absolute inset-0 p-8 pt-32 pb-24 flex items-center justify-center">
      <div 
        ref={containerRef}
        className="relative bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10 group"
        style={{ 
          width: `${size.width}px`, 
          height: `${size.height}px`,
          minWidth: '300px',
          minHeight: '200px',
          maxWidth: '800px',
          maxHeight: '600px'
        }}
      >
        {/* Resize handle solo en la esquina inferior derecha */}
        <div 
          className="absolute bottom-0 right-0 w-6 h-6 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity cursor-se-resize z-10 rounded-tl-lg"
          onMouseDown={handleMouseDown}
        >
          <div className="absolute bottom-1 right-1 w-2 h-2 bg-white/40 rounded-full"></div>
        </div>

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
