"use client";

import { useEffect, useState } from "react";

interface Alert {
  id: number;
  title: string;
  message: string;
  date: string;
  imageUrl: string;
}

const Alertas = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [isBlurred, setIsBlurred] = useState(false);

  const fetchAlerts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/alerts");
      const data = await res.json();
      setAlerts(data);
    } catch (error) {
      console.error("Error al cargar alertas:", error);
    }
  };

  const handleView = async (id: number) => {
    try {
      const res = await fetch(`http://localhost:5000/api/alerts/${id}`);
      const data = await res.json();
      setSelectedAlert(data);
      setIsBlurred(true); // Activar el efecto blur cuando se muestra el modal
    } catch (error) {
      console.error("Error al obtener la alerta:", error);
    }
  };

  const handleCloseModal = () => {
    setSelectedAlert(null);
    setIsBlurred(false); // Desactivar el efecto blur cuando se cierra el modal
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`http://localhost:5000/api/alerts/${id}`, {
        method: "DELETE",
      });
      fetchAlerts(); // recarga lista
    } catch (error) {
      console.error("Error al eliminar la alerta:", error);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  return (
    <div className="p-4 relative">
      {/* Contenedor principal que tendrá el blur cuando se active */}
      <div className={`transition-all duration-300 ${isBlurred ? "blur-sm" : ""}`}>
        <h2 className="text-xl font-bold mb-2">Alertas</h2>
        <ul className="space-y-2">
          {alerts.map((alert) => (
            <li key={alert.id} className="border p-2 rounded">
              <strong>{alert.title}</strong>
              <p>{alert.message}</p>
              <small>{alert.date}</small>
              <div className="mt-2 space-x-2">
                <button
                  onClick={() => handleView(alert.id)}
                  className="bg-orange-500 text-white px-3 py-1 rounded hover:bg-orange-600 transition"
                >
                  Ver más
                </button>
                <button
                  onClick={() => handleDelete(alert.id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                >
                  Eliminar
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal que se mostrará por encima del contenido borroso */}
      {selectedAlert && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div 
            className="absolute inset-0 bg-black bg-opacity-20"
            onClick={handleCloseModal}
          ></div>
          <div className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full relative z-10">
            <h3 className="font-bold text-lg mb-3">Detalle de la Alerta</h3>
            <p className="text-xl font-semibold mb-2">{selectedAlert.title}</p>
            <p className="mb-4">{selectedAlert.message}</p>
            <p className="text-gray-500 text-sm">{selectedAlert.date}</p>
            {selectedAlert.imageUrl && (
              <img 
                src={selectedAlert.imageUrl} 
                alt="Imagen de alerta" 
                className="mt-3 w-full rounded" 
              />
            )}
            <button
              onClick={handleCloseModal}
              className="mt-4 bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Alertas;