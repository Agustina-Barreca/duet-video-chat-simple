
import { useState, useCallback } from 'react';
import { FileAttachment } from '../FileUpload';

export const useFileUpload = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);

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

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(att => att.id !== id));
  };

  const sendAttachments = () => {
    const uploadedFiles = attachments.filter(att => att.status === 'uploaded');
    if (uploadedFiles.length > 0) {
      return uploadedFiles;
    }
    return [];
  };

  const clearAttachments = () => {
    setAttachments([]);
  };

  return {
    isDragOver,
    setIsDragOver,
    attachments,
    processFiles,
    removeAttachment,
    sendAttachments,
    clearAttachments,
  };
};
