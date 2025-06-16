
import React, { useState } from 'react';
import { MessageCircle, Minus, X, Send, FileText, Play } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useDraggable } from '../hooks/useDraggable';
import { useResizable } from '../hooks/useResizable';
import ChatCarousel from './ChatCarousel';
import SatisfactionSurvey from './SatisfactionSurvey';
import FullScreenViewer from './FullScreenViewer';
import EmojiPicker from './EmojiPicker';
import FileUpload, { FileAttachment } from './FileUpload';
import ChatForm from './ChatForm';

interface Message {
  id: number;
  text?: string;
  sender: 'user' | 'other';
  timestamp: Date;
  type?: 'text' | 'carousel' | 'image' | 'video' | 'pdf' | 'form' | 'files';
  content?: string | FileAttachment[];
}

const FloatingChat = () => {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  const [isMinimized, setIsMinimized] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [fullScreenContent, setFullScreenContent] = useState<{type: 'image' | 'carousel', data: string | string[]}>({type: 'image', data: ''});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "¡Hola! 👋 ¿Cómo estás? Te muestro algunos elementos multimedia:",
      sender: 'other',
      timestamp: new Date(),
    },
    {
      id: 2,
      sender: 'other',
      timestamp: new Date(),
      type: 'carousel'
    },
    {
      id: 3,
      sender: 'other',
      timestamp: new Date(),
      type: 'image',
      content: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=200&fit=crop'
    },
    {
      id: 4,
      sender: 'other',
      timestamp: new Date(),
      type: 'video',
      content: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4'
    },
    {
      id: 5,
      sender: 'other',
      timestamp: new Date(),
      type: 'pdf',
      content: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
    },
    {
      id: 6,
      text: "También puedes llenar este formulario completo: 📝",
      sender: 'other',
      timestamp: new Date(),
    },
    {
      id: 7,
      sender: 'other',
      timestamp: new Date(),
      type: 'form'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');

  const { position, dragRef, handleMouseDown, isDragging } = useDraggable({
    x: window.innerWidth - 350,
    y: 100,
  });

  const { size, handleResizeStart, isResizing } = useResizable(
    { width: 300, height: 500 },
    { width: 250, height: 400 }
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
        text: "¡Gracias por tu mensaje! 😊 Este es un chat de demostración.",
        sender: 'other',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, autoReply]);
    }, 1000);
  };

  const handleCloseChat = () => {
    setShowSurvey(true);
  };

  const handleSurveyClose = () => {
    setShowSurvey(false);
  };

  const handleSurveyComplete = () => {
    setShowSurvey(false);
    setIsOpen(false);
  };

  const handleImageClick = (imageUrl: string) => {
    setFullScreenContent({ type: 'image', data: imageUrl });
    setShowFullScreen(true);
  };

  const handleCarouselClick = (images: string[]) => {
    setFullScreenContent({ type: 'carousel', data: images });
    setShowFullScreen(true);
  };

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
  };

  const handleFilesSelected = (files: FileAttachment[]) => {
    const message: Message = {
      id: messages.length + 1,
      sender: 'user',
      timestamp: new Date(),
      type: 'files',
      content: files
    };
    setMessages(prev => [...prev, message]);

    // Simular respuesta automática
    setTimeout(() => {
      const autoReply: Message = {
        id: messages.length + 2,
        text: `¡Perfecto! He recibido ${files.length} archivo${files.length > 1 ? 's' : ''}. 📎✨`,
        sender: 'other',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, autoReply]);
    }, 1000);
  };

  const handleFormSubmit = (formData: any) => {
    const message: Message = {
      id: messages.length + 1,
      text: formData.type === 'quick_reply' 
        ? formData.message 
        : `Formulario enviado: ${formData.name} - ${formData.email} ⭐${formData.rating}/5`,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, message]);

    // Simular respuesta automática
    setTimeout(() => {
      const autoReply: Message = {
        id: messages.length + 2,
        text: formData.type === 'quick_reply' 
          ? "¡Gracias por tu respuesta rápida! 🚀" 
          : "¡Excelente! Hemos recibido tu formulario. Te contactaremos pronto. 📧✨",
        sender: 'other',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, autoReply]);
    }, 1000);
  };

  const renderMessage = (message: Message) => {
    const isUser = message.sender === 'user';
    
    if (message.type === 'carousel') {
      return (
        <div className="flex justify-start mb-3">
          <div className="max-w-[90%]">
            <ChatCarousel onImageClick={handleCarouselClick} />
          </div>
        </div>
      );
    }

    if (message.type === 'form') {
      return (
        <div className="flex justify-start mb-3">
          <div className="max-w-[95%]">
            <ChatForm onSubmit={handleFormSubmit} />
          </div>
        </div>
      );
    }

    if (message.type === 'files' && message.content) {
      const files = message.content as FileAttachment[];
      return (
        <div className="flex justify-end mb-3">
          <div className="max-w-[80%] space-y-2">
            {files.map((file) => (
              <div key={file.id} className={`flex items-center gap-3 p-3 rounded-lg ${themeClasses.buttonPrimary} text-white`}>
                {file.preview ? (
                  <img src={file.preview} alt="" className="w-12 h-12 object-cover rounded" />
                ) : (
                  <div className="w-12 h-12 flex items-center justify-center rounded bg-white/20">
                    <FileText className="w-6 h-6" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{file.file.name}</p>
                  <p className="text-xs opacity-80">
                    {(file.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (message.type === 'image' && typeof message.content === 'string') {
      return (
        <div className="flex justify-start mb-3">
          <div className="max-w-[80%]">
            <img
              src={message.content}
              alt="Imagen compartida"
              onClick={() => handleImageClick(message.content as string)}
              className="rounded-lg max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
              title="Click para ver en tamaño completo"
            />
          </div>
        </div>
      );
    }

    if (message.type === 'video' && typeof message.content === 'string') {
      return (
        <div className="flex justify-start mb-3">
          <div className="max-w-[80%]">
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                src={message.content}
                controls
                className="w-full h-auto"
                style={{ maxHeight: '200px' }}
              >
                Tu navegador no soporta el elemento de video.
              </video>
              <div className="absolute top-2 left-2 bg-black/50 rounded-full p-1">
                <Play className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (message.type === 'pdf' && typeof message.content === 'string') {
      return (
        <div className="flex justify-start mb-3">
          <div className="max-w-[80%]">
            <a
              href={message.content}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 p-3 rounded-lg border ${themeClasses.border} ${themeClasses.buttonSecondary} hover:opacity-90 transition-opacity`}
            >
              <FileText className={`w-5 h-5 ${themeClasses.textPrimary}`} />
              <div>
                <div className={`text-sm font-medium ${themeClasses.textPrimary}`}>
                  Documento PDF
                </div>
                <div className={`text-xs ${themeClasses.textSecondary}`}>
                  Haz clic para abrir
                </div>
              </div>
            </a>
          </div>
        </div>
      );
    }

    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
        <div
          className={`max-w-[80%] p-3 rounded-lg text-sm ${
            isUser
              ? `${themeClasses.buttonPrimary} text-white`
              : `${themeClasses.buttonSecondary} ${themeClasses.textPrimary}`
          }`}
        >
          {message.text}
        </div>
      </div>
    );
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
    <>
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
              onClick={handleCloseChat}
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
            <div className="flex-1 p-4 overflow-y-auto" style={{ maxHeight: size.height - 120 }}>
              {messages.map((message) => (
                <div key={message.id}>
                  {renderMessage(message)}
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
                  placeholder="Escribe tu mensaje... 💬"
                  className={`flex-1 px-3 py-2 text-sm rounded border ${themeClasses.border} ${themeClasses.cardBackground} ${themeClasses.textPrimary} placeholder:${themeClasses.textSecondary} focus:outline-none focus:ring-1 focus:ring-blue-500`}
                />
                <div className="flex items-center gap-1">
                  <FileUpload onFilesSelected={handleFilesSelected} />
                  <EmojiPicker 
                    onEmojiSelect={handleEmojiSelect}
                    isOpen={showEmojiPicker}
                    onToggle={() => setShowEmojiPicker(!showEmojiPicker)}
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className={`${themeClasses.buttonPrimary} p-2 rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </div>
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

      {/* Encuesta de satisfacción */}
      {showSurvey && (
        <SatisfactionSurvey
          onClose={handleSurveyClose}
          onComplete={handleSurveyComplete}
        />
      )}

      {/* Visor full-screen */}
      <FullScreenViewer
        isOpen={showFullScreen}
        onClose={() => setShowFullScreen(false)}
        content={fullScreenContent}
      />
    </>
  );
};

export default FloatingChat;
