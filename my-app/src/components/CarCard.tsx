'use client';
import { useState } from 'react';
import CarModal from './CarModal';
import { Car } from '@/types';
import Image from 'next/image';

interface CarCardProps {
  car: Car;
}

export default function CarCard({ car }: CarCardProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const getCarImage = () => 
    car.image || 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=500&auto=format&fit=crop';

  return (
    <>
      <div 
        className="bg-white rounded-lg shadow-md overflow-hidden relative"
        style={{
          fontFamily: 'Inter, sans-serif',
          border: '1px solid #E4D5C1'
        }}
      >
        <div className="relative h-36 bg-gray-200"> {/* Altura reducida */}
          <Image
            src={getCarImage()}
            alt={`${car.brand} ${car.model}`}
            fill
            className="object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=500&auto=format&fit=crop';
            }}
          />
        </div>
        
        <div className="p-3"> {/* Padding reducido */}
          <h3 className="text-center font-semibold mb-2 text-base" style={{ color: '#11295B' }}>
            {car.brand} {car.model}
          </h3>
          
          <div className="mb-3 space-y-1">
            <p className="text-sm font-medium text-gray-900">Alquilado: {car.totalRentals} veces</p>
            <p className="text-sm font-medium text-gray-900">Uso total: {car.totalUsageDays} días</p>
          </div>
          
          <div className="flex justify-center">
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-3 py-1.5 text-sm font-semibold rounded-md hover:opacity-90 transition"
              style={{ backgroundColor: '#FCA311', color: '#FFFFFF' }}
            >
              Ver más
            </button>
          </div>
        </div>
      </div>
      
      {isModalOpen && (
        <CarModal 
          car={car}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
