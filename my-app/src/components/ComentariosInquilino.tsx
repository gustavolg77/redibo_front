"use client";
import Image from "next/image";

interface Comentario {
  id: number;
  autor: string;
  texto: string;
  fecha?: string;
  avatar?: string;
  calificacion: number;
}

interface Inquilino {
  id: number;
  nombre: string;
  img: string;
  promedio: number;
  totalReseñas: number;
}

interface ComentariosInquilinoProps {
  inquilino: Inquilino;
  onClose: () => void;
  isOpen:Boolean;
  perfilUrl?: string;
}

export default function ComentariosInquilino({ inquilino, onClose, perfilUrl }: ComentariosInquilinoProps) {
  const comentarios: Comentario[] = [
    {
      id: 1,
      autor: "Jorge Suarez",
      texto: "Excelente inquilino. Puntual en la entrega, cuidadoso con el vehículo y muy respetuoso en la conversación. Sin duda, volvería a contactar uno de mis autos. 100% recomendado.",
      fecha: "1año/5/25",
      avatar: "/avatars/jorge.png",
      calificacion: 5
    },
    {
      id: 2,
      autor: "Miguel Duran",
      texto: "En general, la experiencia fue buena. El inquilino fue amable y comunicativo durante todo el proceso, y devolvió el auto sin daños. Sin embargo, hubo un pequeño retraso en la devolución del vehículo sin previo aviso, lo cual generó un poco de incertidumbre. Aun así, el coche fue devuelto en buenas condiciones y el inquilino se mostró dispuesto a mejorar para futuras transacciones. Lo recomendaría, aunque con una sugerencia de mejorar la puntualidad.",
      fecha: "9/06/25",
      avatar: "/avatars/miguel.png",
      calificacion: 4
    },
    {
      id: 3,
      autor: "Samuel Lopez",
      texto: "Todo perfecto. Responsable, puntual y muy cuidadoso con el auto. ¡Gracias!",
      fecha: "12/04/25",
      avatar: "/avatars/samuel.png",
      calificacion: 5
    }
  ];

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<span key={i} className="text-yellow-400 text-sm">★</span>);
      } else {
        stars.push(<span key={i} className="text-gray-300 text-sm">★</span>);
      }
    }
    return stars;
  };

  return (
    <div className="fixed inset-0 bg-white bg-opacity-90 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden border-2 border-orange-400">
        
        {/* Encabezado con foto y datos del inquilino */}
        <div className="bg-white p-4 border-b border-gray-200 relative">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold"
          >
            ×
          </button>
          
          <div className="flex items-center space-x-3 mb-3">
            {perfilUrl ? (
              <a href={perfilUrl} target="_blank" rel="noopener noreferrer">
                <Image 
                  src={inquilino.img} 
                  alt={inquilino.nombre} 
                  width={50} 
                  height={50} 
                  className="rounded-full object-cover hover:opacity-80 transition-opacity"
                />
              </a>
            ) : (
              <Image 
                src={inquilino.img} 
                alt={inquilino.nombre} 
                width={50} 
                height={50} 
                className="rounded-full object-cover"
              />
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{inquilino.nombre}</h3>
              <div className="flex items-center space-x-1">
                <div className="flex">{renderStars(inquilino.promedio)}</div>
                <span className="text-sm font-semibold text-gray-900 ml-1">{inquilino.promedio.toFixed(1)}</span>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <h4 className="text-sm font-medium text-gray-700">Reseñas y comentarios</h4>
          </div>
        </div>

        {/* Lista de comentarios con scroll */}
        <div className="overflow-y-auto max-h-96">
          {comentarios.length > 0 ? (
            <div>
              {comentarios.map((coment, index) => (
                <div key={coment.id} className={`p-4 ${index !== comentarios.length - 1 ? 'border-b border-gray-100' : ''}`}>
                  <div className="flex items-start space-x-3">
                    <Image 
                      src={coment.avatar || "/avatars/default.png"} 
                      alt={coment.autor} 
                      width={40} 
                      height={40} 
                      className="rounded-full object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-gray-900 text-sm truncate">{coment.autor}</h4>
                        <span className="text-xs text-gray-500 flex-shrink-0 ml-2">{coment.fecha || "Hace 2 semanas"}</span>
                      </div>
                      
                      <div className="flex items-center mb-2">
                        <div className="flex">{renderStars(coment.calificacion)}</div>
                      </div>
                      
                      <p className="text-gray-700 text-xs leading-relaxed">{coment.texto}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-gray-500 italic">No hay comentarios aún</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}