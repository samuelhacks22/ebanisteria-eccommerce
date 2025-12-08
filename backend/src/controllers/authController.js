const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, error: 'Username and password are required' });
        }

        const user = await User.findByUsername(username);
        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const isValid = await User.verifyPassword(user, password);
        if (!isValid) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const token = generateToken(user);

        res.json({
            success: true,
            data: {
                user: {
                    id: user.id,
                    username: user.username,
                    role: user.role,
                    full_name: user.full_name
                },
                token
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

// Helper for email validation
const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

exports.register = async (req, res) => {
    try {
        const { username, email, password, full_name, role } = req.body;

        // Validation
        if (!username || !email || !password || !full_name) {
            return res.status(400).json({ success: false, error: 'Todos los campos son obligatorios' });
        }

        if (!validateEmail(email)) {
            return res.status(400).json({ success: false, error: 'Formato de email inválido' });
        }

        if (password.length < 6) {
            return res.status(400).json({ success: false, error: 'La contraseña debe tener al menos 6 caracteres' });
        }

        // Check if exists
        const existingUser = await User.findByUsername(username);
        if (existingUser) {
            return res.status(400).json({ success: false, error: 'El nombre de usuario ya está en uso' });
        }

        const existingEmail = await User.findByEmail(email);
        if (existingEmail) {
            return res.status(400).json({ success: false, error: 'El email ya está registrado' });
        }

        const newUser = await User.create({ username, email, password, full_name, role });

        const token = generateToken(newUser);

        res.status(201).json({
            success: true,
            data: {
                user: {
                    id: newUser.id,
                    username: newUser.username,
                    role: newUser.role,
                    full_name: newUser.full_name
                },
                token
            }
        });

    } catch (error) {
        console.error('Register error:', error);
        if (error.code === '23505') { // Unique violation
            return res.status(409).json({ success: false, error: 'Username or email already exists' });
        }
        res.status(500).json({ success: false, error: 'Server error: ' + error.message });
    }
};

exports.getMe = (req, res) => {
    res.json({
        success: true,
        data: { user: req.user }
    });
};
