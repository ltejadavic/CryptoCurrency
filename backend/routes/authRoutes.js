const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();
require('dotenv').config();

// Registro de usuarios
router.post('/register', async (req, res) => {
    const { nombre, email, contraseña } = req.body;

    try {
        // Verificar si el usuario ya existe
        const userExistente = await User.findOne({ where: { email } });
        if (userExistente) return res.status(400).json({ msg: 'El usuario ya existe' });

        // Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(contraseña, salt);

        // Crear el nuevo usuario
        const nuevoUsuario = await User.create({ nombre, email, contraseña: hashedPassword });

        // Crear token
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
        // Verificar si el usuario existe
        const usuario = await User.findOne({ where: { email } });
        if (!usuario) return res.status(400).json({ msg: 'Usuario no encontrado' });

        // Verificar contraseña
        const esValida = await bcrypt.compare(contraseña, usuario.contraseña);
        if (!esValida) return res.status(400).json({ msg: 'Contraseña incorrecta' });

        // Crear token
        const token = jwt.sign({ id: usuario.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

// Ruta para obtener la información del usuario autenticado
router.get('/me', async (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');  // Quita el prefijo "Bearer "
    if (!token) return res.status(401).json({ msg: 'Acceso denegado' });

    try {
        const verificado = jwt.verify(token, process.env.JWT_SECRET);
        const usuario = await User.findByPk(verificado.id, {
            attributes: ['nombre', 'email', 'saldo']
        });
        if (!usuario) return res.status(404).json({ msg: 'Usuario no encontrado' });

        res.json(usuario);
    } catch (error) {
        res.status(400).json({ msg: 'Token no válido' });
    }
});

module.exports = router;