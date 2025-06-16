
import React from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { FileAttachment } from '../FileUpload';
import FileAttachmentItem from './FileAttachmentItem';

interface FileAttachmentsListProps {
  attachments: FileAttachment[];
  onRemove: (id: string) => void;
  onSend: () => void;
}

const FileAttachmentsList: React.FC<FileAttachmentsListProps> = ({ 
  attachments, 
  onRemove, 
  onSend 
}) => {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();

  if (attachments.length === 0) return null;

  const uploadedCount = attachments.filter(att => att.status === 'uploaded').length;

  return (
    <div 
      className={`absolute bottom-full mb-2 ${themeClasses.cardBackground} border ${themeClasses.border} rounded-lg p-3 max-h-60 overflow-y-auto shadow-xl z-50`}
      style={{
        left: '50%',
        transform: 'translateX(-50%)',
        width: 'min(320px, 90vw)',
        maxWidth: '320px'
      }}
    >
      <div className="space-y-2">
        {attachments.map((attachment) => (
          <FileAttachmentItem
            key={attachment.id}
            attachment={attachment}
            onRemove={onRemove}
          />
        ))}
      </div>
      
      {uploadedCount > 0 && (
        <button
          onClick={onSend}
          className={`w-full mt-3 ${themeClasses.buttonPrimary} text-white py-2 rounded text-sm font-medium hover:opacity-90 transition-opacity`}
        >
          Enviar archivos ({uploadedCount})
        </button>
      )}
    </div>
  );
};

export default FileAttachmentsList;
