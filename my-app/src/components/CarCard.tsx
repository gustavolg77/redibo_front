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
  const defaultImage = 'https://images.unsplash.com/photo-1596165494776-c27e37f666fe?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
  const [imgSrc, setImgSrc] = useState(car.image || defaultImage);

  return (
    <>
      <div 
        className="bg-white rounded-xl shadow-md overflow-hidden relative transform transition-all duration-300 ease-in-out hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl hover:ring-2 hover:ring-[#FCA311]/30"
        style={{
          fontFamily: 'Inter, sans-serif',
          border: '1px solid #E4D5C1'
        }}
      >
        <div className="relative h-36 bg-gray-200">
          <Image
            src={imgSrc}
            alt={`${car.brand} ${car.model}`}
            fill
            className="object-cover"
            onError={() => setImgSrc(defaultImage)}
          />
        </div>

        <div className="p-3">
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
              className="px-3 py-1.5 text-sm font-semibold rounded-md transition-transform transform hover:scale-105 hover:shadow-md cursor-pointer"
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
