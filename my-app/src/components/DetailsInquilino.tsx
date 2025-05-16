"use client";

import { useState, useEffect } from "react";

import { FiAlertTriangle, FiMail, FiPhone, FiClock, FiCheck } from "react-icons/fi";
import { FaWhatsapp, FaStar } from "react-icons/fa";

interface Rental {
  id: number;
  carId: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed';
  owner: string;
  carBrand: string;
  carModel: string;
  rating?: number;
}

interface Inquilino {
  id: number;
  name: string;
  phone: string;
  email: string;
  image: string;
  totalRentals: number;
  rentals: Rental[];
}

interface DetailsInquilinoProps {
  tenantId: number;
  inquilinosData?: Inquilino[];
  onClose?: () => void;
}

const DetailsInquilino = ({ tenantId, inquilinosData, onClose}: DetailsInquilinoProps) => {
  const [inquilino, setInquilino] = useState<Inquilino | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ratingRentalId, setRatingRentalId] = useState<number | null>(null);
  const [currentRating, setCurrentRating] = useState(0);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showInvalidPhoneModal, setShowInvalidPhoneModal] = useState(false);
  const [invalidMessage, setInvalidMessage] = useState('');


  useEffect(() => {
    const fetchInquilino = async () => {
      try {
        if (inquilinosData) {
          const localInquilino = inquilinosData.find(i => i.id === tenantId);
          if (localInquilino) {
            setInquilino(localInquilino);
            setLoading(false);
            return;
          }
        }

        const response = await fetch(`http://localhost:5000/api/inquilinos/${tenantId}/summary`);
        if (!response.ok) {
          throw new Error('No se pudo obtener los datos del inquilino');
        }
        const data = await response.json();

        const completeData = {
          ...data,
          phone: data.phone || data.telefono || 'No disponible',
          email: data.email || data.correo || 'No disponible',
          image: data.image || data.imagen || '/default-profile.png',
          rentals: data.rentals || []
        };

        setInquilino(completeData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchInquilino();
  }, [tenantId, inquilinosData]);

  useEffect(() => {
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && onClose) {
      e.stopPropagation();
      onClose();
    }
  };
  document.addEventListener('keydown', handleKeyDown);
  return () => document.removeEventListener('keydown', handleKeyDown);
}, [onClose]);



  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };
  const handleRateClick = (rentalId: number) => {
    setRatingRentalId(rentalId === ratingRentalId ? null : rentalId);
    setCurrentRating(0);
  };

  const handleStarClick = (rentalId: number, rating: number) => {
    setCurrentRating(rating);
  };

  const handleConfirmRating = async (rentalId: number) => {
    if (currentRating === 0) return;

    try {

      if (inquilino) {
        const updatedRentals = inquilino.rentals.map(rental => {
          if (rental.id === rentalId) {
            return { ...rental, rating: currentRating };
          }
          return rental;
        });

        setInquilino({
          ...inquilino,
          rentals: updatedRentals
        });
      }

      setShowSuccessMessage(true);
      setRatingRentalId(null);

      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 2000);

    } catch (err) {
      setError("Error al guardar la calificación");
    }
  };

  const handleSendMessage = async () => {
    if (!inquilino) {
      setInvalidMessage('No se encontró información del inquilino');
      setShowInvalidPhoneModal(true);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/validate-whatsapp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: inquilino.phone }),
      });

      const data = await response.json();

      if (data.valid) {
        const whatsappUrl = `https://wa.me/${inquilino.phone.replace(/[^\d]/g, '')}`;
        window.open(whatsappUrl, '_blank');
      } else {
        setInvalidMessage(data.message || 'Número no válido');
        setShowInvalidPhoneModal(true);
      }
    } catch (error) {
      setInvalidMessage('Error al validar el número');
      setShowInvalidPhoneModal(true);
    }
  };



  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FCA311]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
        <div className="flex items-center">
          <FiAlertTriangle className="h-5 w-5 text-red-500 mr-3" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!inquilino) {
    return (
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
        <div className="flex items-center">
          <FiAlertTriangle className="h-5 w-5 text-yellow-400 mr-3" />
          <p className="text-sm text-yellow-700">No se encontró información del inquilino</p>
        </div>
      </div>
    );
  }

  const whatsappUrl = `https://wa.me/${inquilino.phone.replace(/[^\d]/g, '')}`;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-3x3 relative">
    {/* Encabezado con título y botón de cierre */}
    <div className="flex justify-between items-center mb-6 pb-2 border-b border-gray-200">
      <h2 className="text-2xl font-bold text-[#FCA311]">Detalles del inquilino</h2>
      <button
        onClick={() => onClose && onClose()}
        className="text-gray-400 hover:text-gray-600 transition-colors duration-200 cursor-pointer"
        aria-label="Cerrar"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

      {showSuccessMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-sm">
            <div className="flex items-center space-x-3 text-green-600">
              <FiCheck className="h-6 w-6" />
              <p className="font-medium">Calificación exitosa</p>
            </div>
          </div>
        </div>
      )}

      {showInvalidPhoneModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 max-w-sm">
            <h2 className="text-lg font-semibold text-[#FCA311] mb-2">Número no válido</h2>
            <p className="text-gray-700 mb-4">{invalidMessage}</p>
            <button
              onClick={() => setShowInvalidPhoneModal(false)}
              className="bg-[#FCA311] text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex flex-col md:flex-row items-center gap-6 mb-4 w-full">
          <div className="flex-shrink-0">
            <div className="w-32 h-32 rounded-full bg-[#E4D5C1] overflow-hidden">
              <img
                src={inquilino.image?.trim() ? inquilino.image : "/default-profile.png"}
                alt={`Foto de ${inquilino.name}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/default-profile.png";
                }}
              />
            </div>
          </div>

          <div className="text-left flex-grow">
            <h3 className="text-[1.728rem] font-semibold text-[#000000]">{inquilino.name}</h3>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center">
                <div className="bg-[#FCA311] p-2 rounded-full mr-3">
                  <FiPhone className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-[0.833rem] text-gray-500">Teléfono</p>
                  <p className="text-[1rem] text-gray-800 font-medium">
                    {inquilino.phone ? (
                      <a href={`tel:${inquilino.phone}`} className="hover:text-[#FCA311] transition-colors">
                        {inquilino.phone}
                      </a>
                    ) : (
                      <span className="text-gray-400">No disponible</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div
                  className="bg-[#25D366] p-2 rounded-full mr-3 cursor-pointer hover:bg-[#1ebe5b] transition"
                  onClick={handleSendMessage}
                >
                  <FaWhatsapp className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-[0.833rem] text-gray-500">WhatsApp</p>
                  <p className="text-[1rem] text-gray-800 font-medium">
                    {inquilino.phone ? (
                      <button
                        onClick={handleSendMessage}
                        className="hover:text-[#25D366] transition-colors text-left"
                      >
                        Enviar mensaje
                      </button>
                    ) : (
                      <span className="text-gray-400">No disponible</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="bg-[#FCA311] p-2 rounded-full mr-3">
                  <FiMail className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-[0.833rem] text-gray-500">Correo</p>
                  <p className="text-[1rem] text-gray-800 font-medium break-all">
                    {inquilino.email ? (
                      <a href={`mailto:${inquilino.email}`} className="hover:text-[#FCA311] transition-colors">
                        {inquilino.email}
                      </a>
                    ) : (
                      <span className="text-gray-400">No disponible</span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="bg-[#FCA311] p-2 rounded-full mr-3">
                  <FiClock className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-[0.833rem] text-gray-500">Total de alquileres</p>
                  <p className="text-[1rem] text-gray-800 font-medium">{inquilino.totalRentals}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mt-6">
      <h3 className="text-xl font-medium text-[#FCA311] mb-4">Historial de alquileres</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-[#FCA311]">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Auto</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Fecha inicio</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Fecha fin</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Estado</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">Dueño</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {inquilino.rentals.length > 0 ? (
                inquilino.rentals.map((rental) => (
                  <tr key={rental.id} className="hover:bg-[#E4D5C1]/30 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                      {rental.carBrand} {rental.carModel}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(rental.startDate)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(rental.endDate)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${rental.status === 'active'
                        ? 'bg-[#FCA311]/20 text-[#FCA311]'
                        : 'bg-gray-100 text-gray-800'
                        }`}>
                        {rental.status === 'active' ? 'Activo' : 'Finalizado'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center justify-between">
                        <span>{rental.owner}</span>

                        {rental.status === 'completed' && rental.owner === 'Tu' && !rental.rating && ratingRentalId !== rental.id && (
                          <button
                            onClick={() => handleRateClick(rental.id)}
                            className="ml-4 bg-[#FCA311] text-white px-4 py-1 rounded text-xs font-medium hover:bg-[#e29100] transition-colors"
                          >
                            Calificar
                          </button>
                        )}

                        {rental.rating && (
                          <div className="flex items-center ml-2">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={`${i < (rental.rating || 0) ? "text-yellow-400" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                        )}

                        {ratingRentalId === rental.id && (
                          <div className="flex items-center ml-2 space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <FaStar
                                key={star}
                                className={`cursor-pointer ${currentRating >= star ? "text-yellow-400" : "text-gray-300"
                                  }`}
                                onClick={() => handleStarClick(rental.id, star)}
                              />
                            ))}
                            <button
                              onClick={() => handleConfirmRating(rental.id)}
                              disabled={currentRating === 0}
                              className={`ml-2 rounded-full p-1 ${currentRating > 0
                                ? "bg-green-500 hover:bg-green-600"
                                : "bg-gray-300 cursor-not-allowed"
                                } text-white transition-colors`}
                            >
                              <FiCheck className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-500">
                    No hay registros de alquileres
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DetailsInquilino;
