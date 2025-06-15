
import React, { useState } from 'react';
import { MessageCircle, Minus, X, Send } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useDraggable } from '../hooks/useDraggable';
import { useResizable } from '../hooks/useResizable';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'other';
  timestamp: Date;
}

const FloatingChat = () => {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  const [isMinimized, setIsMinimized] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "¡Hola! ¿Cómo estás?",
      sender: 'other',
      timestamp: new Date(),
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const { position, dragRef, handleMouseDown, isDragging } = useDraggable({
    x: window.innerWidth - 350,
    y: 100,
  });

  const { size, handleResizeStart, isResizing } = useResizable(
    { width: 300, height: 400 },
    { width: 250, height: 300 }
  );

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const message: Message = {
      id: messages.length + 1,
      text: newMessage,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages([...messages, message]);
    setNewMessage('');

    // Simular respuesta automática
    setTimeout(() => {
      const autoReply: Message = {
        id: messages.length + 2,
        text: "¡Gracias por tu mensaje! Este es un chat de demostración.",
        sender: 'other',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, autoReply]);
    }, 1000);
  };

  // Si el chat no está abierto, mostrar solo el icono flotante
  if (!isOpen) {
    return (
      <div
        className="fixed z-50 cursor-pointer"
        style={{ right: '20px', bottom: '20px' }}
      >
        <button
          onClick={() => setIsOpen(true)}
          className={`${themeClasses.buttonPrimary} rounded-full p-4 shadow-lg hover:scale-105 transition-all duration-200`}
          title="Abrir chat"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </button>
      </div>
    );
  }

  return (
    <div
      ref={dragRef}
      className={`fixed z-50 ${themeClasses.cardBackground} border ${themeClasses.border} rounded-lg shadow-2xl overflow-hidden backdrop-blur-sm ${
        isDragging ? 'cursor-grabbing' : 'cursor-auto'
      } ${isResizing ? 'select-none' : ''}`}
      style={{
        left: position.x,
        top: position.y,
        width: isMinimized ? 'auto' : size.width,
        height: isMinimized ? 'auto' : size.height,
      }}
    >
      {/* Header del chat */}
      <div
        className={`${themeClasses.buttonSecondary} px-4 py-3 border-b ${themeClasses.border} cursor-grab active:cursor-grabbing flex items-center justify-between`}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center gap-2">
          <MessageCircle className={`w-4 h-4 ${themeClasses.textPrimary}`} />
          <span className={`text-sm font-medium ${themeClasses.textPrimary}`}>
            Chat
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className={`p-1 rounded hover:bg-white/10 ${themeClasses.textSecondary} hover:${themeClasses.textPrimary} transition-colors`}
            title={isMinimized ? 'Maximizar' : 'Minimizar'}
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className={`p-1 rounded hover:bg-white/10 ${themeClasses.textSecondary} hover:${themeClasses.textPrimary} transition-colors`}
            title="Cerrar chat"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Contenido del chat - solo se muestra si no está minimizado */}
      {!isMinimized && (
        <>
          {/* Área de mensajes */}
          <div className="flex-1 p-4 overflow-y-auto max-h-64 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] p-3 rounded-lg text-sm ${
                    message.sender === 'user'
                      ? `${themeClasses.buttonPrimary} text-white`
                      : `${themeClasses.buttonSecondary} ${themeClasses.textPrimary}`
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input de mensaje */}
          <div className={`border-t ${themeClasses.border} p-3`}>
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Escribe tu mensaje..."
                className={`flex-1 px-3 py-2 text-sm rounded border ${themeClasses.border} ${themeClasses.cardBackground} ${themeClasses.textPrimary} placeholder:${themeClasses.textSecondary} focus:outline-none focus:ring-1 focus:ring-blue-500`}
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className={`${themeClasses.buttonPrimary} p-2 rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </form>
          </div>

          {/* Handles de redimensionamiento en las esquinas */}
          <div
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-50 hover:opacity-100"
            onMouseDown={handleResizeStart('se')}
          >
            <div className="absolute bottom-1 right-1 w-0 h-0 border-l-2 border-b-2 border-gray-400"></div>
            <div className="absolute bottom-0.5 right-0.5 w-0 h-0 border-l-2 border-b-2 border-gray-400"></div>
          </div>
          
          <div
            className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize opacity-50 hover:opacity-100"
            onMouseDown={handleResizeStart('sw')}
          >
            <div className="absolute bottom-1 left-1 w-0 h-0 border-r-2 border-b-2 border-gray-400"></div>
            <div className="absolute bottom-0.5 left-0.5 w-0 h-0 border-r-2 border-b-2 border-gray-400"></div>
          </div>
          
          <div
            className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize opacity-50 hover:opacity-100"
            onMouseDown={handleResizeStart('ne')}
          >
            <div className="absolute top-1 right-1 w-0 h-0 border-l-2 border-t-2 border-gray-400"></div>
            <div className="absolute top-0.5 right-0.5 w-0 h-0 border-l-2 border-t-2 border-gray-400"></div>
          </div>
          
          <div
            className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize opacity-50 hover:opacity-100"
            onMouseDown={handleResizeStart('nw')}
          >
            <div className="absolute top-1 left-1 w-0 h-0 border-r-2 border-t-2 border-gray-400"></div>
            <div className="absolute top-0.5 left-0.5 w-0 h-0 border-r-2 border-t-2 border-gray-400"></div>
          </div>
        </>
      )}
    </div>
  );
};

export default FloatingChat;
