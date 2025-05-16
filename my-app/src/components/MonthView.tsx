import React, { useState, useEffect } from 'react';
import DetailsInquilino from './DetailsInquilino';

type Rental = {
  startDate: string;
  endDate: string;
  tenant: string;
};

type Car = {
  brand: string;
  model: string;
  rentals: Rental[];
};

type DayData = {
  day: Date | null;
  weekNumber: number;
};

type ModalData = {
  car: Car;
  rental: Rental;
};

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

const MonthView = ({ month, year }: { month: number; year: number }) => {
  const [selectedWeek, setSelectedWeek] = useState<DayData[] | null>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modalData, setModalData] = useState<ModalData | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [inquilinos, setInquilinos] = useState<Inquilino[]>([]);
  const [selectedInquilino, setSelectedInquilino] = useState<Inquilino | null>(null);

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/cars');
        if (!response.ok) {
          throw new Error(`Error al obtener los autos: ${response.statusText}`);
        }
        const data = await response.json();
        setCars(data);
      } catch (error) {
        console.error(error);
        setError('Hubo un error al cargar los autos.');
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

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
    const handleKeyDown = (event: KeyboardEvent) => {
     if (event.key === 'Escape') {
       setShowDetails(false);
     }
   };

   if (showDetails) {
     document.addEventListener('keydown', handleKeyDown);
   }

   return () => {
     document.removeEventListener('keydown', handleKeyDown);
    };
  }, [showDetails]);

  const getDaysInMonth = (month: number, year: number): Date[] => {
    const date = new Date(year, month, 1);
    const days: Date[] = [];
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  };
const getWeekNumber = (date: Date): number => {
  // 1) Día del año (1–365/366)
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((date.getTime() - startOfYear.getTime()) / 86400000) + 1;

  // 2) Offset: cuántos días desde el lunes hasta el 1 de enero
  //    (lunes = 0, martes = 1, … domingo = 6)
  const jan1Day = startOfYear.getDay(); // domingo=0…sábado=6
  const offset = (jan1Day + 6) % 7;

  // 3) Semana = floor((díaDelAño + offset - 1) / 7) + 1
  const weekNum = Math.floor((dayOfYear + offset - 1) / 7) + 1;
  return weekNum;
};
const buildWeeks = (days: Date[]): DayData[][] => {
  const weeks: DayData[][] = [];
  let currentWeek: DayData[] = [];
  const firstDay = days[0].getDay();
  const leadingEmptyDays = (firstDay + 6) % 7;

  // Creamos días vacíos al principio para alinear correctamente el inicio del mes
  for (let i = 0; i < leadingEmptyDays; i++) {
    currentWeek.push({ day: null, weekNumber: 0 }); // Usamos 0 para indicar una semana vacía
  }

  for (const date of days) {
    const weekNumber = getWeekNumber(date);
    currentWeek.push({ day: date, weekNumber: weekNumber > 0 ? weekNumber : 1 }); // Aseguramos que sea un número válido

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  // Añadimos semanas incompletas con días vacíos
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) {
      currentWeek.push({ day: null, weekNumber: 0 });
    }
    weeks.push(currentWeek);
  }

  return weeks;
};

const isDayActive = (car: Car, day: Date): boolean => {
  return car.rentals?.some((rental) => {
    const rentalStart = new Date(rental.startDate);
    const rentalEnd = new Date(rental.endDate);
    return day >= rentalStart && day < rentalEnd;
  }) ?? false;
};

const getActiveRental = (car: Car, day: Date): Rental | null => {
  return (
    car.rentals.find((rental) => {
      const rentalStart = new Date(rental.startDate);
      const rentalEnd = new Date(rental.endDate);
      return day >= rentalStart && day < rentalEnd;
    }) || null
  );
};

const handleCircleClick = (car: Car, day: Date) => {
  const rental = getActiveRental(car, day);
  if (rental) {
    setModalData({ car, rental });
  }
};

const getCircleColor = (car: Car, day: Date): string => {
  return isDayActive(car, day) ? 'bg-red-500' : 'bg-green-500';
};

const days = getDaysInMonth(month, year);
const weeks = buildWeeks(days);
return (
<div
  className={`mt-2 p-2 bg-white rounded shadow relative 
  ${modalData || showDetails ? 'backdrop-blur-sm' : ''}
  max-w-full sm:max-w-3xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto transition-all duration-300`}
>
  <p className="text-lg md:text-xl font-medium mb-2">
    Vista del mes: {new Date(year, month).toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
  </p>

  {error && <p className="text-red-500">{error}</p>}

  {!selectedWeek ? (
    <div className="w-full overflow-x-auto">
      <div className="grid grid-cols-[minmax(40px,60px)_repeat(7,1fr)] gap-[2px] sm:gap-1 items-center text-[12px] sm:text-sm md:text-base">
        {/* Encabezados */}
        <div className="font-semibold text-center text-[13px] sm:text-xs md:text-sm">Semana</div>
        {['LU', 'MA', 'MI', 'JU', 'VI', 'SA', 'DO'].map((day) => (
          <div key={day} className="font-semibold text-center">{day}</div>
        ))}

        {/* Semanas */}
        {weeks.map((week, index) => (
          <React.Fragment key={index}>
            <div className="text-center py-1 sm:py-2">
              <div
                className="bg-[#FCA311] text-white rounded 
                  px-[6px] sm:px-[8px] md:px-[10px] lg:px-[14px] xl:px-[16px]
                  py-[2px] sm:py-[4px] md:py-[6px]
                  text-[10px] sm:text-xs md:text-sm lg:text-base xl:text-lg
                  font-semibold hover:bg-[#11295B] 
                  transition duration-300 transform hover:scale-105 
                  cursor-pointer 
                  max-w-[32px] sm:max-w-[40px] md:max-w-[48px] lg:max-w-[60px] xl:max-w-[72px]
                  text-center"
                onClick={() => setSelectedWeek(week)}
              >
                {week.find((w) => w.day)?.weekNumber ?? ''}
              </div>
            </div>
            {week.map(({ day }, i) => (
              <div key={i} className="text-center py-1 sm:py-2">
                <span className="text-[14px] sm:text-sm md:text-base lg:text-lg xl:text-xl">
                  {day ? day.getDate() : ''}
                </span>
              </div>
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  ) : (
    <div className="mt-4 p-2 bg-white rounded shadow">
  <div className="flex flex-wrap justify-between items-center gap-y-2">
    {/* IZQUIERDA: Semana */}
    <div className="bg-[#FCA311] text-white rounded-md px-2 py-1 font-semibold
                    hover:bg-[#11295B] transition duration-300 cursor-pointer
                    text-lg font-medium">
      {(() => {
        const firstRealDay = selectedWeek.find(entry => entry.day !== null);
        return firstRealDay ? `Semana ${firstRealDay.weekNumber}` : 'Sin datos';
      })()}
    </div>

    {/* CENTRO: Libre / Ocupado */}
    <div className="flex justify-center items-center gap-4 w-full md:w-auto order-3 md:order-none">
      <div className="flex items-center gap-1">
        <span className="w-4 h-4 rounded-full bg-green-500"></span>
        <span className="text-sm text-gray-700">Libre</span>
      </div>
      <div className="flex items-center gap-1">
        <span className="w-4 h-4 rounded-full bg-red-500"></span>
        <span className="text-sm text-gray-700">Ocupado</span>
      </div>
    </div>

    {/* DERECHA: Volver */}
    <button
      onClick={() => setSelectedWeek(null)}
      className="p-2 bg-blue-500 text-white rounded text-sm md:text-base hover:bg-blue-600 transition cursor-pointer hover:scale-105"
    >
      Volver a la vista del mes
    </button>
  </div>

  {/* Encabezado de días */}
  <div className="mt-4 grid grid-cols-8 gap-2 text-sm sm:text-base items-center">
    <div className="font-semibold text-left text-xs sm:text-sm"></div>
    {['LU', 'MA', 'MI', 'JU', 'VI', 'SA', 'DO'].map((day, index) => (
      <div key={index} className="text-center font-semibold text-xs sm:text-sm">
        {day}
      </div>
    ))}
  </div>

  {/* Fechas de la semana */}
  <div className="grid grid-cols-8 gap-2 text-sm sm:text-base items-center mt-1">
    <div></div>
    {selectedWeek.map(({ day }, index) => (
      <div key={index} className="text-center">
        {day ? day.getDate() : ''}
      </div>
    ))}
  </div>

 {/* Autos */}
<div className="mt-6">
  <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-semibold">
    Mis Automóviles
  </h3>

  {/* Contenedor con altura relativa al viewport y scroll interno */}
  <div className="mt-1 max-h-[calc(100vh-320px)] overflow-y-auto pr-2 overflow-x-hidden">
    <ul className="space-y-2">
      {loading ? (
        <li className="text-center">Cargando autos...</li>
      ) : (
        cars
          .sort((a, b) => {
            const cmp = a.brand.localeCompare(b.brand);
            return cmp !== 0 ? cmp : a.model.localeCompare(b.model);
          })
          .map((car, i) => (
            <li
              key={i}
              className="grid grid-cols-8 gap-2 items-center text-xs sm:text-sm md:text-base"
            >
              <div className="col-span-1 font-medium pl-1 sm:pl-2 text-left">
                {car.brand} {car.model}
              </div>
              {selectedWeek.map(({ day }, j) => (
                <div key={j} className="col-span-1 flex justify-center">
                  {day && (
                    <div className="relative w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
                      <button
                        onClick={() =>
                          isDayActive(car, day) && handleCircleClick(car, day)
                        }
                        className={`
                          rounded-full w-6 h-6 sm:w-8 sm:h-8
                          ${getCircleColor(car, day)}
                          transition-transform duration-150
                          hover:scale-[1.2] origin-center
                          transform-gpu will-change-transform cursor-pointer
                        `}
                      />
                    </div>
                  )}
                </div>
              ))}
            </li>
          ))
      )}
    </ul>
  </div>
</div>

</div>
      )}

      {/* Modal de información del alquiler */}
      {modalData && !showDetails && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-500/40 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 shadow-lg w-80">
            <h2 className="text-lg font-bold mb-2">Información del alquiler</h2>
            <p><strong>Auto:</strong> {modalData.car.brand} {modalData.car.model}</p>
            <p><strong>Inquilino:</strong> {modalData.rental.tenant}</p>
            <p><strong>Desde:</strong> {new Date(modalData.rental.startDate).toLocaleDateString()}</p>
            <p><strong>Hasta:</strong> {new Date(modalData.rental.endDate).toLocaleDateString()}</p>

            <div className="flex justify-between mt-4">
              <button
                className="bg-blue-500 text-white px-3 py-2 rounded text-sm cursor-pointer hover:scale-105"
                onClick={() => setModalData(null)}
              >
                Cerrar
              </button>
              <button
                className="bg-[#FCA311] text-white px-3 py-2 rounded text-sm hover:bg-[#11295B] cursor-pointer hover:scale-105"
                onClick={() => {
                  const tenant = inquilinos.find(i => i.name === modalData.rental.tenant);
                  setSelectedInquilino(tenant || null);
                  setShowDetails(true);
                  setModalData(null);
                }}
              >
                Ver detalles del inquilino
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de detalles del inquilino */}
      {showDetails && selectedInquilino && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="fixed inset-0 bg-black opacity-80 z-40"></div>
          <div className="relative z-50 w-full max-w-5xl mx-auto">
          <div className="relative bg-white rounded-lg p-6 shadow-lg max-h-[90vh] overflow-y-auto">  
            <h2 className="text-[2.074rem] font-semibold text-[#FCA311] mb-4">Detalles del Inquilino</h2>
            <DetailsInquilino
              tenantId={selectedInquilino.id}
              inquilinosData={inquilinos}
            /> 
            
            <button
              onClick={() => setShowDetails(false)}
              className="absolute top-1 right-5 text-gray-500 hover:text-gray-700 text-3xl font-bold focus:outline-none cursor-pointer"
              aria-label="Cerrar"
            >
              &times;
            </button>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default MonthView;