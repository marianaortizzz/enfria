import ModalVerde from './ModalVerde';
import ModalAmarillo from './ModalAmarillo';
import ModalNaranja from './ModalNaranja';
import ModalRojo from './ModalRojo';
import ModalAzul from './ModalAzul';

const ModalManager = ({ config, catalogo, userId, onClose }) => {
    if (!config.abierto) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                {config.tipo === 'verde'    && <ModalVerde catalogo={catalogo} userId={userId} onClose={onClose} />}
                {config.tipo === 'amarillo' && <ModalAmarillo catalogo={catalogo} userId={userId} onClose={onClose} />}
                {config.tipo === 'naranja'  && <ModalNaranja editData={config.datos} userId={userId} onClose={onClose} />}
                {config.tipo === 'rojo'     && <ModalRojo catalogo={catalogo} userId={userId} onClose={onClose} />}
                {config.tipo === 'azul'     && <ModalAzul receta={config.datos} onClose={onClose} />}
            </div>
        </div>
    );
};

export default ModalManager;