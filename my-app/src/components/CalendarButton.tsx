import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import MonthView from './MonthView';
import DetailsInquilino from './DetailsInquilino';

interface Inquilino {
  id: number;
  name: string;
  phone: string;
  email: string;
  image: string;
  totalRentals: number;
  rentals: {
    id: number;
    carId: number;
    startDate: string;
    endDate: string;
    status: 'active' | 'completed';
    owner: string;
    carBrand: string;
    carModel: string;
  }[];
}


export default function CalendarButton() {
  const [showDashboard, setShowDashboard] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear] = useState<number>(new Date().getFullYear());
  const [showInquilinoModal, setShowInquilinoModal] = useState(false);
  const [selectedInquilinoId, setSelectedInquilinoId] = useState<number | null>(null);
  const [inquilinos, setInquilinos] = useState<Inquilino[]>([]);
  const [selectedInquilino, setSelectedInquilino] = useState<Inquilino | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

interface Props {
  showDashboard: boolean;
  toggleDashboard: () => void;
  closeDashboard: () => void;
}

  const toggleDashboard = () => {
    setShowDashboard(!showDashboard)
  }

  const closeDashboard = () => {
    setShowDashboard(false)
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDashboard()
    }

    if (showDashboard) {
      document.addEventListener('keydown', onKey)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [showDashboard])

  useEffect(() => {
    const fetchInquilinos = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/inquilinos');
        const data = await response.json();
        setInquilinos(data);
      } catch (error) {
        console.error("Error cargando inquilinos:", error);
      }
    };
    fetchInquilinos();
  }, []);

  useEffect(() => {
    const storedMonth = localStorage.getItem('selectedMonth')
    const storedView = localStorage.getItem('currentView')
    if (storedView === 'monthView' && storedMonth !== null) {
      setSelectedMonth(parseInt(storedMonth))
    }
  }, [])

  const handleMonthSelect = (month: number) => {
    setSelectedMonth(month)
    localStorage.setItem('selectedMonth', month.toString())
    localStorage.setItem('currentView', 'monthView')
  }

  const resetMonthSelection = () => {
    setSelectedMonth(null)
    localStorage.setItem('currentView', 'selectMonth')
  }

  return (
    <div className="relative z-20">
      {/* Botón flotante */}
      <button
        onClick={toggleDashboard}
        ref={buttonRef}
        className="p-2 rounded-full transition-all duration-300 ease-in-out
                   absolute top-[60px] right-10 z-20 shadow-md hover:shadow-xl
                   hover:scale-110 hover:rotate-1 hover:bg-blue-100 cursor-pointer"
      >
        <Image src="/calendar.png" alt="Calendario" width={50} height={50} />
      </button>

      {showDashboard && (
        <div className="fixed inset-0 z-[999] overflow-y-auto">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-70"
            onClick={closeDashboard}
          />

          {/* Panel */}
          <div
            onClick={(e) => e.stopPropagation()}
            className="absolute top-[60px] left-1/2 transform -translate-x-1/2
                       w-[95%] sm:w-[85%] md:w-[80%] lg:w-[75%] xl:w-[60%] 2xl:w-[60%]
                       max-h-[80vh] bg-[#D9D9D9] text-black shadow-xl p-2 sm:p-10 md:p-12
                       rounded-lg transition-all duration-300 z-[1000] overflow-visible"
          >
            {/* Botón de cierre */}
            <button
              onClick={closeDashboard}
              className="absolute top-4 right-4 text-4xl text-black transition-all duration-200
                         hover:text-red-600 hover:scale-140 cursor-pointer"
            >
              &times;
            </button>

            {/* Encabezado */}
            <div className="flex items-center justify-center mb-4">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mr-2">
                Cronograma
              </h2>
              <div className="p-1">
                <Image src="/calendar.png" alt="Calendario" width={40} height={40} />
              </div>
            </div>

            {/* Año y Mes */}
            <div className="flex items-center mb-6">
              <div className="mr-6">
                <p className="text-sm text-gray-700 inline-block mr-2">Año:</p>
                <div className="inline-flex px-3 py-1 bg-white text-[#11295B] font-semibold
                                rounded-md shadow-sm border border-gray-300">
                  {selectedYear}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-700 inline-block mr-2">Mes:</p>
                <div
                  className="inline-flex px-3 py-1 bg-white text-[#11295B] font-semibold
                            rounded-md shadow-sm border border-gray-300 cursor-pointer
                            hover:bg-blue-50 hover:border-blue-400 hover:shadow
                            transition-all duration-200"
                  onClick={resetMonthSelection}
                >
                  {selectedMonth !== null
                    ? (() => {
                        const mes = new Date(selectedYear, selectedMonth).toLocaleString('es-ES', { month: 'long' })
                        return mes.charAt(0).toUpperCase() + mes.slice(1).toLowerCase()
                      })()
                    : 'No seleccionado'}
                </div>
              </div>
            </div>

            {/* Contenido dinámico */}
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(80vh - 200px)' }}>
              {selectedMonth === null ? (
                <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 justify-items-center">
                  {Array.from({ length: 12 }, (_, i) => {
                    const mes = new Date(0, i).toLocaleString('es-ES', { month: 'long' })
                    const mesFormateado = mes.charAt(0).toUpperCase() + mes.slice(1).toLowerCase()
                    return (
                      <button
                        key={i}
                        onClick={() => handleMonthSelect(i)}
                        className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 xl:w-40 xl:h-40 
                                   rounded-full font-semibold transition-all duration-200 cursor-pointer 
                                   bg-[#11295B] hover:bg-[#3a5c9c] text-white shadow-xl border border-white/20 
                                   hover:scale-105 hover:shadow-2xl flex justify-center items-center text-center
                                   text-xs sm:text-sm md:text-base"
                      >
                        {mesFormateado}
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div>
                  <MonthView 
  month={selectedMonth} 
  year={selectedYear}
  inquilinosData={inquilinos}
  onInquilinoClick={(id) => {
    setSelectedInquilinoId(id);
    setShowInquilinoModal(true);
  }}
/>
                  <button
                    onClick={resetMonthSelection}
                    className="mt-4 px-4 py-2 text-sm sm:px-5 sm:py-2.5 sm:text-base md:px-6 md:py-3 md:text-base 
                               bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md 
                               hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105 self-center"
                  >
                    Volver a los meses
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Modal para DetailsInquilino */}
      {showInquilinoModal && selectedInquilinoId && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex items-center justify-center p-4"
          onClick={() => setShowInquilinoModal(false)}
        >
          <div 
            className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >

            <DetailsInquilino
              tenantId={selectedInquilinoId}
              inquilinosData={inquilinos}
              onClose={() => setShowInquilinoModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  )
}
