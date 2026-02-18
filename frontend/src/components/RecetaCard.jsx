import React from 'react';
import { Clock, Star, Maximize2, Utensils, Trash2 } from 'lucide-react';

const RecetaCard = ({ receta, onVerDetalles, onToggleSemana, onEliminarReceta }) => {
    return (
        <div className="receta-card">
            {/* Icono superior para ver más detalles */}
            <button className="btn-expand" onClick={() => onVerDetalles(receta)}>
                <Maximize2 size={18} />
            </button>

            <div className="receta-body">
                <div className="receta-main-icon">
                    <Utensils size={32} className="icon-orange" />
                </div>
                
                <h3 className="receta-nombre">{receta.nombre}</h3>
                
                <div className="receta-tiempo">
                    <Clock size={14} /> 
                    <span>{receta.tiempo_aproximado} min</span>
                </div>
            </div>

            {/* Botón estrella abajo a la derecha */}
            <button 
                className={`btn-star ${receta.es_semanal ? 'active' : ''}`}
                // Pasamos tanto el ID como el estado actual para que la función sepa qué hacer
                onClick={() => onToggleSemana(receta.id, receta.es_semanal)}
            >
                <Star size={20} fill={receta.es_semanal ? "currentColor" : "none"} />
            </button>

            {/* Botón para eliminar receta */}
            <button 
                className="btn-delete"
                onClick={() => onEliminarReceta(receta.id)}
            >
                <Trash2 size={20} />
            </button>
        </div>
    );
};

export default RecetaCard;