import React from 'react';
import { apiCall } from '../../api/api';
import { Edit3, RefreshCw } from 'lucide-react';

const ModalNaranja = ({ editData, userId, onClose }) => {
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        const payload = {
            id_lista_compras: editData.id,
            cantidad: parseInt(formData.get('cantidad')),
            precio_estimado: parseFloat(formData.get('precio')),
            id_usuario: userId
        };

        try {
            await apiCall('/lista/modificarSupermercado/' + payload.id_lista_compras, 'PUT', payload);
            alert("¡Producto actualizado!");
            onClose();
        } catch (err) {
            alert("Error al actualizar: " + err.message);
        }
    };

    return (
        <div className="form-container">
            <h3><Edit3 className="icon-orange" /> Editar Cantidades</h3>
            <p className="edit-subtitle">
                Modificando: <strong>{editData.Catalogo_Producto?.nombre || editData.nombre}</strong>
            </p>

            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nueva Cantidad</label>
                    <input 
                        name="cantidad" 
                        type="number" 
                        defaultValue={editData.cantidad_a_comprar || editData.cantidad} 
                        className="form-input" 
                        required 
                    />
                </div>

                <div className="form-group">
                    <label>Precio Estimado ($)</label>
                    <input 
                        name="precio" 
                        type="number" 
                        step="0.01" 
                        defaultValue={editData.precio_aproximado || editData.precio_estimado} 
                        className="form-input" 
                    />
                </div>

                <div className="modal-footer-btns">
                    <button type="button" className="btn-secondary" onClick={onClose}>Descartar</button>
                    <button type="submit" className="btn-save btn-orange-full">
                        <RefreshCw size={16} /> Actualizar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ModalNaranja;