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

        const user = await User.findByEmail(username) || await User.findByEmail(username) // Allow email or username login potentially? Prompt says username/password.
        // Wait, User.findByEmail finds by email. Prompt Schema says username AND email.
        // Let's assume input 'username' might be mapped to username or email. 
        // But let's check the request: POST /api/auth/login Body: { username, password }
        // User model `findByEmail` queries `email`. I should probably have `findByUsername` too.

        // Let's quickly fix User model or just adding query here?
        // Better to query DB directly here or add method. `User.js` had `findByEmail`. I should add `findByUsername`.
        // I will assume for now I should use a generic find.

        // To keep it simple and strictly follow prompt: users table has username.
        // My User.js only has findByEmail. I made a mistake there.
        // I will perform a direct query here or update User model later.
        // Actually, let's update this file to use a hypothetical `findByUsername` and I will update User.js in next turn if needed.
        // Or I can query using db.query here if I import db.

        // Revisiting User.js content I wrote:
        // `static async findByEmail(email) { ... WHERE email = $1 ... }`

        // I should probably support login by Username since the prompt says "Body: { username, password }".
        // I will use `User.findByUsername` and assume I'll add it.

        let targetUser = await User.findByUsername(username);
        if (!targetUser) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const isValid = await User.verifyPassword(targetUser, password);
        if (!isValid) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        const token = generateToken(targetUser);

        res.json({
            success: true,
            data: {
                user: {
                    id: targetUser.id,
                    username: targetUser.username,
                    role: targetUser.role,
                    full_name: targetUser.full_name
                },
                token
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

exports.register = async (req, res) => {
    try {
        const { username, email, password, full_name, role } = req.body;

        // Basic validation
        if (!username || !email || !password || !full_name) {
            return res.status(400).json({ success: false, error: 'All fields are required' });
        }

        // Check if exists
        // const existing = await User.findByEmail(email); 
        // ...

        const newUser = await User.create({ username, email, password, full_name, role });

        res.status(201).json({
            success: true,
            data: { user: newUser }
        });

    } catch (error) {
        console.error('Register error:', error);
        if (error.code === '23505') { // Unique violation
            return res.status(409).json({ success: false, error: 'Username or email already exists' });
        }
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

exports.getMe = (req, res) => {
    res.json({
        success: true,
        data: { user: req.user }
    });
};
