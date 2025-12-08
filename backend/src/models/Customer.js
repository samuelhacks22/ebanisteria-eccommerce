const db = require('../utils/db');

class Customer {
    static async create({ identity_document, full_name, phone, email, address }) {
        try {
            const result = await db.query(
                `INSERT INTO customers (identity_document, full_name, phone, email, address)
                 VALUES ($1, $2, $3, $4, $5)
                 RETURNING *`,
                [identity_document, full_name, phone, email, address]
            );
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async findAll({ search, limit = 10, offset = 0 }) {
        let query = 'SELECT * FROM customers';
        let countQuery = 'SELECT COUNT(*) FROM customers';
        let params = [];

        if (search) {
            query += ` WHERE full_name ILIKE $1 OR identity_document ILIKE $1`;
            countQuery += ` WHERE full_name ILIKE $1 OR identity_document ILIKE $1`;
            params.push(`%${search}%`);
        }

        query += ` ORDER BY created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;

        const dataParams = [...params, limit, offset];

        const [dataResult, countResult] = await Promise.all([
            db.query(query, dataParams),
            db.query(countQuery, params)
        ]);

        return {
            customers: dataResult.rows,
            total: parseInt(countResult.rows[0].count)
        };
    }

    static async findById(id) {
        const result = await db.query('SELECT * FROM customers WHERE id = $1', [id]);
        return result.rows[0];
    }

    static async update(id, { identity_document, full_name, phone, email, address }) {
        const result = await db.query(
            `UPDATE customers 
             SET identity_document = $1, full_name = $2, phone = $3, email = $4, address = $5, updated_at = CURRENT_TIMESTAMP
             WHERE id = $6
             RETURNING *`,
            [identity_document, full_name, phone, email, address, id]
        );
        return result.rows[0];
    }

    static async delete(id) {
        const result = await db.query('DELETE FROM customers WHERE id = $1 RETURNING id', [id]);
        return result.rows[0];
    }
}

module.exports = Customer;
