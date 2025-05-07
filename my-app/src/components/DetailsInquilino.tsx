"use client";

import { useState, useEffect } from "react";
import { FiAlertTriangle, FiMail, FiPhone, FiClock } from "react-icons/fi";

interface Rental {
  id: number;
  carId: number;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed';
  owner: string;
  carBrand: string;
  carModel: string;
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
}

const DetailsInquilino = ({ tenantId, inquilinosData}: DetailsInquilinoProps) => {
  const [inquilino, setInquilino] = useState<Inquilino | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      timeZone: 'UTC'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
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

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8 w-full">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex flex-col md:flex-row items-center gap-6 mb-4 w-full">
          <div className="flex-shrink-0">
            <div className="w-32 h-32 rounded-full bg-[#E4D5C1] overflow-hidden">
              <img 
                src={inquilino.image} 
                alt={`Foto de ${inquilino.name}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = '/default-profile.png';
                }}
              />
            </div>
          </div>
          
          {/* Información principal */}
          <div className="text-left flex-grow">
            <h3 className="text-[1.728rem] font-semibold text-[#000000]">{inquilino.name}</h3>
            
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Teléfono */}
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
              
              {/* Correo */}
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
              
              {/* Total de alquileres */}
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
      
      {/* Historial de alquileres */}
      <div className="mt-8">
        <h3 className="text-[1.44rem] font-medium text-[#FCA311] mb-4">Historial de alquileres</h3>
        
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
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        rental.status === 'active' 
                          ? 'bg-[#FCA311]/20 text-[#FCA311]' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {rental.status === 'active' ? 'Activo' : 'Finalizado'}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {rental.owner}
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