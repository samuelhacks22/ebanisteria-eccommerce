const db = require('../utils/db');
const bcrypt = require('bcryptjs');

class User {
    static async findByEmail(email) {
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        return result.rows[0];
    }

    static async findByUsername(username) {
        const result = await db.query('SELECT * FROM users WHERE username = $1', [username]);
        return result.rows[0];
    }

    static async findById(id) {
        const result = await db.query('SELECT id, username, email, full_name, role FROM users WHERE id = $1', [id]);
        return result.rows[0];
    }

    static async create({ username, email, password, full_name, role = 'staff' }) {
        const passwordHash = await bcrypt.hash(password, 12);

        try {
            const result = await db.query(
                `INSERT INTO users (username, email, password_hash, full_name, role) 
                 VALUES ($1, $2, $3, $4, $5) 
                 RETURNING id, username, email, full_name, role, created_at`,
                [username, email, passwordHash, full_name, role]
            );
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async verifyPassword(user, password) {
        return await bcrypt.compare(password, user.password_hash);
    }
}

module.exports = User;
