'use client';
import { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';

type CommentedCar = {
  modelo: string;
  marca: string;
  direccionImagen: string | null;
  comentarios: string;
  calificacionPromedio: number;
  date: string;
  name: string;
};

const variableDeOrden = 'comentarios-sortBy';
const variableDeDireccion = 'comentarios-direction';

export default function ComentariosRecibidos() {
  const [items, setItems] = useState<CommentedCar[]>([]);
  const [loading, setLoading] = useState(true);

  // Inicializar con valores de localStorage o por defecto
  const [sortBy, setSortBy] = useState<'date' | 'rating'>(() => {
    if (typeof window === 'undefined') return 'date'; // fallback SSR
    return (localStorage.getItem(variableDeOrden) as 'date' | 'rating') || 'date';
  });
  const [direction, setDirection] = useState<'asc' | 'desc'>(() => {
    if (typeof window === 'undefined') return 'desc'; // fallback SSR
    return (localStorage.getItem(variableDeDireccion) as 'asc' | 'desc') || 'desc';
  });

  const defaultImage = 'https://images.unsplash.com/photo-1596165494776-c27e37f666fe?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
  const hostId = 1;

  // Guardar en localStorage al cambiar
  useEffect(() => {
    localStorage.setItem(variableDeOrden, sortBy);
  }, [sortBy]);

  useEffect(() => {
    localStorage.setItem(variableDeDireccion, direction);
  }, [direction]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:5000/api/cars/comments?hostId=${hostId}&sortBy=${sortBy}&direction=${direction}`
        );
        if (!res.ok) throw new Error('Error al obtener datos');
        const data: CommentedCar[] = await res.json();
        setItems(data);
      } catch (error) {
        console.error('Error al cargar datos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [hostId, sortBy, direction]);

  // Ordenar items localmente
  const sortedItems = [...items].sort((a, b) => {
    const dir = direction === 'asc' ? 1 : -1;
    if (sortBy === 'date') {
      return dir * (new Date(a.date).getTime() - new Date(b.date).getTime());
    }
    return dir * (a.calificacionPromedio - b.calificacionPromedio);
  });

  return (
    <div className="px-4 py-6 space-y-4 w-full max-w-screen-xl mx-auto">
      <div className="sticky top-[64px] z-20 bg-white border-b py-2 px-4">
        <div className="flex gap-4 items-center">
          <label>Ordenar por:</label>
          <button
            onClick={() => setSortBy('date')}
            className={`border px-2 py-1 rounded ${sortBy === 'date' ? 'bg-gray-300 font-semibold' : 'bg-white'}`}
          >
            Fecha 📅
          </button>
          <button
            onClick={() => setSortBy('rating')}
            className={`border px-2 py-1 rounded ${sortBy === 'rating' ? 'bg-gray-300 font-semibold' : 'bg-white'}`}
          >
            Calificación ⭐
          </button>

          <label>Dirección:</label>
          <button
            onClick={() => setDirection('asc')}
            className={`border px-2 py-1 rounded ${direction === 'asc' ? 'bg-gray-300 font-semibold' : 'bg-white'}`}
          >
            Ascendente ⬆️
          </button>
          <button
            onClick={() => setDirection('desc')}
            className={`border px-2 py-1 rounded ${direction === 'desc' ? 'bg-gray-300 font-semibold' : 'bg-white'}`}
          >
            Descendente ⬇️
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <svg
            className="animate-spin h-10 w-10 text-yellow-500"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            ></path>
          </svg>
        </div>
      ) : (
        sortedItems.map((item, index) => {
          const ratingStars = Math.min(Math.max(Math.round(item.calificacionPromedio), 0), 5);
          return (
            <div key={index} className="w-full border-3 border-yellow-400 rounded-lg p-4 bg-white shadow-sm">
              <div className="grid grid-cols-12 gap-4 items-start text-center">
                <div className="col-span-12 sm:col-span-2 flex flex-col items-center justify-start">
                  <img
                    src={item.direccionImagen || defaultImage}
                    alt={`${item.marca} ${item.modelo}`}
                    className="w-full h-30 object-cover rounded"
                  />
                  <h2 className="text-lg font-semibold mt-2">{`${item.marca} ${item.modelo}`}</h2>
                </div>

                <div className="col-span-6 sm:col-span-2 flex flex-col items-center justify-start">
                  <strong className="text-gray-600 mb-10">Inquilino</strong>
                  <p>{item.name}</p>
                </div>

                <div className="col-span-12 sm:col-span-5 flex flex-col items-center justify-start">
                  <strong className="text-gray-600 mb-10">Comentario</strong>
                  <p>{item.comentarios}</p>
                </div>

                <div className="col-span-3 sm:col-span-2 flex flex-col items-center justify-start">
                  <strong className="text-gray-600 mb-10">Calificación</strong>
                  <p className="flex justify-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <FaStar
                        key={i}
                        color={i < ratingStars ? '#FBBF24' : '#D1D5DB'}
                        size={20}
                        aria-label={i < ratingStars ? 'Estrella llena' : 'Estrella vacía'}
                      />
                    ))}
                  </p>
                </div>

                <div className="col-span-3 sm:col-span-1 flex flex-col items-center justify-start">
                  <strong className="text-gray-600 mb-10">Fecha</strong>
                  <p>{item.date}</p>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
