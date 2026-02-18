import React, { useState } from 'react';
import { apiCall } from '../../api/api';
import { Plus } from 'lucide-react';

const ModalVerde = ({ catalogo, userId, onClose }) => {
    const [esNuevoProducto, setEsNuevoProducto] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        const payload = {
            id_usuario: userId,
            cantidad: formData.get('cantidad'),
            nombre: esNuevoProducto ? formData.get('nombre_nuevo') : null,
            id_catalogo: esNuevoProducto ? null : formData.get('id_catalogo')
        };

        try {
            await apiCall('/inventario/agregarInventario', 'POST', payload);
            alert("¡Producto guardado en refrigerador!");
            onClose();
        } catch (err) {
            alert("Error: " + err.message);
        }
    };

    return (
        <div className="form-container">
            <h3><Plus className="icon-green" /> Agregar al Refrigerador</h3>
            <form onSubmit={handleSubmit}>
                <div className="toggle-container">
                    <label>
                        <input 
                            type="checkbox" 
                            checked={esNuevoProducto}
                            onChange={(e) => setEsNuevoProducto(e.target.checked)} 
                        />
                        El producto no está en la lista (crear nuevo)
                    </label>
                </div>

                {esNuevoProducto ? (
                    <div className="form-group">
                        <label>Nombre del Nuevo Producto</label>
                        <input name="nombre_nuevo" placeholder="Ej. Cilantro fresco" required className="form-input" />
                    </div>
                ) : (
                    <div className="form-group">
                        <label>Seleccionar del Catálogo</label>
                        <select name="id_catalogo" required className="form-input">
                            <option value="">-- Elige un producto --</option>
                            {catalogo.map(prod => (
                                <option key={prod.id} value={prod.id}>{prod.nombre}</option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="form-group">
                    <label>Cantidad</label>
                    <input name="cantidad" type="number" min="1" defaultValue="1" required className="form-input" />
                </div>

                <div className="modal-footer-btns">
                    <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
                    <button type="submit" className="btn-save btn-green-full">Confirmar</button>
                </div>
            </form>
        </div>
    );
};

export default ModalVerde;