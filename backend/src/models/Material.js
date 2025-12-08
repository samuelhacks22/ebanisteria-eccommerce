const db = require('../utils/db');

class Material {
    static async create({ name, category, unit, current_stock, min_stock_alert, unit_cost }) {
        try {
            const result = await db.query(
                `INSERT INTO materials (name, category, unit, current_stock, min_stock_alert, unit_cost)
                 VALUES ($1, $2, $3, $4, $5, $6)
                 RETURNING *`,
                [name, category, unit, current_stock, min_stock_alert, unit_cost]
            );
            return result.rows[0];
        } catch (error) {
            throw error;
        }
    }

    static async findAll({ category, low_stock, limit = 10, offset = 0 }) {
        let query = 'SELECT * FROM materials';
        let countQuery = 'SELECT COUNT(*) FROM materials';
        let params = [];
        let whereClauses = [];

        if (category) {
            params.push(category);
            whereClauses.push(`category = $${params.length}`);
        }

        if (low_stock === 'true') {
            whereClauses.push(`current_stock <= min_stock_alert`);
        }

        if (whereClauses.length > 0) {
            const whereStr = ' WHERE ' + whereClauses.join(' AND ');
            query += whereStr;
            countQuery += whereStr;
        }

        query += ` ORDER BY name ASC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;

        const dataParams = [...params, limit, offset];

        const [dataResult, countResult] = await Promise.all([
            db.query(query, dataParams),
            db.query(countQuery, params)
        ]);

        return {
            materials: dataResult.rows,
            total: parseInt(countResult.rows[0].count)
        };
    }

    static async findById(id) {
        const result = await db.query('SELECT * FROM materials WHERE id = $1', [id]);
        return result.rows[0];
    }

    static async update(id, updates) {
        const fields = Object.keys(updates);
        if (fields.length === 0) return null;

        const setClause = fields.map((field, index) => `${field} = $${index + 2}`).join(', ');
        const values = Object.values(updates);

        const result = await db.query(
            `UPDATE materials 
             SET ${setClause}, updated_at = CURRENT_TIMESTAMP
             WHERE id = $1
             RETURNING *`,
            [id, ...values]
        );
        return result.rows[0];
    }

    static async delete(id) {
        const result = await db.query('DELETE FROM materials WHERE id = $1 RETURNING id', [id]);
        return result.rows[0];
    }
}

module.exports = Material;
