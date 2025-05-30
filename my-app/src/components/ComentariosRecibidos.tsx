'use client';
import { useEffect, useState } from 'react';
import { FaStar } from 'react-icons/fa';
import { apiFetch } from '../utils/api';

type Rating = {
    idCar: number;
    review: string;  // comentario
    rating: number;
    date: string;
    name: string;
};

type Car = {
    id: number;
    model: string;
    brand: string;
    image: string;
};

type RatingWithCar = Rating & { car: Car };

export default function ComentariosRecibidos() {
    const [ratings, setRatings] = useState<RatingWithCar[]>([]);
    const [sortBy, setSortBy] = useState<'date' | 'rating'>('date');
    const [direction, setDirection] = useState<'asc' | 'desc'>('desc');
    const defaultImage = 'https://images.unsplash.com/photo-1596165494776-c27e37f666fe?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

    useEffect(() => {
        const fetchRatings = async () => {
            try {
                const data: Rating[] = await apiFetch('/api/ratings');

                const ratingsWithCars: RatingWithCar[] = await Promise.all(
                    data.map(async (rating) => {
                        const car: Car = await apiFetch(`/api/cars/${rating.idCar}`);
                        return {
                            ...rating,
                            car,
                        };
                    })
                );

                setRatings(ratingsWithCars);
            } catch (error) {
                console.error('Error al cargar los comentarios:', error);
            }
        };

        fetchRatings();
    }, []);

    const sortedRatings = [...ratings].sort((a, b) => {
        const dir = direction === 'asc' ? 1 : -1;
        if (sortBy === 'date') {
            return dir * (new Date(a.date).getTime() - new Date(b.date).getTime());
        } else {
            return dir * (a.rating - b.rating);
        }
    });

    return (
        <div className="px-4 py-6 space-y-4 w-full max-w-screen-xl mx-auto">
            <div className="flex gap-4 items-center">
                <label>Ordenar por:</label>
                <button onClick={() => setSortBy('date')} className="border px-2 py-1 rounded">
                    Fecha 📅
                </button>
                <button onClick={() => setSortBy('rating')} className="border px-2 py-1 rounded">
                    Calificación ⭐
                </button>
                <label>Dirección:</label>
                <select onChange={(e) => setDirection(e.target.value as 'asc' | 'desc')}>
                    <option value="asc">Ascendente</option>
                    <option value="desc">Descendente</option>
                </select>
            </div>

            {sortedRatings.map((r, index) => {
                const ratingNumber = Math.min(Math.max(Math.round(r.rating), 0), 5);
                return (
                    <div key={index} className="w-full border-3 border-yellow-400 rounded-lg p-4 bg-white shadow-sm">
                        <div className="grid grid-cols-12 gap-4 items-start text-center">
                            {/* Imagen y modelo del auto */}
                            <div className="col-span-12 sm:col-span-2 flex flex-col items-center justify-start">
                                <img src={r.car.image || defaultImage} alt="auto" className="w-full h-30 object-cover rounded" />
                                <h2 className="text-lg font-semibold mt-2">{`${r.car.brand} ${r.car.model}`}</h2>
                            </div>

                            {/* Inquilino */}
                            <div className="col-span-6 sm:col-span-2 flex flex-col items-center justify-start">
                                <strong className="text-gray-600 mb-10">Inquilino</strong>
                                <p>{r.name}</p>
                            </div>

                            {/* Comentario */}
                            <div className="col-span-12 sm:col-span-5 flex flex-col items-center justify-start">
                                <strong className="text-gray-600 mb-10">Comentario</strong>
                                <p>{r.review}</p>
                            </div>

                            {/* Calificación */}
                            <div className="col-span-3 sm:col-span-2 flex flex-col items-center justify-start">
                                <strong className="text-gray-600 mb-10">Calificación</strong>
                                <p className="flex justify-center gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar
                                            key={i}
                                            color={i < ratingNumber ? '#FBBF24' : '#D1D5DB'}
                                            size={20}
                                            aria-label={i < ratingNumber ? 'Estrella llena' : 'Estrella vacía'}
                                        />
                                    ))}
                                </p>
                            </div>

                            {/* Fecha */}
                            <div className="col-span-3 sm:col-span-1 flex flex-col items-center justify-start">
                                <strong className="text-gray-600 mb-10">Fecha</strong>
                                <p>{r.date}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}