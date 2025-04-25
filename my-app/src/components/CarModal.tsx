'use client';

import { Car } from '@/types';
import Image from 'next/image';

interface CarModalProps {
  car: Car;
  onClose: () => void;
}

export default function CarModal({ car, onClose }: CarModalProps) {
  const fallback = (value: any) => (value && value !== '' ? value : '-');

  const getCarImage = () =>
    car.image || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=500&auto=format&fit=crop';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl relative flex flex-col md:flex-row overflow-hidden max-h-[90vh] overflow-y-auto">

        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black z-10"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Sección izquierda: imagen + TOP */}
        <div className="md:w-1/2 w-full p-4 flex flex-col items-center">
          <div className="relative w-full h-56 md:h-72 rounded-lg overflow-hidden bg-gray-100">
            <Image
              src={getCarImage()}
              alt={`${fallback(car.brand)} ${fallback(car.model)}`}
              fill
              className="object-cover"
            />
          </div>
          <div className="mt-4 text-center">
            <p className="text-lg font-bold">
              TOP: {fallback(car.topRank)}{' '}
              <span className="inline-block text-yellow-400 text-2xl">★</span>
            </p>
          </div>
        </div>

        {/* Sección derecha: información */}
        <div className="md:w-1/2 w-full p-6 flex flex-col justify-center space-y-3">
          <h3 className="text-xl font-semibold">Información del automóvil</h3>
          <p><strong>Nombre Dueño:</strong> {fallback(car.owner)}</p>
          <p><strong>Marca Vehículo:</strong> {fallback(car.brand)}</p>
          <p><strong>Modelo:</strong> {fallback(car.model)}</p>
          <p><strong>Color:</strong> {fallback(car.color)}</p>
          <p><strong>Veces Alquilado:</strong> {fallback(car.totalRentals)}</p>

          <div className="mt-4">
            <h4 className="text-lg font-semibold">Estado del automóvil:</h4>
            <p className="text-base">
              {car.status === 'Disponible' ? 'Libre' : car.status === 'Rentado' ? 'Rentado' : '-'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
