
import React from 'react';
import { X, Image, Video, FileText, File, AlertCircle, Loader2 } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { FileAttachment } from '../FileUpload';

interface FileAttachmentItemProps {
  attachment: FileAttachment;
  onRemove: (id: string) => void;
}

const FileAttachmentItem: React.FC<FileAttachmentItemProps> = ({ attachment, onRemove }) => {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('image/')) return <Image className="w-4 h-4" />;
    if (file.type.startsWith('video/')) return <Video className="w-4 h-4" />;
    if (file.type.includes('pdf')) return <FileText className="w-4 h-4" />;
    return <File className="w-4 h-4" />;
  };

  return (
    <div className={`flex items-center gap-3 p-2 rounded ${themeClasses.buttonSecondary}`}>
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
        onClick={() => onRemove(attachment.id)}
        className={`p-1 rounded hover:bg-white/10 ${themeClasses.textSecondary} hover:text-red-400 transition-colors`}
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};

export default FileAttachmentItem;
