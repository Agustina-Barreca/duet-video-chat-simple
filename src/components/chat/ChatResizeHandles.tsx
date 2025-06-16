
import React from 'react';

interface ChatResizeHandlesProps {
  onResizeStart: (handle: 'se' | 'sw' | 'ne' | 'nw') => (e: React.MouseEvent) => void;
}

const ChatResizeHandles: React.FC<ChatResizeHandlesProps> = ({ onResizeStart }) => {
  return (
    <>
      {/* Handle esquina inferior derecha */}
      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-50 hover:opacity-100"
        onMouseDown={onResizeStart('se')}
      >
        <div className="absolute bottom-1 right-1 w-0 h-0 border-l-2 border-b-2 border-gray-400"></div>
        <div className="absolute bottom-0.5 right-0.5 w-0 h-0 border-l-2 border-b-2 border-gray-400"></div>
      </div>
      
      {/* Handle esquina inferior izquierda */}
      <div
        className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize opacity-50 hover:opacity-100"
        onMouseDown={onResizeStart('sw')}
      >
        <div className="absolute bottom-1 left-1 w-0 h-0 border-r-2 border-b-2 border-gray-400"></div>
        <div className="absolute bottom-0.5 left-0.5 w-0 h-0 border-r-2 border-b-2 border-gray-400"></div>
      </div>
      
      {/* Handle esquina superior derecha */}
      <div
        className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize opacity-50 hover:opacity-100"
        onMouseDown={onResizeStart('ne')}
      >
        <div className="absolute top-1 right-1 w-0 h-0 border-l-2 border-t-2 border-gray-400"></div>
        <div className="absolute top-0.5 right-0.5 w-0 h-0 border-l-2 border-t-2 border-gray-400"></div>
      </div>
      
      {/* Handle esquina superior izquierda */}
      <div
        className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize opacity-50 hover:opacity-100"
        onMouseDown={onResizeStart('nw')}
      >
        <div className="absolute top-1 left-1 w-0 h-0 border-r-2 border-t-2 border-gray-400"></div>
        <div className="absolute top-0.5 left-0.5 w-0 h-0 border-r-2 border-t-2 border-gray-400"></div>
      </div>
    </>
  );
};

export default ChatResizeHandles;
