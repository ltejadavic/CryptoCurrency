// authRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
require('dotenv').config();

// Función/middleware para verificar el token
const verificarToken = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');  
    if (!token) return res.status(401).json({ msg: 'Acceso denegado' });

    try {
        const verificado = jwt.verify(token, process.env.JWT_SECRET);
        req.usuario = verificado;  
        next();  
    } catch (error) {
        res.status(400).json({ msg: 'Token no válido' });
    }
};

// Registro de usuarios
router.post('/register', async (req, res) => {
    const { nombre, email, contraseña } = req.body;

    try {
        const userExistente = await User.findOne({ where: { email } });
        if (userExistente) return res.status(400).json({ msg: 'El usuario ya existe' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(contraseña, salt);
        const nuevoUsuario = await User.create({ nombre, email, contraseña: hashedPassword });

        const token = jwt.sign({ id: nuevoUsuario.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
});

// Login de usuarios
router.post('/login', async (req, res) => {
    const { email, contraseña } = req.body;

    try {
        const usuario = await User.findOne({ where: { email } });
        if (!usuario) return res.status(400).json({ msg: 'Usuario no encontrado' });

        const esValida = await bcrypt.compare(contraseña, usuario.contraseña);
        if (!esValida) return res.status(400).json({ msg: 'Contraseña incorrecta' });

        const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

// Ruta para obtener la información del usuario autenticado
router.get('/me', verificarToken, async (req, res) => {
    try {
        const usuario = await User.findByPk(req.usuario.id, {
            attributes: ['nombre', 'email', 'saldo']
        });
        if (!usuario) return res.status(404).json({ msg: 'Usuario no encontrado' });

        res.json(usuario);
    } catch (error) {
        res.status(400).json({ msg: 'Error al obtener el usuario' });
    }
});

module.exports = { router, verificarToken };  // Exportar el router y el middleware verificarToken