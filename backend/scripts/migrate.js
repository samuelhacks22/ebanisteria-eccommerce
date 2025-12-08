const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');

const databaseUrl = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_I6O2Rdikjzwx@ep-morning-hall-ahotyvt4-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require';

const pool = new Pool({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false }
});

async function migrate() {
    try {
        const schemaPath = path.join(__dirname, '../../database/schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Running migration...');
        await pool.query(schemaSql);
        console.log('Migration completed successfully.');

        // Seed Admin if not exists
        const adminCheck = await pool.query("SELECT * FROM users WHERE username = 'admin'");
        if (adminCheck.rows.length === 0) {
            console.log('Seeding admin user...');
            const bcrypt = require('bcryptjs');
            const hash = await bcrypt.hash('password123', 12);
            await pool.query(`
                INSERT INTO users (username, email, password_hash, full_name, role)
                VALUES ('admin', 'admin@example.com', $1, 'System Admin', 'admin')
             `, [hash]);
            console.log('Admin user seeded (admin/password123).');
        }

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await pool.end();
    }
}

migrate();
