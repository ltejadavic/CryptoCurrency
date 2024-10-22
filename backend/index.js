const express = require('express');
const app = express();
require('dotenv').config();

const cors = require('cors');
app.use(cors());  // Permitir todas las solicitudes CORS

// Middleware para manejar JSON
app.use(express.json());

// Rutas simples para probar
app.get('/', (req, res) => {
    res.send('API en funcionamiento');
});

// Sincronizar la base de datos
const sequelize = require('./db');
const User = require('./models/User');
sequelize.sync()
    .then(() => {
        console.log('Base de datos sincronizada');

        // Iniciar el servidor después de sincronizar la base de datos
        const PORT = process.env.PORT || 5000;
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en el puerto ${PORT}`);
        });
    })
    .catch((err) => console.error('Error al sincronizar la base de datos:', err));

// Rutas de autenticación
const authRoutes = require('./routes/authRoutes');
app.use('/auth', authRoutes);

// Middleware para verificar el token JWT
const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');  // Quitar el prefijo "Bearer "
    if (!token) return res.status(401).json({ msg: 'Acceso denegado' });

    try {
        const verificado = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = verificado;
        next();
    } catch (error) {
        res.status(400).json({ msg: 'Token no válido' });
    }
};

// Ruta protegida de ejemplo
app.get('/protegido', verificarToken, (req, res) => {
    res.json({ msg: `Acceso concedido. Bienvenido, ${req.usuario.id}` });
});