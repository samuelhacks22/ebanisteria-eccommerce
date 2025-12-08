const db = require('../utils/db');

exports.getOrdersReport = async (req, res) => {
    try {
        const { start_date, end_date, status } = req.query;

        let query = `
            SELECT o.*, c.full_name as customer_name
            FROM orders o
            JOIN customers c ON o.customer_id = c.id
        `;
        let params = [];
        let whereClauses = [];

        if (start_date) {
            params.push(start_date);
            whereClauses.push(`o.created_at >= $${params.length}`);
        }
        if (end_date) {
            params.push(end_date);
            whereClauses.push(`o.created_at <= $${params.length}`);
        }
        if (status) {
            params.push(status);
            whereClauses.push(`o.status = $${params.length}`);
        }

        if (whereClauses.length > 0) {
            query += ' WHERE ' + whereClauses.join(' AND ');
        }

        query += ' ORDER BY o.created_at DESC';

        const result = await db.query(query, params);

        // Calculate summary stats
        const totalOrders = result.rows.length;
        const totalValue = result.rows.reduce((sum, order) => sum + parseFloat(order.agreed_price), 0);

        const byStatus = result.rows.reduce((acc, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
        }, {});

        res.json({
            success: true,
            data: {
                orders: result.rows,
                summary: {
                    total_orders: totalOrders,
                    total_value: totalValue,
                    by_status: byStatus
                }
            }
        });

    } catch (error) {
        console.error('Report error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

exports.getInventoryReport = async (req, res) => {
    try {
        const result = await db.query(`
            SELECT 
                COUNT(*) as total_items,
                SUM(current_stock * COALESCE(unit_cost, 0)) as total_value,
                COUNT(*) FILTER (WHERE current_stock <= min_stock_alert) as low_stock_items
            FROM materials
        `);

        res.json({
            success: true,
            data: result.rows[0]
        });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};
