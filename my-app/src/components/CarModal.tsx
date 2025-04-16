
'use client';

import { Car } from '@/types';
import Image from 'next/image';

interface CarModalProps {
  car: Car;
  onClose: () => void;
}

export default function CarModal({ car, onClose }: CarModalProps) {
  const getCarImage = () => 
    car.image || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=500&auto=format&fit=crop';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold text-gray-800">
              {car.brand} {car.model} ({car.year})
            </h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="mt-4 relative h-64 bg-gray-200 rounded-lg">
            <Image
              src={getCarImage()}
              alt={`${car.brand} ${car.model}`}
              fill
              className="object-cover rounded-lg"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=500&auto=format&fit=crop';
              }}
            />
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Estadísticas de Uso</h3>
              <div className="mt-2 space-y-3">
                <div>
                  <p className="font-medium">Total de veces alquilado:</p>
                  <p className="text-xl font-bold">{car.totalRentals}</p>
                </div>
                <div>
                  <p className="font-medium">Tiempo total de uso:</p>
                  <p className="text-xl font-bold">{car.totalUsageDays} días</p>
                </div>
                <div>
                  <p className="font-medium">Precio por día:</p>
                  <p className="text-xl font-bold">${car.pricePerDay}</p>
                </div>
                <div>
                  <p className="font-medium">Estado:</p>
                  <span className={`px-2 py-1 text-sm rounded-full ${
                    car.status === 'Disponible' ? 'bg-green-100 text-green-800' : 
                    car.status === 'En mantenimiento' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {car.status}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Características</h3>
              <ul className="mt-2 grid grid-cols-2 gap-2">
                {car.features?.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="w-4 h-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800">Descripción</h3>
            <p className="mt-2 text-gray-600">{car.description}</p>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}