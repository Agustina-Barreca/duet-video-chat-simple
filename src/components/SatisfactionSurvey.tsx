
import React, { useState } from 'react';
import { X, ChevronLeft } from 'lucide-react';
import { Button } from './ui/button';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Slider } from './ui/slider';
import { useTheme } from '../contexts/ThemeContext';

interface SatisfactionSurveyProps {
  onClose: () => void;
  onComplete: () => void;
}

const SatisfactionSurvey: React.FC<SatisfactionSurveyProps> = ({ onClose, onComplete }) => {
  const { getThemeClasses } = useTheme();
  const themeClasses = getThemeClasses();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [npsScore, setNpsScore] = useState([7]);
  const [csatScore, setCSatScore] = useState([4]);
  const [binaryAnswer, setBinaryAnswer] = useState('');
  const [comment, setComment] = useState('');

  const handleNextStep = () => {
    setCurrentStep(2);
  };

  const handlePreviousStep = () => {
    setCurrentStep(1);
  };

  const handleSubmit = () => {
    console.log('Encuesta enviada:', {
      nps: npsScore[0],
      csat: csatScore[0],
      binaryAnswer,
      comment
    });
    onComplete();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className={`${themeClasses.cardBackground} border ${themeClasses.border} rounded-lg p-6 w-96 max-w-[90vw]`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {currentStep === 2 && (
              <button
                onClick={handlePreviousStep}
                className={`p-1 rounded hover:bg-white/10 ${themeClasses.textSecondary} hover:${themeClasses.textPrimary} transition-colors`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            )}
            <h3 className={`text-lg font-semibold ${themeClasses.textPrimary}`}>
              Encuesta de Satisfacción ({currentStep}/2)
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded hover:bg-white/10 ${themeClasses.textSecondary} hover:${themeClasses.textPrimary} transition-colors`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step 1: NPS y CSAT */}
        {currentStep === 1 && (
          <div className="space-y-6">
            {/* NPS Question */}
            <div>
              <label className={`block text-sm font-medium mb-3 ${themeClasses.textPrimary}`}>
                ¿Qué tan probable es que recomiendes nuestro servicio? (0-10)
              </label>
              <Slider
                value={npsScore}
                onValueChange={setNpsScore}
                max={10}
                min={0}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs mt-2">
                <span className={themeClasses.textSecondary}>Muy improbable (0)</span>
                <span className={`font-medium ${themeClasses.textPrimary}`}>{npsScore[0]}</span>
                <span className={themeClasses.textSecondary}>Muy probable (10)</span>
              </div>
            </div>

            {/* CSAT Question */}
            <div>
              <label className={`block text-sm font-medium mb-3 ${themeClasses.textPrimary}`}>
                ¿Qué tan satisfecho estás con nuestro servicio? (1-5)
              </label>
              <Slider
                value={csatScore}
                onValueChange={setCSatScore}
                max={5}
                min={1}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs mt-2">
                <span className={themeClasses.textSecondary}>Muy insatisfecho (1)</span>
                <span className={`font-medium ${themeClasses.textPrimary}`}>{csatScore[0]}</span>
                <span className={themeClasses.textSecondary}>Muy satisfecho (5)</span>
              </div>
            </div>

            <Button
              onClick={handleNextStep}
              className="w-full"
            >
              Siguiente
            </Button>
          </div>
        )}

        {/* Step 2: Pregunta binaria y comentario */}
        {currentStep === 2 && (
          <div className="space-y-6">
            {/* Binary Question */}
            <div>
              <label className={`block text-sm font-medium mb-3 ${themeClasses.textPrimary}`}>
                ¿Volverías a usar nuestro servicio?
              </label>
              <RadioGroup value={binaryAnswer} onValueChange={setBinaryAnswer}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="si" id="si" />
                  <label htmlFor="si" className={`text-sm ${themeClasses.textPrimary}`}>
                    Sí
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="no" />
                  <label htmlFor="no" className={`text-sm ${themeClasses.textPrimary}`}>
                    No
                  </label>
                </div>
              </RadioGroup>
            </div>

            {/* Comment */}
            <div>
              <label className={`block text-sm font-medium mb-2 ${themeClasses.textPrimary}`}>
                Comentarios adicionales (opcional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Comparte tu experiencia..."
                className={`w-full px-3 py-2 text-sm rounded border ${themeClasses.border} ${themeClasses.cardBackground} ${themeClasses.textPrimary} placeholder:${themeClasses.textSecondary} focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none`}
                rows={4}
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!binaryAnswer}
              className="w-full"
            >
              Enviar Encuesta
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SatisfactionSurvey;
