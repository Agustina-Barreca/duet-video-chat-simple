import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { useDraggable } from '../hooks/useDraggable';
import { useResizable } from '../hooks/useResizable';
import SatisfactionSurvey from './SatisfactionSurvey';
import FullScreenViewer from './FullScreenViewer';
import { FileAttachment } from './FileUpload';
import ChatHeader from './chat/ChatHeader';
import ChatMessage from './chat/ChatMessage';
import ChatInput from './chat/ChatInput';
import ChatResizeHandles from './chat/ChatResizeHandles';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [isMinimized, setIsMinimized] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [showSurvey, setShowSurvey] = useState(false);
  const [showFullScreen, setShowFullScreen] = useState(false);
  const [fullScreenContent, setFullScreenContent] = useState<{type: 'image' | 'carousel', data: string | string[]}>({type: 'image', data: ''});
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [newMessage, setNewMessage] = useState('');

  // Initialize position considering viewport
  const { position, dragRef, handleMouseDown, isDragging } = useDraggable({
    x: Math.max(20, window.innerWidth - 370), // Ensure minimum margin
    y: Math.max(20, Math.min(100, window.innerHeight - 520)), // Ensure it fits on screen
  });

  const { size, handleResizeStart, isResizing } = useResizable(
    { width: 350, height: 500 },
    { width: 320, height: 400 },
    position
  );

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! 👋 How are you? Let me show you some multimedia elements:",
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
      text: "You can also fill out this complete form: 📝",
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

  // Function to scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Auto scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

    // Simulate automatic response
    setTimeout(() => {
      const autoReply: Message = {
        id: messages.length + 2,
        text: "Thank you for your message! 😊 This is a demo chat.",
        sender: 'other',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, autoReply]);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
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

    // Simulate automatic response
    setTimeout(() => {
      const autoReply: Message = {
        id: messages.length + 2,
        text: `Perfect! I've received ${files.length} file${files.length > 1 ? 's' : ''}. 📎✨`,
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
        : `Form submitted: ${formData.name} - ${formData.email} ⭐${formData.rating}/5`,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, message]);

    // Simulate automatic response
    setTimeout(() => {
      const autoReply: Message = {
        id: messages.length + 2,
        text: formData.type === 'quick_reply' 
          ? "Thank you for your quick response! 🚀" 
          : "Excellent! We've received your form. We'll contact you soon. 📧✨",
        sender: 'other',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, autoReply]);
    }, 1000);
  };

  // If chat is not open, show only the floating icon
  if (!isOpen) {
    return (
      <div
        className="fixed z-50 cursor-pointer"
        style={{ right: '20px', bottom: '20px' }}
      >
        <button
          onClick={() => setIsOpen(true)}
          className={`${themeClasses.buttonPrimary} rounded-full p-4 shadow-lg hover:scale-105 transition-all duration-200`}
          title="Open chat"
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
          left: Math.max(0, Math.min(position.x, window.innerWidth - size.width)),
          top: Math.max(0, Math.min(position.y, window.innerHeight - size.height)),
          width: isMinimized ? 'auto' : Math.max(size.width, 320),
          height: isMinimized ? 'auto' : size.height,
        }}
      >
        <ChatHeader
          isMinimized={isMinimized}
          onMinimize={() => setIsMinimized(!isMinimized)}
          onClose={handleCloseChat}
          onMouseDown={handleMouseDown}
        />

        {/* Chat content - only shown if not minimized */}
        {!isMinimized && (
          <>
            {/* Messages area */}
            <div className="flex-1 p-4 overflow-y-auto" style={{ maxHeight: size.height - 120 }}>
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  onImageClick={handleImageClick}
                  onCarouselClick={handleCarouselClick}
                  onFormSubmit={handleFormSubmit}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>

            <ChatInput
              newMessage={newMessage}
              showEmojiPicker={showEmojiPicker}
              onMessageChange={setNewMessage}
              onSubmit={handleSendMessage}
              onKeyDown={handleKeyDown}
              onEmojiSelect={handleEmojiSelect}
              onEmojiToggle={() => setShowEmojiPicker(!showEmojiPicker)}
              onFilesSelected={handleFilesSelected}
            />

            <ChatResizeHandles onResizeStart={handleResizeStart} />
          </>
        )}
      </div>

      {/* Satisfaction survey */}
      {showSurvey && (
        <SatisfactionSurvey
          onClose={handleSurveyClose}
          onComplete={handleSurveyComplete}
        />
      )}

      {/* Full-screen viewer */}
      <FullScreenViewer
        isOpen={showFullScreen}
        onClose={() => setShowFullScreen(false)}
        content={fullScreenContent}
      />
    </>
  );
};

export default FloatingChat;
