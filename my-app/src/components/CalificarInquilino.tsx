"use client";
import Image from "next/image";

const inquilinos = [
  {
    id: 1,
    nombre: "Mariza Ramirez",
    img: "/calendar.png",
    totalReseñas: 3,
    promedio: 4.9,
  },
  {
    id: 2,
    nombre: "Diego Flores",
    img: "/images/diego.png",
    totalReseñas: 4,
    promedio: 3.0,
  },
  {
    id: 3,
    nombre: "Camila Torres",
    img: "/images/camila.png",
    totalReseñas: 6,
    promedio: 4.2,
  },
];

// Componente para estrella con relleno parcial
function Star({ fillPercent }: { fillPercent: number }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-[34px] h-[34px] inline-block"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`grad-${fillPercent}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset={`${fillPercent}%`} stopColor="#facc15" />
          <stop offset={`${fillPercent}%`} stopColor="#e5e7eb" />
        </linearGradient>
      </defs>
      <path
        fill={`url(#grad-${fillPercent})`}
        d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 
         9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
      />
    </svg>
  );
}
export default function CalificarInquilino() {
  return (
<div className="w-full max-w-[92rem] mx-auto px-4">
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {inquilinos.map((inq) => {
          const fullStars = Math.floor(inq.promedio);
          const partialFill = (inq.promedio - fullStars) * 100;

          return (
            <div
              key={inq.id}
              className="border-2 border-orange-400 rounded-2xl p-3 shadow-lg flex gap-4 items-center bg-white overflow-hidden"
            >
              {/* Izquierda: Foto + nombre */}
              <div className="flex flex-col items-center w-32 min-w-0">
                <Image
                  src={inq.img}
                  alt={inq.nombre}
                  width={150}
                  height={150}
                  className="rounded-full object-cover"
                />
                <h3 className="mt-3 font-semibold text-center text-sm sm:text-base">
                  {inq.nombre}
                </h3>
              </div>

              {/* Derecha: Info + estrellas + botones */}
              <div className="flex-1 h-full flex flex-col justify-center min-w-0">
                <p className="text-base text-gray-600 mb-2 truncate">
                  Reseñas y comentarios:{" "}
                  <span className="font-bold text-lg">{inq.totalReseñas}</span>
                </p>
                <div className="flex items-center mb-2 flex-wrap">
                  {Array.from({ length: 5 }).map((_, i) => {
                    if (i < fullStars) return <Star key={i} fillPercent={100} />;
                    if (i === fullStars) return <Star key={i} fillPercent={partialFill} />;
                    return <Star key={i} fillPercent={0} />;
                  })}
                  <span className="ml-2 font-bold text-xl text-gray-800">
                    {inq.promedio.toFixed(1)}
                  </span>
                </div>
                <div className="flex gap-2 mt-4 flex-wrap">
                  <button className="bg-blue-500 hover:bg-blue-600 transition text-white px-2 py-0.5 rounded text-xs sm:text-sm">
                    VER
                  </button>
                  <button className="bg-orange-400 hover:bg-orange-500 transition text-white px-2 py-0.5 rounded text-xs sm:text-sm">
                    CALIFICAR
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}