import React, { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import MonthView from './MonthView';  // Asegúrate de importar el componente correctamente

export default function CalendarButton() {
  const [showDashboard, setShowDashboard] = useState(false)
  const [iconCentered, setIconCentered] = useState(false)

  const dashboardRef = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)
  const [selectedYear] = useState<number>(new Date().getFullYear())

  const toggleDashboard = () => {
    setShowDashboard(!showDashboard)
    setIconCentered(true)
  }

  const closeDashboard = () => {
    setShowDashboard(false)
    setIconCentered(false)
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dashboardRef.current &&
        !dashboardRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        closeDashboard()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative">
      {/* Botón flotante del calendario */}
      {!showDashboard && (
        <button
          onClick={toggleDashboard}
          className="p-2 rounded-lg transition absolute top-[60px] right-4 z-50"
          ref={buttonRef}
          style={{
            transition: 'transform 0.3s ease',
            transform: iconCentered ? 'translate(-50%, -50%)' : 'none',
          }}
        >
          <Image src="/calendar.png" alt="Calendario" width={45} height={45} />
        </button>
      )}

      {/* Dashboard del calendario */}
      {showDashboard && (
        <div
          ref={dashboardRef}
          className="absolute top-[60px] left-1/2 transform -translate-x-1/2 w-[80%] h-[80vh] bg-[#D9D9D9] text-black shadow-xl p-6 z-40 overflow-auto border-none rounded-lg transition-all duration-300 ease-in-out scale-100 backdrop-blur-lg bg-opacity-80"
        >
          {/* Botón de cierre */}
          <button
            onClick={closeDashboard}
            className="absolute top-4 right-4 text-4xl text-black hover:text-gray-600 transition"
          >
            &times;
          </button>

          {/* Encabezado */}
          <div className="flex items-center justify-center mb-4">
            <h2 className="text-2xl font-bold mr-4">Cronograma</h2>
            <button onClick={toggleDashboard} className="p-2 rounded-lg transition">
              <Image src="/calendar.png" alt="Calendario" width={30} height={30} />
            </button>
          </div>

          <div className="flex items-center">
  {/* Año seleccionado */}
  <div className="mr-4">
    <p className="text-sm text-gray-700 inline-block mr-2">Año seleccionado:</p>
    <div className="inline-flex mt-1 px-3 py-1 bg-white text-[#11295B] font-semibold rounded-md shadow-sm border border-gray-300">
      {selectedYear}
    </div>
  </div>

  {/* Mes seleccionado */}
  <div>
    <p className="text-sm text-gray-700 inline-block mr-2">Mes:</p>
    <div className="inline-flex mt-1 px-3 py-1 bg-white text-[#11295B] font-semibold rounded-md shadow-sm border border-gray-300">
      {selectedMonth !== null
        ? new Date(selectedYear, selectedMonth).toLocaleString('es-ES', { month: 'long' })
        : 'No seleccionado'}
    </div>
  </div>
</div>

          {/* Botones de los meses */}
          {selectedMonth === null ? (
            <div className="grid grid-cols-4 gap-4 justify-items-center mt-6">
              {Array.from({ length: 12 }, (_, i) => {
                const isSelected = selectedMonth === i
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedMonth(i)}
                    className={`w-20 h-20 rounded-full font-semibold uppercase transition-all duration-200 cursor-pointer bg-[#11295B] text-white shadow-xl border border-white/20 hover:scale-105 hover:shadow-2xl ${isSelected ? 'ring-4 ring-white ring-opacity-40' : ''}`}
                  >
                    {new Date(0, i).toLocaleString('es-ES', { month: 'short' })}
                  </button>
                )
              })}
            </div>
          ) : (
            <div className="mt-4">
              {/* Vista del mes seleccionado */}
              <MonthView month={selectedMonth} year={selectedYear} />

              {/* Botón para regresar a la vista de los meses */}
              <button
                onClick={() => setSelectedMonth(null)}
                className="mt-4 p-2 bg-blue-500 text-white rounded"
              >
                Volver a los meses
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
