
import { User } from "lucide-react";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "./ui/resizable";

interface RemoteVideoProps {
  isVideoOff: boolean;
}

const RemoteVideo = ({ isVideoOff }: RemoteVideoProps) => {
  return (
    <div className="absolute inset-0 p-8 pt-32 pb-24">
      <ResizablePanelGroup direction="horizontal" className="w-full h-full">
        <ResizablePanel 
          defaultSize={100} 
          minSize={30}
          className="relative"
        >
          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-white/10 relative group">
            {/* Resize handles en las esquinas */}
            <div className="absolute top-0 left-0 w-4 h-4 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity cursor-nw-resize z-10"></div>
            <div className="absolute top-0 right-0 w-4 h-4 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity cursor-ne-resize z-10"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity cursor-sw-resize z-10"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity cursor-se-resize z-10"></div>
            
            {/* Resize handles en los lados */}
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-2 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity cursor-n-resize z-10"></div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-2 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity cursor-s-resize z-10"></div>
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-8 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity cursor-w-resize z-10"></div>
            <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-8 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity cursor-e-resize z-10"></div>

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
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default RemoteVideo;
