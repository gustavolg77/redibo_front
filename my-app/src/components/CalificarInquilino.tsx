"use client";
import Image from "next/image";
import { useState } from "react";

const inquilinos = [
  {
    id: 1,
    nombre: "Mariza Ramirez",
    img: "/public/calendar.png",
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
];
export default function CalificarInquilino() {
  return (
    <div className="flex flex-wrap gap-4">
      {inquilinos.map((inq) => (
        <div key={inq.id} className="border rounded-lg p-4 w-126 shadow-md">
          <div className="flex items-center gap-4">
            {/* Foto redonda */}
            <Image
              src={inq.img}
              alt={inq.nombre}
              width={150}
              height={150}
              className="rounded-full object-cover"
            />

            {/* Contenido a la derecha */}
            <div className="flex flex-col">
              <h3 className="font-semibold">{inq.nombre}</h3>
              <p className="text-sm text-gray-600">
                Reseñas y comentarios {inq.totalReseñas}
              </p>
              <div className="flex items-center mt-1">
                <span className="text-yellow-400 text-xl">★</span>
                <span className="ml-1 text-lg font-bold">{inq.promedio}</span>
              </div>
              <div className="flex gap-2 mt-2">
                <button className="bg-blue-500 text-white px-3 py-1 rounded text-sm">
                  VER
                </button>
                <button className="bg-orange-400 text-white px-3 py-1 rounded text-sm">
                  CALIFICAR
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}