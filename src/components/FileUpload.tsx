
import React, { useState, useRef, useCallback } from 'react';
import { Paperclip, X, Upload, File, Image, Video, FileText, AlertCircle, Loader2 } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface FileUploadProps {
  onFilesSelected: (files: FileAttachment[]) => void;
}

export interface FileAttachment {
  id: string;
  file: File;
  preview?: string;
  status: 'uploading' | 'uploaded' | 'error';
  progress?: number;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesSelected }) => {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  const [isDragOver, setIsDragOver] = useState(false);
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (file.type.startsWith('video/')) return <Video className="w-4 h-4" />;
    if (file.type.includes('pdf')) return <FileText className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  const generatePreview = (file: File): Promise<string | undefined> => {
    return new Promise((resolve) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        resolve(undefined);
      }
    });
  };

  const simulateUpload = (attachment: FileAttachment) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        setAttachments(prev => 
          prev.map(att => 
            att.id === attachment.id 
              ? { ...att, status: 'uploaded', progress: 100 }
              : att
          )
        );
        clearInterval(interval);
      } else {
        setAttachments(prev => 
          prev.map(att => 
            att.id === attachment.id 
              ? { ...att, progress }
              : att
          )
        );
      }
    }, 200);

    return interval;
  };

  const processFiles = useCallback(async (files: FileList) => {
    const newAttachments: FileAttachment[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const id = `${Date.now()}-${i}`;
      const preview = await generatePreview(file);
      
      const attachment: FileAttachment = {
        id,
        file,
        preview,
        status: 'uploading',
        progress: 0
      };
      
      newAttachments.push(attachment);
    }
    
    setAttachments(prev => [...prev, ...newAttachments]);
    
    // Simular carga
    newAttachments.forEach(attachment => {
      simulateUpload(attachment);
    });
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFiles(files);
    }
  }, [processFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    // Solo ocultar si realmente salimos del área de drag
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  }, []);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  }, [processFiles]);

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const sendAttachments = () => {
    const uploadedFiles = attachments.filter(att => att.status === 'uploaded');
    if (uploadedFiles.length > 0) {
      onFilesSelected(uploadedFiles);
      setAttachments([]);
    }
  };

  return (
    <>
      <div className="relative">
        <button
          onClick={() => fileInputRef.current?.click()}
          className={`p-2 rounded hover:bg-white/10 ${themeClasses.textSecondary} hover:${themeClasses.textPrimary} transition-colors`}
          title="Adjuntar archivo"
        >
          <Paperclip className="w-4 h-4" />
        </button>
        
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,video/*,.pdf,.doc,.docx,.txt"
        />

        {/* Lista de archivos adjuntos - posicionado correctamente arriba del botón */}
        {attachments.length > 0 && (
          <div className={`absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 ${themeClasses.cardBackground} border ${themeClasses.border} rounded-lg p-3 w-80 max-h-60 overflow-y-auto shadow-xl z-50`}>
            <div className="space-y-2">
              {attachments.map((attachment) => (
                <div key={attachment.id} className={`flex items-center gap-3 p-2 rounded ${themeClasses.buttonSecondary}`}>
                  {attachment.preview ? (
                    <img src={attachment.preview} alt="" className="w-10 h-10 object-cover rounded" />
                  ) : (
                    <div className={`w-10 h-10 flex items-center justify-center rounded ${themeClasses.buttonSecondary}`}>
                      {getFileIcon(attachment.file)}
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${themeClasses.textPrimary} truncate`}>
                      {attachment.file.name}
                    </p>
                    <p className={`text-xs ${themeClasses.textSecondary}`}>
                      {(attachment.file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                    
                    {attachment.status === 'uploading' && (
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 bg-gray-600 rounded-full h-1">
                          <div 
                            className="bg-blue-500 h-1 rounded-full transition-all duration-200"
                            style={{ width: `${attachment.progress || 0}%` }}
                          />
                        </div>
                        <Loader2 className="w-3 h-3 animate-spin text-blue-500" />
                      </div>
                    )}
                    
                    {attachment.status === 'error' && (
                      <div className="flex items-center gap-1 mt-1">
                        <AlertCircle className="w-3 h-3 text-red-500" />
                        <span className="text-xs text-red-500">Error al cargar</span>
                      </div>
                    )}
                  </div>
                  
                  <button
                    onClick={() => removeAttachment(attachment.id)}
                    className={`p-1 rounded hover:bg-white/10 ${themeClasses.textSecondary} hover:text-red-400 transition-colors`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
            
            {attachments.some(att => att.status === 'uploaded') && (
              <button
                onClick={sendAttachments}
                className={`w-full mt-3 ${themeClasses.buttonPrimary} text-white py-2 rounded text-sm font-medium hover:opacity-90 transition-opacity`}
              >
                Enviar archivos ({attachments.filter(att => att.status === 'uploaded').length})
              </button>
            )}
          </div>
        )}
      </div>

      {/* Zona de drag & drop - portal a body para evitar problemas de z-index */}
      {isDragOver && (
        <div
          className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className={`${themeClasses.cardBackground} border-2 border-dashed ${themeClasses.border} rounded-lg p-8 text-center`}>
            <Upload className={`w-12 h-12 mx-auto mb-4 ${themeClasses.textSecondary}`} />
            <p className={`${themeClasses.textPrimary} text-lg font-medium`}>
              Suelta los archivos aquí
            </p>
          </div>
        </div>
      )}

      {/* Overlay global para drag & drop */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className="fixed inset-0 pointer-events-none z-40"
      />
    </>
  );
};

export default FileUpload;
