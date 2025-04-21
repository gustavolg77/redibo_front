"use client";

import { useEffect, useState } from "react";

interface Alert {
  id: number;
  title: string;
  message: string;
  date: string;
  imageUrl:string;
}

const Alertas = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

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
    } catch (error) {
      console.error("Error al obtener la alerta:", error);
    }
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
    <div className="p-4">
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

      {selectedAlert && (
        <div className="mt-4 border p-3 rounded bg-gray-100">
          <h3 className="font-bold text-lg mb-1">Detalle de la Alerta</h3>
          <p><strong>{selectedAlert.title}</strong></p>
          <p>{selectedAlert.message}</p>
          <p><small>{selectedAlert.date}</small></p>
        </div>
      )}
    </div>
  );
};

export default Alertas;
