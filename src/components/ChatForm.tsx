
import React, { useState } from 'react';
import { Send, Calendar, Clock, Phone, Mail, User, MapPin } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import FileUpload, { FileAttachment } from './FileUpload';

interface ChatFormProps {
  onSubmit: (formData: any) => void;
}

const ChatForm: React.FC<ChatFormProps> = ({ onSubmit }) => {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    message: '',
    rating: 5,
    category: '',
    agree: false,
    attachments: [] as FileAttachment[]
  });

  const quickReplies = [
    'Sí, me interesa',
    'No, gracias',
    'Más información',
    'Contactar por teléfono',
    'Programar cita',
    'Enviar presupuesto'
  ];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFilesSelected = (files: FileAttachment[]) => {
    setFormData(prev => ({ ...prev, attachments: [...prev.attachments, ...files] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: '',
      email: '',
      phone: '',
      date: '',
      time: '',
      message: '',
      rating: 5,
      category: '',
      agree: false,
      attachments: []
    });
  };

  const handleQuickReply = (reply: string) => {
    onSubmit({ type: 'quick_reply', message: reply });
  };

  return (
    <div className={`${themeClasses.cardBackground} border ${themeClasses.border} rounded-lg p-4 space-y-4`}>
      <h3 className={`text-lg font-semibold ${themeClasses.textPrimary}`}>
        Formulario de Contacto 📝
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nombre */}
        <div className="space-y-2">
          <label className={`text-sm font-medium ${themeClasses.textPrimary} flex items-center gap-2`}>
            <User className="w-4 h-4" />
            Nombre completo
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Tu nombre completo"
            className={`w-full px-3 py-2 text-sm rounded border ${themeClasses.border} ${themeClasses.cardBackground} ${themeClasses.textPrimary} placeholder:${themeClasses.textSecondary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            required
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <label className={`text-sm font-medium ${themeClasses.textPrimary} flex items-center gap-2`}>
            <Mail className="w-4 h-4" />
            Email
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            placeholder="tu@email.com"
            className={`w-full px-3 py-2 text-sm rounded border ${themeClasses.border} ${themeClasses.cardBackground} ${themeClasses.textPrimary} placeholder:${themeClasses.textSecondary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            required
          />
        </div>

        {/* Teléfono */}
        <div className="space-y-2">
          <label className={`text-sm font-medium ${themeClasses.textPrimary} flex items-center gap-2`}>
            <Phone className="w-4 h-4" />
            Teléfono
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            placeholder="+1 234 567 8900"
            className={`w-full px-3 py-2 text-sm rounded border ${themeClasses.border} ${themeClasses.cardBackground} ${themeClasses.textPrimary} placeholder:${themeClasses.textSecondary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>

        {/* Fecha y Hora */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label className={`text-sm font-medium ${themeClasses.textPrimary} flex items-center gap-2`}>
              <Calendar className="w-4 h-4" />
              Fecha
            </label>
            <input
              type="date"
              value={formData.date}
              onChange={(e) => handleInputChange('date', e.target.value)}
              className={`w-full px-3 py-2 text-sm rounded border ${themeClasses.border} ${themeClasses.cardBackground} ${themeClasses.textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
          <div className="space-y-2">
            <label className={`text-sm font-medium ${themeClasses.textPrimary} flex items-center gap-2`}>
              <Clock className="w-4 h-4" />
              Hora
            </label>
            <input
              type="time"
              value={formData.time}
              onChange={(e) => handleInputChange('time', e.target.value)}
              className={`w-full px-3 py-2 text-sm rounded border ${themeClasses.border} ${themeClasses.cardBackground} ${themeClasses.textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>
        </div>

        {/* Categoría */}
        <div className="space-y-2">
          <label className={`text-sm font-medium ${themeClasses.textPrimary}`}>
            Categoría
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleInputChange('category', e.target.value)}
            className={`w-full px-3 py-2 text-sm rounded border ${themeClasses.border} ${themeClasses.cardBackground} ${themeClasses.textPrimary} focus:outline-none focus:ring-2 focus:ring-blue-500`}
          >
            <option value="">Selecciona una categoría</option>
            <option value="consulta">Consulta General</option>
            <option value="soporte">Soporte Técnico</option>
            <option value="ventas">Ventas</option>
            <option value="reclamo">Reclamo</option>
          </select>
        </div>

        {/* Rating */}
        <div className="space-y-2">
          <label className={`text-sm font-medium ${themeClasses.textPrimary}`}>
            Calificación: {formData.rating}/5 ⭐
          </label>
          <input
            type="range"
            min="1"
            max="5"
            value={formData.rating}
            onChange={(e) => handleInputChange('rating', parseInt(e.target.value))}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>1⭐</span>
            <span>2⭐</span>
            <span>3⭐</span>
            <span>4⭐</span>
            <span>5⭐</span>
          </div>
        </div>

        {/* Mensaje */}
        <div className="space-y-2">
          <label className={`text-sm font-medium ${themeClasses.textPrimary}`}>
            Mensaje 💬
          </label>
          <Textarea
            value={formData.message}
            onChange={(e) => handleInputChange('message', e.target.value)}
            placeholder="Cuéntanos más detalles... 😊"
            className={`w-full px-3 py-2 text-sm rounded border ${themeClasses.border} ${themeClasses.cardBackground} ${themeClasses.textPrimary} placeholder:${themeClasses.textSecondary} focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-20`}
          />
        </div>

        {/* Archivos adjuntos */}
        <div className="space-y-2">
          <label className={`text-sm font-medium ${themeClasses.textPrimary} flex items-center gap-2`}>
            📎 Archivos adjuntos
          </label>
          <div className="flex items-center gap-2">
            <FileUpload onFilesSelected={handleFilesSelected} />
            {formData.attachments.length > 0 && (
              <span className={`text-xs ${themeClasses.textSecondary}`}>
                {formData.attachments.length} archivo{formData.attachments.length !== 1 ? 's' : ''} seleccionado{formData.attachments.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Checkbox */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="agree"
            checked={formData.agree}
            onChange={(e) => handleInputChange('agree', e.target.checked)}
            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="agree" className={`text-sm ${themeClasses.textPrimary}`}>
            Acepto los términos y condiciones 📋
          </label>
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={!formData.name || !formData.email}
        >
          <Send className="w-4 h-4 mr-2" />
          Enviar Formulario 🚀
        </Button>
      </form>

      {/* Respuestas Rápidas */}
      <div className="border-t pt-4">
        <h4 className={`text-sm font-medium ${themeClasses.textPrimary} mb-3`}>
          Respuestas Rápidas ⚡
        </h4>
        <div className="grid grid-cols-2 gap-2">
          {quickReplies.map((reply, index) => (
            <Button
              key={index}
              variant="outline"
              size="sm"
              onClick={() => handleQuickReply(reply)}
              className="text-xs h-8"
            >
              {reply}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatForm;
