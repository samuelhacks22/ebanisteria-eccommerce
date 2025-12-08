const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env'), override: true });
const bcrypt = require('bcryptjs');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

async function seed() {
    try {
        console.log('Connecting to database...');

        // 1. Seed Users (ensure Admin exists)
        console.log('Seeding Users...');
        const adminHash = await bcrypt.hash('password123', 10);
        const adminRes = await pool.query(`
            INSERT INTO users (username, email, password_hash, role, full_name)
            VALUES ('admin', 'admin@example.com', $1, 'admin', 'Administrador')
            ON CONFLICT (username) DO UPDATE SET password_hash = $1
            RETURNING id;
        `, [adminHash]);
        const adminId = adminRes.rows[0].id;

        // 2. Seed Customers
        console.log('Seeding Customers...');
        await pool.query('DELETE FROM customers'); // Clean slate for customers

        const customerData = [
            ['1001', 'Juan Pérez', '555-0101', 'juan@example.com', 'Calle 123 #45-67'],
            ['1002', 'Maria Garcia', '555-0102', 'maria@example.com', 'Carrera 10 #11-22'],
            ['1003', 'Carlos Lopez', '555-0103', 'carlos@example.com', 'Av. Siempre Viva 123']
        ];

        const customers = [];
        for (const [doc, name, phone, email, addr] of customerData) {
            const res = await pool.query(`
                INSERT INTO customers (identity_document, full_name, phone, email, address)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING id;
            `, [doc, name, phone, email, addr]);
            customers.push(res.rows[0].id);
        }

        // 3. Seed Materials
        console.log('Seeding Materials...');
        await pool.query('DELETE FROM materials');

        const materialData = [
            ['Roble (Tabla 3m)', 'madera', 'unidades', 50, 10, 25.00],
            ['Pino (Tabla 3m)', 'madera', 'unidades', 100, 20, 15.50],
            ['Barniz Transparente', 'pintura', 'litros', 20, 5, 12.00],
            ['Lija #180', 'otros', 'unidades', 200, 50, 0.50],
            ['Bisagra 3"', 'herrajes', 'unidades', 150, 30, 1.20]
        ];

        for (const [name, cat, unit, stock, min, cost] of materialData) {
            await pool.query(`
                INSERT INTO materials (name, category, unit, current_stock, min_stock_alert, unit_cost)
                VALUES ($1, $2, $3, $4, $5, $6);
            `, [name, cat, unit, stock, min, cost]);
        }

        // 4. Seed Orders
        console.log('Seeding Orders...');
        await pool.query('DELETE FROM orders');

        const orderData = [
            [customers[0], 'ORD-001', 'Mesa de Comedor', 'Mesa de roble para 6 personas', 1200.00, '2023-12-25', 'pending'],
            [customers[1], 'ORD-002', 'Silla de Jardin', 'Juego de 4 sillas de pino', 400.00, '2023-12-20', 'in_progress'],
            [customers[2], 'ORD-003', 'Estantería', 'Estantería de pared 2x2m', 350.00, '2023-12-15', 'delivered']
        ];

        for (const [custId, num, type, desc, price, deliv, status] of orderData) {
            await pool.query(`
                INSERT INTO orders (customer_id, order_number, furniture_type, description, agreed_price, estimated_delivery, status, created_by)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
            `, [custId, num, type, desc, price, deliv, status, adminId]);
        }

        console.log('Database seeded successfully!');

    } catch (error) {
        console.error('Seeding error:', error);
    } finally {
        await pool.end();
    }
}

seed();
