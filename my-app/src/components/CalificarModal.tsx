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

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setRating(0);
        setHoverRating(0);
        setRatingConfirmed(false);
        setComentario('');
        setShowSuccessMessage(false);
        setComentarioEnviado(false);
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

  const handleComentarioChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const value = e.target.value;
    if (value.length <= 500) {
      setComentario(value);
    }
  };

  const enviarComentario = (): void => {
    if (comentario.length >= 10 && rating > 0) {
      setComentarioEnviado(true);
      console.log('Comentario enviado:', comentario);
      console.log('Calificación:', rating);
      
      setTimeout(() => {
        onClose();
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

  const canSubmit = rating > 0 && comentario.length >= 10;

  if (!isOpen || !inquilino) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg border-2 p-6 w-full max-w-md mx-auto relative" style={{ borderColor: '#FCA311' }}>
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
              disabled={comentarioEnviado}
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>
                {comentario.length < 10 ? `Faltan ${10 - comentario.length} caracteres` : 'Mínimo alcanzado'}
              </span>
              <span>{comentario.length}/500</span>
            </div>
          </div>

          <div className="text-center">
            {canSubmit && !comentarioEnviado && (
              <button
                onClick={enviarComentario}
                className="text-white px-8 py-2 rounded-md font-medium hover:opacity-90 transition-colors"
                style={{ backgroundColor: '#FCA311' }}
              >
                ENVIAR
              </button>
            )}

            {!canSubmit && !comentarioEnviado && (
              <div className="text-sm text-gray-500">
                {rating === 0 && comentario.length < 10 
                  ? "Selecciona una calificación y escribe un comentario para continuar"
                  : rating === 0 
                  ? "Selecciona una calificación para continuar"
                  : "Completa el comentario para continuar"
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