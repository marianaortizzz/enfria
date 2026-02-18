import React, { useState } from 'react';
import { apiCall } from '../../api/api';
import { ShoppingCart } from 'lucide-react';

const ModalAmarillo = ({ catalogo, userId, onClose }) => {
    const [esNuevoProducto, setEsNuevoProducto] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        
        // Estructura del payload solo para creación
        const payload = {
            nombre: esNuevoProducto 
                ? formData.get('nombre_nuevo') 
                : catalogo.find(p => p.id == formData.get('id_catalogo'))?.nombre,
            precio_estimado: parseFloat(formData.get('precio')) || 0,
            cantidad: parseInt(formData.get('cantidad')),
            id_usuario: userId
        };

        try {
            await apiCall('/lista/agregarSupermercado', 'POST', payload);
            alert("¡Añadido a la lista de compras!");
            onClose(); // Cerramos y refrescamos a través del padre
        } catch (err) {
            alert("Error: " + err.message);
        }
    };

    return (
        <div className="form-container">
            <h3>
                <ShoppingCart className="icon-yellow" /> Agregar a Lista de Compras
            </h3>

            <form onSubmit={handleSubmit}>
                {/* Toggle para alternar entre catálogo y manual */}
                <div className="toggle-container toggle-yellow">
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
                        <label>¿Qué necesitas comprar?</label>
                        <input 
                            name="nombre_nuevo" 
                            required 
                            className="form-input" 
                            placeholder="Ej. Jabón de trastes" 
                        />
                    </div>
                ) : (
                    <div className="form-group">
                        <label>Seleccionar del Catálogo</label>
                        <select name="id_catalogo" required className="form-input">
                            <option value="">-- Buscar producto --</option>
                            {catalogo.map(prod => (
                                <option key={prod.id} value={prod.id}>{prod.nombre}</option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="form-row">
                    <div className="form-group">
                        <label>Cantidad</label>
                        <input 
                            name="cantidad" 
                            type="number" 
                            min="1" 
                            defaultValue="1" 
                            required 
                            className="form-input" 
                        />
                    </div>
                    <div className="form-group">
                        <label>Precio Estimado ($)</label>
                        <input 
                            name="precio" 
                            type="number" 
                            step="0.01" 
                            placeholder="0.00"
                            className="form-input" 
                        />
                    </div>
                </div>

                <div className="modal-footer-btns">
                    <button type="button" className="btn-secondary" onClick={onClose}>
                        Cancelar
                    </button>
                    <button type="submit" className="btn-save btn-yellow-full">
                        Añadir a la lista
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ModalAmarillo;