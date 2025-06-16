
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
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className={`${themeClasses.cardBackground} border-2 ${themeClasses.border} rounded-xl p-8 w-[480px] max-w-[90vw] shadow-2xl`}>
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            {currentStep === 2 && (
              <button
                onClick={handlePreviousStep}
                className={`p-2 rounded-lg hover:bg-white/20 ${themeClasses.textPrimary} transition-colors`}
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            <h3 className={`text-xl font-bold ${themeClasses.textPrimary}`}>
              Encuesta de Satisfacción ({currentStep}/2)
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-lg hover:bg-white/20 ${themeClasses.textPrimary} transition-colors`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step 1: NPS y CSAT */}
        {currentStep === 1 && (
          <div className="space-y-8">
            {/* NPS Question */}
            <div>
              <label className={`block text-base font-semibold mb-4 ${themeClasses.textPrimary}`}>
                ¿Qué tan probable es que recomiendes nuestro servicio? (0-10)
              </label>
              <Slider
                value={npsScore}
                onValueChange={setNpsScore}
                max={10}
                min={0}
                step={1}
                className="w-full mb-3"
              />
              <div className="flex justify-between text-sm mt-3">
                <span className={`${themeClasses.textPrimary} font-medium`}>Muy improbable (0)</span>
                <span className={`font-bold text-lg ${themeClasses.textPrimary} bg-blue-500/20 px-3 py-1 rounded-full`}>{npsScore[0]}</span>
                <span className={`${themeClasses.textPrimary} font-medium`}>Muy probable (10)</span>
              </div>
            </div>

            {/* CSAT Question */}
            <div>
              <label className={`block text-base font-semibold mb-4 ${themeClasses.textPrimary}`}>
                ¿Qué tan satisfecho estás con nuestro servicio? (1-5)
              </label>
              <Slider
                value={csatScore}
                onValueChange={setCSatScore}
                max={5}
                min={1}
                step={1}
                className="w-full mb-3"
              />
              <div className="flex justify-between text-sm mt-3">
                <span className={`${themeClasses.textPrimary} font-medium`}>Muy insatisfecho (1)</span>
                <span className={`font-bold text-lg ${themeClasses.textPrimary} bg-green-500/20 px-3 py-1 rounded-full`}>{csatScore[0]}</span>
                <span className={`${themeClasses.textPrimary} font-medium`}>Muy satisfecho (5)</span>
              </div>
            </div>

            <Button
              onClick={handleNextStep}
              size="lg"
              className="w-full text-base font-semibold py-3"
            >
              Siguiente →
            </Button>
          </div>
        )}

        {/* Step 2: Pregunta binaria y comentario */}
        {currentStep === 2 && (
          <div className="space-y-6">
            {/* Binary Question */}
            <div>
              <label className={`block text-base font-semibold mb-4 ${themeClasses.textPrimary}`}>
                ¿Volverías a usar nuestro servicio?
              </label>
              <RadioGroup value={binaryAnswer} onValueChange={setBinaryAnswer} className="space-y-4">
                <div className={`flex items-center space-x-3 p-3 rounded-lg border-2 ${binaryAnswer === 'si' ? 'border-green-500 bg-green-500/10' : `border-transparent ${themeClasses.buttonSecondary}`} transition-all`}>
                  <RadioGroupItem value="si" id="si" className="text-green-500" />
                  <label htmlFor="si" className={`text-base font-medium ${themeClasses.textPrimary} cursor-pointer flex-1`}>
                    ✅ Sí, definitivamente
                  </label>
                </div>
                <div className={`flex items-center space-x-3 p-3 rounded-lg border-2 ${binaryAnswer === 'no' ? 'border-red-500 bg-red-500/10' : `border-transparent ${themeClasses.buttonSecondary}`} transition-all`}>
                  <RadioGroupItem value="no" id="no" className="text-red-500" />
                  <label htmlFor="no" className={`text-base font-medium ${themeClasses.textPrimary} cursor-pointer flex-1`}>
                    ❌ No, probablemente no
                  </label>
                </div>
              </RadioGroup>
            </div>

            {/* Comment */}
            <div>
              <label className={`block text-base font-semibold mb-3 ${themeClasses.textPrimary}`}>
                Comentarios adicionales (opcional)
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Comparte tu experiencia... 💭"
                className={`w-full px-4 py-3 text-base rounded-lg border-2 ${themeClasses.border} ${themeClasses.cardBackground} ${themeClasses.textPrimary} placeholder:${themeClasses.textSecondary} focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-colors`}
                rows={4}
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={!binaryAnswer}
              size="lg"
              className="w-full text-base font-semibold py-3"
            >
              🚀 Enviar Encuesta
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SatisfactionSurvey;
