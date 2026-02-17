const Usuario = require('./Usuario');
const Producto = require('./Producto');
const Inventario = require('./Inventario');
const ListaCompra = require('./ListaCompra');
const Receta = require('./Receta');
const DetalleReceta = require('./DetalleReceta');

Usuario.hasMany(Producto, { foreignKey: 'id_usuario' });
Usuario.hasMany(Inventario, { foreignKey: 'id_usuario' });
Usuario.hasMany(ListaCompra, { foreignKey: 'id_usuario' });
Usuario.hasMany(Receta, { foreignKey: 'id_usuario' });

Producto.hasMany(Inventario, { foreignKey: 'id_producto' });
Inventario.belongsTo(Producto, { foreignKey: 'id_producto' });

Producto.hasMany(ListaCompra, { foreignKey: 'id_producto' });
ListaCompra.belongsTo(Producto, { foreignKey: 'id_producto' });

Receta.belongsToMany(Producto, { through: DetalleReceta, foreignKey: 'id_receta' });
Producto.belongsToMany(Receta, { through: DetalleReceta, foreignKey: 'id_producto' });

module.exports = {
  Usuario,
  Producto,
  Inventario,
  ListaCompra,
  Receta,
  DetalleReceta
};