"use client";

import { useState } from "react";
import Link from "next/link";
import { FiBell, FiUser } from "react-icons/fi";
import CalificarInquilino from "@/components/CalificarInquilino";
import ComentariosRecibidos from "@/components/ComentariosRecibidos";

export default function CalificacionesPage() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("resenas");

  const tabs = [
    { id: "resenas", label: "Reseñas recibidas" },
    { id: "comentarios", label: "Comentarios recibidos" },
    { id: "calificar", label: "Calificar inquilino" },
  ];

  return (
    <>
      {/* Header igual al de la página principal */}
      <header className="z-10 flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-300 bg-white sticky top-0">
        <h1 className="text-lg sm:text-xl font-bold text-orange-500">REDIBO</h1>

        <div className="flex items-center space-x-4">
          <button
            className="relative p-2 border-2 border-orange-400 rounded-full hover:scale-110 hover:shadow-md hover:ring-2 hover:ring-orange-300 transition cursor-pointer"
            aria-label="Notificaciones"
          >
            <FiBell className="text-orange-500 text-xl" />
          </button>

          <div className="relative">
            <div
              className="w-10 h-10 rounded-full bg-orange-400 flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-orange-300 transition"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <FiUser className="text-white text-xl" />
            </div>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 shadow-lg rounded-md z-[15]">
                <ul className="py-1 text-sm text-gray-700">
                  <li>
                    <Link href="/" className="block px-4 py-2 hover:bg-orange-100">
                      Mis Autos
                    </Link>
                  </li>
                  <li>
                    <Link href="/calificaciones" className="block px-4 py-2 hover:bg-orange-100">
                      Calificaciones
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Contenido de la página de calificaciones */}
      <main className="min-h-screen bg-white text-black relative p-6">
        <h2 className="text-3xl font-bold mb-6">Calificaciones</h2>

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b border-gray-300">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`py-2 px-4 font-semibold border-b-2 transition-colors duration-200 ${activeTab === tab.id
                ? "border-orange-500 text-orange-600 cursor-pointer"
                : "border-transparent text-gray-600 hover:text-orange-500 cursor-pointer"
                }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {activeTab === "resenas" && (
          <div>
            <p className="text-gray-700">Aquí irán las reseñas recibidas.</p>
          </div>
        )}
        {activeTab === "comentarios" && (
          <div>
            <ComentariosRecibidos />
          </div>
        )}
        {activeTab === "calificar" && (
          <div>
            <h2 className="text-2xl font-bold mb-4"></h2>
            <CalificarInquilino />
          </div>
        )}
      </main>
    </>
  );
}
