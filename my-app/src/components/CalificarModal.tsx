'use client';

import React, { useState, useEffect } from 'react';

interface Inquilino {
  id: number;
  nombre: string;
  foto: string;
  calificacion: number;
  comentarios: number;
  verificado: boolean;
  puedeCalificar?: boolean;
}

interface CalificarModalProps {
  isOpen: boolean;
  onClose: () => void;
  inquilino: Inquilino | null;
}

const CalificarModal: React.FC<CalificarModalProps> = ({ isOpen, onClose, inquilino }) => {
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [ratingConfirmed, setRatingConfirmed] = useState<boolean>(false);
  const [comentario, setComentario] = useState<string>('');
  const [showSuccessMessage, setShowSuccessMessage] = useState<boolean>(false);
  const [comentarioEnviado, setComentarioEnviado] = useState<boolean>(false);
  
  const [warningMessage, setWarningMessage] = useState<string>('');
  const [showWarning, setShowWarning] = useState<boolean>(false);
  
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string>('');
  const [showSubmitError, setShowSubmitError] = useState<boolean>(false);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setRating(0);
        setHoverRating(0);
        setRatingConfirmed(false);
        setComentario('');
        setShowSuccessMessage(false);
        setComentarioEnviado(false);
        setWarningMessage('');
        setShowWarning(false);
        setIsSubmitting(false);
        setSubmitError('');
        setShowSubmitError(false);
      }, 300);
    }
  }, [isOpen]);

  const handleStarClick = (starValue: number): void => {
    if (!ratingConfirmed) {
      setRating(starValue);
    }
  };

  const handleStarHover = (starValue: number): void => {
    if (!ratingConfirmed) {
      setHoverRating(starValue);
    }
  };

  const handleStarLeave = (): void => {
    if (!ratingConfirmed) {
      setHoverRating(0);
    }
  };

  const confirmarCalificacion = (): void => {
    setRatingConfirmed(true);
    setShowSuccessMessage(true);
    
    setTimeout(() => {
      setShowSuccessMessage(false);
    }, 2000);
  };


  const validateForbiddenCharacters = (text: string): boolean => {
    const forbiddenChars = /[#@$%^&*]/;
    return forbiddenChars.test(text);
  };

  const isOnlyNumeric = (text: string): boolean => {
    const trimmedText = text.trim();
    return /^\d+$/.test(trimmedText) && trimmedText.length > 0;
  };

  const isOnlyWhitespace = (text: string): boolean => {
    return text.trim().length === 0 && text.length > 0;
  };

  const capitalizeText = (text: string): string => {
    return text.replace(/(^|\. )([a-z])/g, (match, prefix, letter) => {
      return prefix + letter.toUpperCase();
    });
  };

  const normalizeSpaces = (text: string): string => {
    return text.replace(/\s+/g, ' ');
  };

  const isNonsenseComment = (text: string): boolean => {
    const trimmedText = text.trim().toLowerCase();
    if (trimmedText.length === 0) return false;
    
    const repeatedChars = /(.)\1{2,}/.test(trimmedText);
    
    const nonsensePattern = /[bcdfghjklmnpqrstvwxyz]{5,}/i.test(trimmedText);
    
    const longNumberSequence = /\d{4,}/.test(trimmedText);
    
    const numberLetterMix = /^\d{4,}[a-z]+$/i.test(trimmedText.replace(/\s/g, '')) || 
                           /^[a-z]+\d{4,}$/i.test(trimmedText.replace(/\s/g, ''));
    
    const longNumberAtEnd = /[a-z\s]+\d{4,}$/i.test(trimmedText);
     
    const longNumberAtStart = /^\d{4,}[a-z\s]+/i.test(trimmedText);
    
    const words = trimmedText.split(/\s+/).filter(word => word.length > 0);
    const wordCounts: Record<string, number> = {};
    let maxRepetitions = 0;
    
    words.forEach(word => {
      wordCounts[word] = (wordCounts[word] || 0) + 1;
      maxRepetitions = Math.max(maxRepetitions, wordCounts[word]);
    });
    
    const excessiveWordRepetition = maxRepetitions > 3;
    
    const highRepetitionRatio = words.length >= 3 && 
      (Object.values(wordCounts).filter((count: number) => count > 1).length / Object.keys(wordCounts).length) > 0.7;
    

    const sameWordPattern = /\b(\w+)(\s+\1){3,}\b/i.test(trimmedText);
    
   
    const meaningfulWords = words.filter(word => {
      return word.length >= 3 && 
             /[aeiouáéíóú]/i.test(word) && 
             !/^\d+$/.test(word) && 
             word.length <= 15; 
    });
    
    const uniqueMeaningfulWords = [...new Set(meaningfulWords)];
    const hasRealContent = uniqueMeaningfulWords.length >= 2;
    

    const specialCharPattern = /[\/\)\(\!\?\.\,\;\:]{4,}/.test(trimmedText);
    
    const digitCount = (trimmedText.match(/\d/g) || []).length;
    const letterCount = (trimmedText.match(/[a-záéíóúñ]/gi) || []).length;
    const totalRelevantChars = digitCount + letterCount;
    const excessiveNumbers = totalRelevantChars > 0 && (digitCount / totalRelevantChars) > 0.4;
    
  
    const veryLongWords = words.some(word => word.length > 15);
    
    const vowelCount = (trimmedText.match(/[aeiouáéíóú]/gi) || []).length;
    const consonantCount = (trimmedText.match(/[bcdfghjklmnpqrstvwxyzñ]/gi) || []).length;
    const totalLetters = vowelCount + consonantCount;
    const tooFewVowels = totalLetters > 5 && (vowelCount / totalLetters) < 0.2;
    
    return repeatedChars || 
           nonsensePattern || 
           longNumberSequence ||
           numberLetterMix || 
           longNumberAtEnd ||
           longNumberAtStart ||
           excessiveWordRepetition ||
           highRepetitionRatio ||
           sameWordPattern ||
           specialCharPattern ||
           excessiveNumbers ||
           veryLongWords ||
           tooFewVowels ||
           !hasRealContent;
  };

  const showWarningMessage = (message: string): void => {
    setWarningMessage(message);
    setShowWarning(true);
    setTimeout(() => {
      setShowWarning(false);
    }, 4000);
  };

  const handleComentarioChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    let value = e.target.value;
    
    const forbiddenChars = /[#@$%^&*]/g;
    if (forbiddenChars.test(value)) {
      showWarningMessage("El comentario no debe contener estos caracteres: #,@,$,%,^,&,*");
     
      value = value.replace(forbiddenChars, '');
    }
    

    value = normalizeSpaces(value);
    
    value = capitalizeText(value);
    
    const trimmedLength = value.trim().length;
    if (trimmedLength > 500) {
      showWarningMessage("Has excedido el límite máximo de 500 caracteres permitidos.");
      return; 
    }

    setComentario(value);
  };

  const validateComment = (): { isValid: boolean; message?: string } => {
    const trimmedComment = comentario.trim();

    if (trimmedComment.length < 10) {
      return { isValid: false, message: `Faltan ${10 - trimmedComment.length} caracteres` };
    }

    if (isOnlyWhitespace(comentario)) {
      return { isValid: false, message: "El comentario no puede estar vacío" };
    }

    if (isOnlyNumeric(trimmedComment)) {
      return { isValid: false, message: "No se permite comentarios numéricos" };
    }

    if (isNonsenseComment(trimmedComment)) {
      return { isValid: false, message: "Escriba el comentario de forma clara" };
    }

    return { isValid: true };
  };

  const validateNonsenseOnSubmit = (): boolean => {
    const validation = validateComment();
    if (!validation.isValid && validation.message && 
        (validation.message.includes("forma clara") || 
         validation.message.includes("numéricos") || 
         validation.message.includes("vacío"))) {
      showWarningMessage(validation.message);
      return false;
    }
    return true;
  };

  const enviarComentario = (): void => {
    const validation = validateComment();
    
    if (!validateNonsenseOnSubmit()) {
      return;
    }
    
    if (validation.isValid && rating > 0) {
      const commentToSend = comentario.trim();
      
      setIsSubmitting(true);
      setShowSubmitError(false);
      
      setTimeout(() => {
        console.log('Comentario que se enviaría:', {
          comentario: commentToSend,
          rating: rating,
          inquilinoId: inquilino?.id
        });
        
        setIsSubmitting(false);
        setComentarioEnviado(true);
        
        setTimeout(() => {
          onClose();
        }, 1500);
      }, 1000);
    }
  };

  const renderStars = (): React.ReactElement[] => {
    const stars: React.ReactElement[] = [];
    const displayRating = hoverRating || rating;

    for (let i = 1; i <= 5; i++) {
      stars.push(
        <button
          key={i}
          onClick={() => handleStarClick(i)}
          onMouseEnter={() => handleStarHover(i)}
          onMouseLeave={handleStarLeave}
          disabled={ratingConfirmed}
          className={`text-3xl transition-colors duration-200 ${
            ratingConfirmed ? 'cursor-default' : 'cursor-pointer hover:scale-110'
          } ${
            i <= displayRating ? 'text-yellow-400' : 'text-gray-300'
          }`}
        >
          ★
        </button>
      );
    }

    return stars;
  };

  const validation = validateComment();
  const canSubmit = rating > 0 && validation.isValid && !isSubmitting;

  if (!isOpen || !inquilino) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg border-2 p-6 w-full max-w-md mx-auto relative min-h-fit" style={{ borderColor: '#FCA311' }}>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          ×
        </button>

        <h2 className="text-xl font-semibold text-gray-800 mb-6">Calificar</h2>

        <div className="flex items-start space-x-4 mb-4">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-xl flex-shrink-0">
            {inquilino.foto ? (
              <img 
                src={inquilino.foto} 
                alt={inquilino.nombre}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = inquilino.nombre.split(' ').map(n => n[0]).join('');
                  }
                }}
              />
            ) : (
              inquilino.nombre.split(' ').map(n => n[0]).join('')
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg text-gray-800">
              {inquilino.nombre}
            </h3>
            <p className="text-sm text-gray-600">
              Auto alquilado: <span className="text-blue-600 font-medium">Toyota Corolla</span>
            </p>
            <p className="text-sm text-gray-600">
              Fecha finalización: <span className="font-medium">18 mayo 2025</span>
            </p>

            <div className="flex items-center space-x-2 mt-3">
              <div className="flex space-x-1">
                {renderStars()}
              </div>
              {rating > 0 && !ratingConfirmed && (
                <button
                  onClick={confirmarCalificacion}
                  className="bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-medium hover:bg-blue-600 transition-colors"
                >
                  OK
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mb-6">
          {showSuccessMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-md text-sm mb-2 text-center">
              Calificación enviada exitosamente
            </div>
          )}
          
          {showWarning && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-md text-sm mb-2 text-center">
              {warningMessage}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Agregar comentario:
            </label>
            <textarea
              value={comentario}
              onChange={handleComentarioChange}
              placeholder="Escribe tu comentario aquí... (mínimo 10 caracteres)"
              className="w-full p-3 border border-gray-300 rounded-md resize-none h-24 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ backgroundColor: '#D3D3D3' }}
              disabled={comentarioEnviado || isSubmitting}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span className={validation.message && (validation.message.includes("forma clara") || validation.message.includes("numéricos") || validation.message.includes("vacío")) ? "text-red-600" : ""}>
                {validation.message || (comentario.trim().length >= 10 ? 'Mínimo alcanzado' : `Faltan ${10 - comentario.trim().length} caracteres`)}
              </span>
              <span>{comentario.trim().length}/500 caracteres</span>
            </div>
          </div>

          <div className="text-center">
            {canSubmit && !comentarioEnviado && (
              <button
                onClick={enviarComentario}
                disabled={isSubmitting}
                className={`text-white px-8 py-2 rounded-md font-medium transition-colors ${
                  isSubmitting ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'
                }`}
                style={{ backgroundColor: '#FCA311' }}
              >
                {isSubmitting ? 'ENVIANDO...' : 'ENVIAR'}
              </button>
            )}

            {!canSubmit && !comentarioEnviado && (
              <div className="text-sm text-red-600 text-center">
                {rating === 0 && comentario.trim().length < 10 
                  ? "Selecciona una calificación y escribe un comentario para continuar"
                  : rating === 0 
                  ? "Selecciona una calificación para continuar"
                  : validation.message || "Completa el comentario para continuar"
                }
              </div>
            )}

            {comentarioEnviado && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded-md text-sm">
                ¡Comentario enviado exitosamente!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalificarModal;