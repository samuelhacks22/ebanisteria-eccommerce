const db = require('../utils/db');

class Order {
    static async create({ customer_id, order_number, furniture_type, description, agreed_price, estimated_delivery, created_by }) {
        try {
            const result = await db.query(
                `INSERT INTO orders (customer_id, order_number, furniture_type, description, agreed_price, estimated_delivery, created_by)
                 VALUES ($1, $2, $3, $4, $5, $6, $7)
                 RETURNING *`,
                [customer_id, order_number, furniture_type, description, agreed_price, estimated_delivery, created_by]
            );
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async findAll({ status, customer_id, limit = 10, offset = 0 }) {
        let query = `
            SELECT o.*, c.full_name as customer_name 
            FROM orders o
            JOIN customers c ON o.customer_id = c.id
        `;
        let countQuery = 'SELECT COUNT(*) FROM orders';
        let params = [];
        let whereClauses = [];

        if (status) {
            params.push(status);
            whereClauses.push(`o.status = $${params.length}`);
        }
        if (customer_id) {
            params.push(customer_id);
            whereClauses.push(`o.customer_id = $${params.length}`);
        }

        if (whereClauses.length > 0) {
            const whereStr = ' WHERE ' + whereClauses.join(' AND ');
            query += whereStr;
            countQuery += whereStr;
        }

        query += ` ORDER BY o.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;

        const dataParams = [...params, limit, offset];

        const [dataResult, countResult] = await Promise.all([
            db.query(query, dataParams),
            db.query(countQuery, params)
        ]);

        return {
            orders: dataResult.rows,
            total: parseInt(countResult.rows[0].count)
        };
    }

    static async findById(id) {
        const result = await db.query(`
            SELECT o.*, c.full_name as customer_name, c.phone as customer_phone, c.email as customer_email
            FROM orders o
            JOIN customers c ON o.customer_id = c.id
            WHERE o.id = $1
        `, [id]);
        return result.rows[0];
    }

    static async update(id, updates) {
        // Construct dynamic update query
        const fields = Object.keys(updates);
        if (fields.length === 0) return null;

        const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
        const values = Object.values(updates);

        // Add updated_at
        const result = await db.query(
            `UPDATE orders 
             SET ${setClause}, updated_at = CURRENT_TIMESTAMP
             WHERE id = $1
             RETURNING *`,
            [id, ...values]
        );
        return result.rows[0];
    }

    static async delete(id) {
        const result = await db.query('DELETE FROM orders WHERE id = $1 RETURNING id', [id]);
        return result.rows[0];
    }
}

module.exports = Order;
