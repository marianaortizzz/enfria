# Proyecto Enfria

Este proyecto consiste en una aplicación web para la gestión de recetas, inventarios y listas de compras. Está dividido en dos partes principales: el backend y el frontend.

## Requisitos previos

Asegúrate de tener instalados los siguientes programas en tu sistema:

- [Node.js](https://nodejs.org/) (versión 16 o superior)
- [npm](https://www.npmjs.com/) (incluido con Node.js)
- [Git](https://git-scm.com/)

## Dependencias

### Backend

Las dependencias del backend están definidas en el archivo `package.json` dentro de la carpeta `backend`. Algunas de las principales son:

- `express`: Framework para construir el servidor.
- `sequelize`: ORM para la base de datos.
- `mysql2`: Driver para conectarse a bases de datos MySQL.
- `dotenv`: Manejo de variables de entorno.

### Frontend

Las dependencias del frontend están definidas en el archivo `package.json` dentro de la carpeta `frontend`. Algunas de las principales son:

- `react`: Biblioteca para construir interfaces de usuario.
- `react-dom`: Renderizado de componentes React en el DOM.
- `axios`: Cliente HTTP para realizar peticiones al backend.
- `lucide-react`: Iconos para la interfaz.

## Instrucciones para correr el proyecto

### Clonar el repositorio

Primero, clona el repositorio en tu máquina local:

```bash
git clone <URL_DEL_REPOSITORIO>
cd Enfria
```

### Configurar el backend

1. Navega a la carpeta del backend:

   ```bash
   cd backend
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Inicia el servidor:

   ```bash
   npm run dev
   ```

   El servidor estará corriendo en `http://localhost:3000`.

### Configurar el frontend

1. Navega a la carpeta del frontend:

   ```bash
   cd ../frontend
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Inicia la aplicación:

   ```bash
   npm start
   ```

   La aplicación estará disponible en `http://localhost:3001`.

## Estructura del proyecto

```
Enfria/
├── backend/
│   ├── src/
│   │   ├── config/       # Configuración de la base de datos
│   │   ├── controllers/  # Controladores de las rutas
│   │   ├── models/       # Modelos de la base de datos
│   │   ├── routes/       # Definición de rutas
│   ├── package.json      # Dependencias del backend
│   └── index.js          # Punto de entrada del servidor
├── frontend/
│   ├── src/
│   │   ├── components/   # Componentes de React
│   │   ├── views/        # Vistas principales
│   │   ├── styles/       # Archivos CSS
│   ├── package.json      # Dependencias del frontend
│   └── public/           # Archivos estáticos
└── README.md             # Documentación del proyecto
```

## Notas adicionales

- Asegúrate de que el backend esté corriendo antes de iniciar el frontend.
- Si tienes problemas con la base de datos, verifica que el servicio MySQL esté activo y que las credenciales en el archivo `.env` sean correctas.

## Autor

Este proyecto fue desarrollado por [Tu Nombre].
