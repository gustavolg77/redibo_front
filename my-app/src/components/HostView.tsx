'use client';

import { Car } from '@/types';
import CarCard from './CarCard';
import { useState } from 'react';

type CarStatus = 'Mis Autos' | 'Actividad de automoviles';
export default function HostView({ cars }: { cars: Car[] }) {
  const [carStatus, setCarStatus] = useState<CarStatus>('Actividad de automoviles');

  return (
    <div className="px-4 py-6 sm:px-0">
      {/* Panel de filtros */}
      <div className="bg-white shadow-sm rounded-lg mb-6 p-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {(['Mis Autos', 'Actividad de automoviles'] as CarStatus[]).map((status) => (
              <button
                key={status}
                onClick={() => setCarStatus(status)}
                className={`px-3 py-2 rounded-md text-sm font-medium ${
                  carStatus === status 
                    ? 'bg-orange-100 text-blue-800' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cars
          .filter(car => carStatus === 'Actividad de automoviles' || car.status === carStatus)
          .map((car) => (
            <CarCard 
              key={car.id} 
              car={car}
            />
          ))}
      </div>
    </div>
  );
}