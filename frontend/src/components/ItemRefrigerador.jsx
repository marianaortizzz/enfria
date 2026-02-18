import React from 'react';
import { Minus, Plus, Calendar, Package } from 'lucide-react';

const ItemRefrigerador = ({ item, onModificar }) => {
    // Formatear la fecha para que sea legible
    const fechaFormateada = new Date(item.fecha_ingreso).toLocaleDateString('es-MX', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });

    return (
        <div className="item-refrigerador-card">
            <div className="item-info">
                <div className="item-main">
                    <Package size={18} className="icon-blue" />
                    <strong>{item.Producto?.nombre || 'Producto'}</strong>
                </div>
                
                <div className="item-details">
                    <span className="item-date">
                        <Calendar size={14} /> {fechaFormateada}
                    </span>
                    <span className="item-qty-badge">
                        {item.cantidad_disponible} unidades
                    </span>
                </div>
            </div>

            <div className="item-actions">
                <button 
                    className="btn-qty btn-minus"
                    onClick={() => onModificar(item.id, item.cantidad_disponible - 1)}
                    disabled={item.cantidad_disponible <= 0}
                >
                    <Minus size={16} />
                </button>
                
                <button 
                    className="btn-qty btn-plus"
                    onClick={() => onModificar(item.id, item.cantidad_disponible + 1)}
                >
                    <Plus size={16} />
                </button>
            </div>
        </div>
    );
};

export default ItemRefrigerador;