"use client";

import { useState, useRef } from "react";
import { FiBell, FiUser, FiX, FiAlertTriangle } from "react-icons/fi";
import { UserType, Car } from '@/types';
import HostView from '@/components/HostView';

// Importar la tipografía Inter
import { Inter } from "next/font/google";

// Configurar la fuente Inter
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

interface Alert {
  id: number;
  car: string;
  model: string;  
  brand: string;  
  tenant: string;
  date: string;
  time: string;
  exceededTime: string;
  returnInfo: string;
  viewed: boolean;
}

export default function Home() {
  const initialAlerts: Alert[] = [
    { 
      id: 1, 
      car: "Kima", 
      model: "Sedan",  
      brand: "Honda",  
      tenant: "Jose Prado", 
      date: "12/07/2025", 
      time: "20:14",
      exceededTime: "2:30 hrs",
      returnInfo: "12/07/2025 - 22:44",
      viewed: false
    },
    { 
      id: 2, 
      car: "Ford", 
      model: "Explorer",
      brand: "Ford",
      tenant: "Juan Perez", 
      date: "12/07/2025", 
      time: "19:45",
      exceededTime: "1:15 hrs",
      returnInfo: "12/07/2025 - 21:00",
      viewed: false
    },
    { 
      id: 3, 
      car: "NISSAN", 
      model: "Sentra",
      brand: "Nissan",
      tenant: "Marcela Rodriguez", 
      date: "11/07/2025", 
      time: "21:14",
      exceededTime: "0:45 hrs",
      returnInfo: "11/07/2025 - 22:00",
      viewed: false
    },
    { 
      id: 4, 
      car: "Toyota", 
      model: "Corolla",
      brand: "Toyota",
      tenant: "Luis Rocha", 
      date: "11/07/2025", 
      time: "19:00",
      exceededTime: "1:00 hrs",
      returnInfo: "11/07/2025 - 20:00",
      viewed: false
    },
    { 
      id: 5, 
      car: "Mazda", 
      model: "CX-5",
      brand: "Mazda",
      tenant: "Carlos López", 
      date: "11/07/2025", 
      time: "18:50",
      exceededTime: "1:40 hrs",
      returnInfo: "11/07/2025 - 20:30",
      viewed: false
    },
    { 
      id: 6, 
      car: "BMW", 
      model: "X3",
      brand: "BMW",
      tenant: "Ana García", 
      date: "10/07/2025", 
      time: "17:30",
      exceededTime: "2:10 hrs",
      returnInfo: "10/07/2025 - 19:40",
      viewed: false
    },
    { 
      id: 7, 
      car: "Mercedes", 
      model: "C-Class",
      brand: "Mercedes-Benz",
      tenant: "Roberto Sánchez", 
      date: "10/07/2025", 
      time: "16:45",
      exceededTime: "3:00 hrs",
      returnInfo: "10/07/2025 - 19:45",
      viewed: false
    },
  ];


  const CARS_DATA: Car[] = [
    {
      id: 1,
      brand: 'Toyota',
      model: 'Corolla',
      year: 2022,
      image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=500&auto=format&fit=crop',
      status: 'Disponible',
      totalRentals: 15,
      totalUsageDays: 42,
      pricePerDay: 45,
      description: 'El Toyota Corolla 2022 es un sedán compacto confiable y eficiente en combustible, perfecto para viajes urbanos.',
      features: ['Aire acondicionado', 'Cámara de retroceso', 'Control crucero', 'Bluetooth']
    },
    {
      id: 2,
      brand: 'Honda',
      model: 'Civic',
      year: 2021,
      image: '',
      status: 'En mantenimiento',
      totalRentals: 22,
      totalUsageDays: 67,
      pricePerDay: 50,
      description: 'El Honda Civic 2021 ofrece un manejo ágil y un interior espacioso con tecnología avanzada.',
      features: ['Asientos de cuero', 'Pantalla táctil', 'Sensores de estacionamiento', 'Apple CarPlay']
    },
    {
      id: 3,
      brand: 'Ford',
      model: 'Mustang',
      year: 2023,
      image: '',
      status: 'Disponible',
      totalRentals: 8,
      totalUsageDays: 18,
      pricePerDay: 90,
      description: 'El Ford Mustang 2023 es un muscle car potente con un diseño icónico y un rendimiento excepcional.',
      features: ['Motor V8', 'Sistema de escape activo', 'Asientos deportivos', 'Modos de conducción']
    },
    {
      id: 4,
      brand: 'Rav',
      model: 'Mustang',
      year: 2021,
      image: '',
      status: 'Disponible',
      totalRentals: 8,
      totalUsageDays: 18,
      pricePerDay: 90,
      description: 'El Ford Mustang 2023 es un muscle car potente con un diseño icónico y un rendimiento excepcional.',
      features: ['Motor V8', 'Sistema de escape activo', 'Asientos deportivos', 'Modos de conducción']
    },
    {
      id: 5,
      brand: 'Nissan',
      model: 'Mustang',
      year: 2020,
      image: '',
      status: 'Disponible',
      totalRentals: 30,
      totalUsageDays: 12,
      pricePerDay: 90,
      description: 'El Ford Mustang 2023 es un muscle car potente con un diseño icónico y un rendimiento excepcional.',
      features: ['Motor V8', 'Sistema de escape activo', 'Asientos deportivos', 'Modos de conducción']
    },
  ].sort((a, b) => b.totalRentals - a.totalRentals);


  const [showAlerts, setShowAlerts] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [showModal, setShowModal] = useState(false);
  const alertsContainerRef = useRef<HTMLDivElement>(null);

  // Calcular el número de alertas no vistas
  const unviewedAlertsCount = alerts.filter(alert => !alert.viewed).length;

  const toggleAlerts = () => setShowAlerts(!showAlerts);
  
  const toggleShowAll = () => {
    setShowAll(!showAll);
    
    if (alertsContainerRef.current) {
      setTimeout(() => {
        if (alertsContainerRef.current) {
          alertsContainerRef.current.scrollTop = 0;
        }
      }, 10);
    }
  };

  const handleDelete = (id: number, e: React.MouseEvent) => {
    e.stopPropagation(); 
    e.preventDefault(); 
    
    setTimeout(() => {
      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    }, 10);
  };

  const handleViewMore = (alert: Alert) => {
    // Marcar la alerta como vista
    setAlerts(prevAlerts => 
      prevAlerts.map(a => 
        a.id === alert.id ? { ...a, viewed: true } : a
      )
    );
    
    setSelectedAlert(alert);
    setShowModal(true);
  };

  return (
    <main className={`min-h-screen bg-white text-black relative ${inter.className}`}>
      {/* Header */}
      <header className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-300">
        <h1 className="text-lg sm:text-xl font-bold text-orange-500">REDIBO</h1>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <button 
            data-id="notification-bell"
            onClick={toggleAlerts} 
            className="relative p-1.5 sm:p-2 border-2 border-orange-400 rounded-full"
          >
            <FiBell className="text-orange-500 text-lg sm:text-xl" />
            {unviewedAlertsCount > 0 && (
              <span className="absolute top-0 right-0 w-2 sm:w-2.5 h-2 sm:h-2.5 bg-red-500 rounded-full" />
            )}
          </button>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-orange-400 flex items-center justify-center">
            <FiUser className="text-white text-lg sm:text-xl" />
          </div>
        </div>
      </header>


      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <HostView cars={CARS_DATA} />
      </main>

      {showAlerts && (
        <div 
          ref={alertsContainerRef}
          className={`absolute right-2 sm:right-6 top-16 sm:top-20 w-[95%] sm:w-[90%] max-w-[440px] bg-[#d9d9d9] rounded-md border border-orange-400 p-3 sm:p-4 shadow-lg z-40 transition-all duration-300 ${showAll ? 'h-[70vh] max-h-[560px]' : 'h-[60vh] max-h-[360px]'}`}
        >
          <div className="flex items-center mb-2 space-x-2">
            <h2 className="text-xs sm:text-sm font-semibold">Alertas</h2>
            <button
              className="text-xs text-white px-2 py-0.5 rounded hover:opacity-90" style={{backgroundColor: '#FCA311'}}
              onClick={toggleShowAll}
            >
              {showAll ? 'Ver menos' : 'Ver todo'}
            </button>
            <span className="text-xs text-gray-600">({alerts.length})</span>
          </div>

          <div className={`h-[calc(100%-3rem)] overflow-y-auto pr-2 sm:pr-8`}>
            {alerts.length > 0 ? (
              <div className="space-y-2 sm:space-y-3">
                {(showAll ? alerts : alerts.slice(0, 3)).map((alert) => (
                  <div 
                    key={alert.id} 
                    className={`group relative bg-[#c4c4c4] border-2 ${!alert.viewed ? 'border-orange-400' : 'border-gray-400'} px-3 sm:px-4 py-2 rounded overflow-visible 
                      transition-all duration-200 hover:bg-[#b4b4b4] hover:scale-[1.01] sm:hover:scale-[1.02] hover:shadow-md cursor-pointer`}
                    onClick={() => handleViewMore(alert)}
                  >
                    <button
                      onClick={(e) => handleDelete(alert.id, e)}
                      className="absolute -right-4 sm:-right-6 top-1/2 transform -translate-y-1/2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-md hover:bg-red-600 z-10"
                    >
                      <FiX size={12} className="sm:hidden" />
                      <FiX size={14} className="hidden sm:block" />
                    </button>

                    <div className="flex justify-between items-center">
                      <p className="text-xs sm:text-sm md:text-base text-black font-bold">Tiempo Excedido!</p>
                      <span className="text-xs text-black">{alert.date} {alert.time}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-1">
                      <div>
                        <p className="text-xs sm:text-sm text-black">Modelo: {alert.model}</p>
                        <p className="text-xs sm:text-sm text-black">Marca: {alert.brand}</p>
                        <p className="text-xs sm:text-sm text-black">Inquilino: {alert.tenant}</p>
                      </div>
                      <button
                        className="text-white text-xs sm:text-sm px-2 sm:px-3 py-1 rounded hover:opacity-90 mt-2 sm:mt-0 sm:ml-4 self-end sm:self-auto" style={{backgroundColor: '#FCA311'}}
                        onClick={(e) => {
                          e.stopPropagation(); 
                          handleViewMore(alert);
                        }}
                      >
                        Ver más
                      </button>
                    </div>
                    
                    {!alert.viewed && (
                      <div className="absolute top-2 left-2 w-1.5 sm:w-2 h-1.5 sm:h-2 bg-red-500 rounded-full"></div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-600 italic mt-4 text-xs sm:text-sm">No hay alertas.</p>
            )}
          </div>

          <h3 className="mt-2 text-xs sm:text-sm font-semibold">Notificaciones</h3>
        </div>
      )}

      {/* Modal - Eliminado el fondo negro */}
      {showModal && selectedAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-[#E4D5C1] rounded-md shadow-lg w-[95%] max-w-md pointer-events-auto">
            
            <div className="bg-[#FCA311] py-2 px-3 sm:px-4 flex items-center justify-between">
              <div className="w-6"></div> 
              <div className="flex items-center justify-center">
                <div className="text-red-600 mr-1 sm:mr-2">
                  <FiAlertTriangle size={16} className="sm:hidden" />
                  <FiAlertTriangle size={20} className="hidden sm:block" />
                </div>
                <span className="font-bold text-black text-xs sm:text-sm md:text-base">ALERTA: TIEMPO EXCEDIDO</span>
              </div>
              <button
                className="text-black hover:text-gray-700 w-6 flex items-center justify-center"
                onClick={() => setShowModal(false)}
              >
                <FiX size={20} className="sm:hidden" />
                <FiX size={24} className="hidden sm:block" />
              </button>
            </div>

            <div className="p-3 sm:p-4">
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                
                <div className="flex flex-col items-center">
                  <div className="w-full sm:w-40 h-24 sm:h-32 bg-gray-200 mb-2 rounded overflow-hidden">
                    <img 
                      src="/api/placeholder/200/160" 
                      alt="Vehículo" 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <p className="text-center font-semibold text-xs sm:text-sm">{selectedAlert.model}</p>
                </div>

                
                <div className="flex-1 space-y-2">
                  <div className="bg-white p-2 rounded">
                    <p className="text-xs sm:text-sm">Nombre inquilino: <strong>{selectedAlert.tenant}</strong></p>
                  </div>
                  
                  <div className="bg-white p-2 rounded">
                    <p className="text-xs sm:text-sm">Tiempo excedido: <strong>{selectedAlert.exceededTime}</strong></p>
                  </div>
                  
                  <div className="bg-white p-2 rounded">
                    <p className="text-xs sm:text-sm">Retorno fecha/hora: <strong>{selectedAlert.returnInfo}</strong></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

