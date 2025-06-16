
import React from 'react';
import { FileText, Play } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import ChatCarousel from '../ChatCarousel';
import ChatForm from '../ChatForm';
import { FileAttachment } from '../FileUpload';

interface Message {
  id: number;
  text?: string;
  sender: 'user' | 'other';
  timestamp: Date;
  type?: 'text' | 'carousel' | 'image' | 'video' | 'pdf' | 'form' | 'files';
  content?: string | FileAttachment[];
}

interface ChatMessageProps {
  message: Message;
  onImageClick: (imageUrl: string) => void;
  onCarouselClick: (images: string[]) => void;
  onFormSubmit: (formData: any) => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  onImageClick,
  onCarouselClick,
  onFormSubmit,
}) => {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  const isUser = message.sender === 'user';

  if (message.type === 'carousel') {
    return (
      <div className="flex justify-start mb-3">
        <div className="max-w-[90%]">
          <ChatCarousel onImageClick={onCarouselClick} />
        </div>
      </div>
    );
  }

  if (message.type === 'form') {
    return (
      <div className="flex justify-start mb-3">
        <div className="max-w-[95%]">
          <ChatForm onSubmit={onFormSubmit} />
        </div>
      </div>
    );
  }

  if (message.type === 'files' && message.content) {
    const files = message.content as FileAttachment[];
    return (
      <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
        <div className="max-w-[90%] w-full space-y-2">
          {files.map((file) => {
            // Si es una imagen, mostrarla como tal
            if (file.file.type.startsWith('image/') && file.preview) {
              return (
                <div key={file.id} className="space-y-2">
                  <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className="max-w-[80%]">
                      <img
                        src={file.preview}
                        alt={file.file.name}
                        onClick={() => onImageClick(file.preview!)}
                        className="rounded-lg max-w-full h-auto cursor-pointer hover:opacity-90 transition-opacity"
                        title="Click para ver en tamaño completo"
                      />
                    </div>
                  </div>
                  <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                    <div className={`text-xs px-2 py-1 rounded ${isUser ? `${themeClasses.buttonPrimary} text-white` : `${themeClasses.buttonSecondary} ${themeClasses.textSecondary}`}`}>
                      {file.file.name}
                    </div>
                  </div>
                </div>
              );
            }
            
            // Para otros tipos de archivos, mostrar como antes
            return (
              <div key={file.id} className={`flex items-center gap-3 p-3 rounded-lg ${isUser ? `${themeClasses.buttonPrimary} text-white` : `${themeClasses.buttonSecondary} ${themeClasses.textPrimary}`}`}>
                {file.preview ? (
                  <img src={file.preview} alt="" className="w-12 h-12 object-cover rounded flex-shrink-0" />
                ) : (
                  <div className="w-12 h-12 flex items-center justify-center rounded bg-white/20 flex-shrink-0">
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
            );
          })}
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
            onClick={() => onImageClick(message.content as string)}
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

export default ChatMessage;
