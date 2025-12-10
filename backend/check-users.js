const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

async function checkUsers() {
    try {
        const res = await pool.query('SELECT id, username, email, password_hash FROM users');
        console.log('Users found:', res.rows.length);
        res.rows.forEach(user => {
            console.log(`- Username: ${user.username}, Email: ${user.email}`);
        });
    } catch (err) {
        console.error('Error querying users:', err);
    } finally {
        await pool.end();
    }
}

checkUsers();
