const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function checkSchema() {
    try {
        console.log('--- Database Schema Check ---');
        console.log('Connected to:', process.env.DATABASE_URL.split('@')[1]);

        // List tables
        const tablesRes = await pool.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            ORDER BY table_name;
        `);

        console.log('\nTables found:', tablesRes.rows.map(r => r.table_name));

        // Check columns for 'users'
        if (tablesRes.rows.some(r => r.table_name === 'users')) {
            const usersCols = await pool.query(`
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = 'users';
            `);
            console.log('\nColumns in "users":', usersCols.rows.map(r => `${r.column_name} (${r.data_type})`));
        }

        // Check columns for 'customers'
        if (tablesRes.rows.some(r => r.table_name === 'customers')) {
            const custCols = await pool.query(`
                SELECT column_name, data_type 
                FROM information_schema.columns 
                WHERE table_name = 'customers';
            `);
            console.log('\nColumns in "customers":', custCols.rows.map(r => `${r.column_name} (${r.data_type})`));
        }

    } catch (err) {
        console.error('Error checking schema:', err);
    } finally {
        await pool.end();
    }
}

checkSchema();
