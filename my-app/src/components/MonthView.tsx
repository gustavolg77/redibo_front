import React, { useState, useEffect } from 'react';

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

const MonthView = ({ month, year }: { month: number; year: number }) => {
  const [selectedWeek, setSelectedWeek] = useState<DayData[] | null>(null);
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modalData, setModalData] = useState<ModalData | null>(null);

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
    const target = new Date(date.valueOf());
    const dayNumber = (date.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNumber + 3);
    const firstThursday = new Date(target.getFullYear(), 0, 4);
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    return Math.ceil((target.getTime() - firstThursday.getTime()) / oneWeek) + 1;
  };

  const buildWeeks = (days: Date[]): DayData[][] => {
    const weeks: DayData[][] = [];
    let currentWeek: DayData[] = [];
    const firstDay = days[0].getDay();
    const leadingEmptyDays = (firstDay + 6) % 7;
    for (let i = 0; i < leadingEmptyDays; i++) {
      currentWeek.push({ day: null, weekNumber: -1 });
    }
    for (const date of days) {
      currentWeek.push({ day: date, weekNumber: getWeekNumber(date) });
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push({ day: null, weekNumber: -1 });
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
    <div className={`mt-4 p-4 bg-white rounded shadow relative ${modalData ? 'backdrop-blur-sm' : ''}`}>
      <p className="text-lg font-medium mb-2">
        Vista del mes: {new Date(year, month).toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
      </p>

      {error && <p className="text-red-500">{error}</p>}

      {!selectedWeek ? (
        <>
          <div className="grid grid-cols-8 gap-2 items-center">
            <div className="font-semibold text-center">Semana</div>
            {['LU', 'MA', 'MI', 'JU', 'VI', 'SA', 'DO'].map((day) => (
              <div key={day} className="font-semibold text-center">{day}</div>
            ))}
            {weeks.map((week, index) => (
              <React.Fragment key={index}>
                <div className="text-center py-2">
                  <div
                    className="bg-[#FCA311] text-white rounded-md px-2 py-1 font-semibold hover:bg-[#11295B] transition duration-300 cursor-pointer"
                    onClick={() => setSelectedWeek(week)}
                  >
                    {week.find((w) => w.day)?.weekNumber ?? ''}
                  </div>
                </div>
                {week.map(({ day }, i) => (
                  <div key={i} className={`text-center py-2 ${i === 0 ? 'col-start-2' : ''}`}>
                    {day ? day.getDate() : ''}
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </>
      ) : (
        <div className="mt-4 p-4 bg-white rounded shadow">
          <button
            onClick={() => setSelectedWeek(null)}
            className="mb-4 p-2 bg-blue-500 text-white rounded text-sm"
          >
            Volver a la vista del mes
          </button>

          <div className="text-left mb-4">
            <div className="bg-[#FCA311] text-white rounded-md px-2 py-1 font-semibold hover:bg-[#11295B] transition duration-300 cursor-pointer text-lg font-medium inline-block">
              Semana {selectedWeek[0]?.weekNumber}
            </div>
          </div>

          <div className="grid grid-cols-8 gap-2">
            <div></div>
            {['LU', 'MA', 'MI', 'JU', 'VI', 'SA', 'DO'].map((day, index) => (
              <div key={index} className="text-center font-semibold">{day}</div>
            ))}
            {selectedWeek.map(({ day }, index) => (
              <div key={index} className={`text-center py-2 ${index === 0 ? 'col-start-2' : ''}`}>
                {day ? day.getDate() : ''}
              </div>
            ))}
          </div>

          <div className="mt-4">
            <h3 className="text-xl font-semibold">Mis Automóviles</h3>
            <ul className="mt-2 space-y-2">
              {loading ? (
                <p>Cargando autos...</p>
              ) : (
                cars.map((car, index) => (
                  <li key={index} className="grid grid-cols-8 gap-2 items-center">
                    <div className="font-medium col-span-1">
                      {car.brand} {car.model}
                    </div>
                    {selectedWeek.map(({ day }, i) => (
                      <div key={i} className="text-center col-span-1">
                        {day && (
                          <div
                            className={`w-8 h-8 rounded-full mx-auto cursor-pointer ${getCircleColor(car, day)}`}
                            onClick={() => isDayActive(car, day) && handleCircleClick(car, day)}
                          ></div>
                        )}
                      </div>
                    ))}
                  </li>
                ))
              )}
            </ul>
          </div>
        </div>
      )}

      {modalData && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-500/40 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 shadow-lg w-80">
            <h2 className="text-lg font-bold mb-2">Información del alquiler</h2>
            <p><strong>Auto:</strong> {modalData.car.brand} {modalData.car.model}</p>
            <p><strong>Inquilino:</strong> {modalData.rental.tenant}</p>
            <p><strong>Desde:</strong> {new Date(modalData.rental.startDate).toLocaleDateString()}</p>
            <p><strong>Hasta:</strong> {new Date(modalData.rental.endDate).toLocaleDateString()}</p>
            <div className="flex justify-between mt-4">
              <button
                className="bg-blue-500 text-white px-3 py-2 rounded text-sm"
                onClick={() => setModalData(null)}
              >
                Cerrar
              </button>
              <button
                className="bg-[#FCA311] text-white px-3 py-2 rounded text-sm hover:bg-[#11295B]"
                onClick={() => alert(`Ver detalles del inquilino: ${modalData.rental.tenant}`)}
              >
                Ver detalles del inquilino
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthView;
