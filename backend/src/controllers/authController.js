const { Usuario } = require('../models');

const crearUsuario = async (req, res) => {
    try {
        const { nombre, correo, contraseña } = req.body;
        const usuarioExistente = await Usuario.findOne({ where: { correo: correo } });
        
        if (usuarioExistente) {
            return res.status(400).json({ 
                error: "El correo ya está registrado por otro usuario." 
            });
        }

        const nuevoUsuario = await Usuario.create({
            nombre,
            correo,
            contraseña
        });

        res.status(201).json({
            mensaje: "Usuario creado exitosamente",
            usuario: {
                id: nuevoUsuario.id,
                nombre: nuevoUsuario.nombre,
                correo: nuevoUsuario.correo
            }
        });

    } catch (error) {
        console.error("Error en crearUsuario:", error);
        res.status(500).json({ error: "Ocurrió un error al registrar al usuario." });
    }
};

const login = async(req,res)=>{
    try {
        const { correo, contraseña } = req.body;
        const usuarioExistente = await Usuario.findOne({ where: { correo: correo }});
        if (!usuarioExistente) {
            return res.status(400).json({ 
                error: "No existe un usuario con ese correo" 
            });
        }
        if(usuarioExistente.contraseña == contraseña){
            res.status(201).json({
                mensaje: "Login correcto",
                usuario: {
                    id: usuarioExistente.id,
                    nombre: usuarioExistente.nombre,
                    correo: usuarioExistente.correo
                }
            });
        }else{
            return res.status(400).json({ 
                error: "Contraseña incorrecta" 
            });
        }

    } catch (error) {
        console.error("Error en loginUsuario:", error);
        res.status(500).json({ error: "Ocurrió un error al intentar login." });
    }
}

module.exports = { crearUsuario, login };