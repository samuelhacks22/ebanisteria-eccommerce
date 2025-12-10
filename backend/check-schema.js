const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function checkSchema() {
    try {
        const res = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'users'");
        console.log('Columns in users table:', res.rows.map(r => r.column_name));

        // Also try to list all users with star
        const users = await pool.query('SELECT * FROM users');
        console.log('Users found:', users.rows.length);
        if (users.rows.length > 0) {
            console.log('First user keys:', Object.keys(users.rows[0]));
            console.log('First user:', users.rows[0]);
        }
    } catch (err) {
        console.error('Error:', err);
    } finally {
        await pool.end();
    }
}

checkSchema();
