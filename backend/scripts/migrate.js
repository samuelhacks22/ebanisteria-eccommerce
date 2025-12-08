const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '../.env'), override: true });

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    console.error('Error: DATABASE_URL is not defined in .env file');
    process.exit(1);
}

// Debug logs
console.log('--- DB CONNECTION DEBUG ---');
console.log('Reading .env from:', path.join(__dirname, '../.env'));
console.log('Connecting to:', databaseUrl.split('@')[1]); // Show only host part
console.log('---------------------------');

const pool = new Pool({
    connectionString: databaseUrl,
    ssl: { rejectUnauthorized: false }
});

async function migrate() {
    try {
        // PRE-CHECK
        console.log('--- PRE-MIGRATION CHECK ---');
        const preCheck = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
        console.log('Existing tables:', preCheck.rows.map(r => r.table_name));

        const schemaPath = path.join(__dirname, '../../database/schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Running migration...');
        // Execute schema SQL
        await pool.query(schemaSql);
        console.log('Schema executed.');

        // POST-CHECK
        console.log('--- POST-MIGRATION CHECK ---');
        const postCheck = await pool.query("SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'");
        console.log('Tables after migration:', postCheck.rows.map(r => r.table_name));

        // Validation
        const expectedTables = ['users', 'customers', 'materials', 'orders', 'order_materials'];
        const foundTables = postCheck.rows.map(r => r.table_name);
        if (!expectedTables.every(t => foundTables.includes(t))) {
            console.error('CRITICAL: Some tables are missing after migration!', expectedTables.filter(t => !foundTables.includes(t)));
        } else {
            console.log('All expected tables found.');
        }

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
