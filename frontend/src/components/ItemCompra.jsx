import React from 'react';
import { Trash2, Edit2, ShoppingBag, DollarSign } from 'lucide-react';

const ItemCompra = ({ item, onEditar, onEliminar }) => {
    return (
        <div className="item-compra-card">
            <div className="item-info">
                <div className="item-main">
                    <ShoppingBag size={18} className="icon-yellow" />
                    <strong>{item.Producto?.nombre || 'Producto'}</strong>
                </div>
                
                <div className="item-details">
                    <span className="item-price">
                        <DollarSign size={14} /> {item.precio_estimado || '0.00'}
                    </span>
                    <span className="item-qty-tag">
                        Cant: {item.cantidad}
                    </span>
                </div>
            </div>

            <div className="item-actions">
                <button 
                    className="btn-action btn-edit"
                    onClick={() => onEditar(item)} // Aquí pasas todo el objeto 'item'
                >
                    <Edit2 size={16} />
                </button>
                
                <button 
                    className="btn-action btn-delete"
                    onClick={() => onEliminar(item.id)}
                    title="Eliminar de la lista"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
};

export default ItemCompra;