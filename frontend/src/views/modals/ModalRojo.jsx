import React, { useState } from 'react';
import { apiCall } from '../../api/api';
import { UtensilsCrossed, Plus, X } from 'lucide-react';

const ModalRojo = ({ catalogo, userId, onClose }) => {
    const [ingredientes, setIngredientes] = useState([]);
    const [tempCantidad, setTempCantidad] = useState("");
    const [selectedProd, setSelectedProd] = useState("");
    const [nombreManual, setNombreManual] = useState("");
    const [esNuevoProducto, setEsNuevoProducto] = useState(false);

    const agregarIngrediente = () => {
        // Validar que tengamos cantidad y alguno de los dos métodos de nombre
        if (!tempCantidad || (!esNuevoProducto && !selectedProd) || (esNuevoProducto && !nombreManual)) return;
        
        let nuevoIng;

        if (esNuevoProducto) {
            nuevoIng = {
                id_catalogo: null,
                nombre: nombreManual,
                cantidad: tempCantidad
            };
        } else {
            const producto = catalogo.find(p => p.id === parseInt(selectedProd));
            nuevoIng = {
                id_catalogo: producto.id,
                nombre: producto.nombre,
                cantidad: tempCantidad
            };
        }

        setIngredientes([...ingredientes, nuevoIng]);
        // Resetear inputs de ingrediente
        setTempCantidad(""); 
        setSelectedProd("");
        setNombreManual("");
    };

    const eliminarIngrediente = (index) => {
        setIngredientes(ingredientes.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (ingredientes.length === 0) {
            alert("Por favor, añade al menos un ingrediente.");
            return;
        }

        const formData = new FormData(e.target);
        
        const payload = {
            id_usuario: userId,
            nombre: formData.get('nombre'),
            tiempo_aproximado: formData.get('tiempo'),
            pasos: formData.get('instrucciones'),
            ingredientes: ingredientes 
        };

        try {
            await apiCall('/recetas/agregarReceta', 'POST', payload);
            alert("¡Receta creada!");
            onClose();
        } catch (err) {
            alert("Error: " + err.message);
        }
    };

    return (
        <div className="form-container recipe-creator">
            <h3><UtensilsCrossed className="icon-red" /> Crear Nueva Receta</h3>
            
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Nombre de la Receta</label>
                    <input name="nombre" placeholder="Ej. Tacos de Pollo" required className="form-input" />
                </div>

                <div className="form-group">
                    <label>Tiempo (min)</label>
                    <input name="tiempo" type="number" defaultValue="30" className="form-input" />
                </div>

                {/* --- SECCIÓN DE INGREDIENTES --- */}
                <div className="ingredients-selector-box">
                    <div className="header-flex">
                        <h4>Añadir Ingredientes</h4>
                        <label className="toggle-mini">
                            <input 
                                type="checkbox" 
                                checked={esNuevoProducto} 
                                onChange={(e) => setEsNuevoProducto(e.target.checked)} 
                            />
                            ¿No está en la lista?
                        </label>
                    </div>

                    <div className="add-ingredient-inline">
                        {esNuevoProducto ? (
                            <input 
                                type="text"
                                className="form-input"
                                placeholder="Nombre del ingrediente"
                                value={nombreManual}
                                onChange={(e) => setNombreManual(e.target.value)}
                            />
                        ) : (
                            <select 
                                className="form-input"
                                value={selectedProd}
                                onChange={(e) => setSelectedProd(e.target.value)}
                            >
                                <option value="">Selecciona producto...</option>
                                {catalogo.map(p => <option key={p.id} value={p.id}>{p.nombre}</option>)}
                            </select>
                        )}
                        
                        <input 
                            type="text" 
                            placeholder="Cant. (500g)" 
                            className="form-input qty-small"
                            value={tempCantidad}
                            onChange={(e) => setTempCantidad(e.target.value)}
                        />
                        
                        <button type="button" className="btn-add-circle" onClick={agregarIngrediente}>
                            <Plus size={20} />
                        </button>
                    </div>

                    <div className="added-ingredients-list">
                        {ingredientes.map((ing, idx) => (
                            <div key={idx} className="ing-tag">
                                <span>{ing.nombre} ({ing.cantidad})</span>
                                <X size={14} className="btn-remove-ing" onClick={() => eliminarIngrediente(idx)} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="form-group">
                    <label>Instrucciones</label>
                    <textarea name="instrucciones" rows="4" className="form-input text-area" placeholder="Paso 1..."></textarea>
                </div>

                <div className="modal-footer-btns">
                    <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
                    <button type="submit" className="btn-save btn-red-full">Guardar Receta</button>
                </div>
            </form>
        </div>
    );
};

export default ModalRojo;