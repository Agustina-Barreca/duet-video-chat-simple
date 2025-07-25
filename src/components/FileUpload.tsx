
import React, { useRef, useCallback } from 'react';
import { Paperclip } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useFileUpload } from './fileUpload/useFileUpload';
import FileAttachmentsList from './fileUpload/FileAttachmentsList';
import DragDropOverlay from './fileUpload/DragDropOverlay';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const {
    isDragOver,
    setIsDragOver,
    attachments,
    processFiles,
    removeAttachment,
    sendAttachments,
    clearAttachments,
  } = useFileUpload();

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      processFiles(files);
    }
  }, [processFiles, setIsDragOver]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, [setIsDragOver]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    // Only hide if we actually left the drag area
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsDragOver(false);
    }
  }, [setIsDragOver]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processFiles(files);
    }
  }, [processFiles]);

  const handleSendAttachments = () => {
    const uploadedFiles = sendAttachments();
    if (uploadedFiles.length > 0) {
      onFilesSelected(uploadedFiles);
      clearAttachments();
    }
  };

  return (
    <div className="relative">
      <button
        type="button"
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

      <FileAttachmentsList
        attachments={attachments}
        onRemove={removeAttachment}
        onSend={handleSendAttachments}
      />

      {isDragOver && (
        <DragDropOverlay
          isVisible={isDragOver}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        />
      )}
    </div>
  );
};

export default FileUpload;
