import React from 'react';
import { Timer, ListChecks, Utensils, X } from 'lucide-react';

const ModalAzul = ({ receta, onClose }) => {
    if (!receta) return null;

    return (
        <div className="recipe-detail-container">
            <div className="recipe-header">
                <h2>{receta.nombre}</h2>
                <div className="recipe-meta">
                    <span className="badge-time">
                        <Timer size={16} /> {receta.tiempo_estimado} min
                    </span>
                </div>
            </div>

            <div className="recipe-body">
                <section className="recipe-section">
                    <h4><ListChecks size={18} className="icon-blue" /> Ingredientes</h4>
                    <ul className="ing-list-display">
                        {receta.Productos?.map((item, idx) => (
                            <li key={idx}>
                                <strong>{item.DetalleReceta.cantidad}</strong> de {item.nombre || 'Producto'}
                            </li>
                        ))}
                    </ul>
                </section>

                <hr className="divider" />

                <section className="recipe-section">
                    <h4><Utensils size={18} className="icon-blue" /> Instrucciones</h4>
                    <div className="instructions-container">
                        {receta.pasos && receta.pasos.length > 0 ? (
                            <ul className="steps-list">
                                {receta.pasos.map((paso, index) => (
                                    <li key={index} className="step-item">
                                        <p>{paso}</p>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="no-data">No hay pasos registrados para esta receta.</p>
                        )}
                    </div>
                </section>
            </div>

            <div className="modal-footer-btns">
                <button className="btn-secondary full-width" onClick={onClose}>Cerrar</button>
            </div>
        </div>
    );
};

export default ModalAzul;