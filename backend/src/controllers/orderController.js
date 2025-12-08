const Order = require('../models/Order');

// Helper to generate simple order number
const generateOrderNumber = () => {
    return 'ORD-' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 100).toString();
};

exports.getAllOrders = async (req, res) => {
    try {
        const { status, customer_id, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const result = await Order.findAll({ status, customer_id, limit, offset });

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

exports.createOrder = async (req, res) => {
    try {
        const { customer_id, furniture_type, description, agreed_price, estimated_delivery } = req.body;

        if (!customer_id || !furniture_type || !description || !agreed_price) {
            return res.status(400).json({ success: false, error: 'Missing required fields' });
        }

        const order_number = generateOrderNumber();
        const created_by = req.user.id; // From authMiddleware

        const order = await Order.create({
            customer_id,
            order_number,
            furniture_type,
            description,
            agreed_price,
            estimated_delivery,
            created_by
        });

        // TODO: Handle materials here later

        res.status(201).json({
            success: true,
            data: { order }
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }
        res.json({ success: true, data: { order } });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

exports.updateOrder = async (req, res) => {
    try {
        const { customer_id, furniture_type, description, agreed_price, estimated_delivery, status } = req.body;
        // Filter out undefined
        const updates = {};
        if (customer_id) updates.customer_id = customer_id;
        if (furniture_type) updates.furniture_type = furniture_type;
        if (description) updates.description = description;
        if (agreed_price) updates.agreed_price = agreed_price;
        if (estimated_delivery) updates.estimated_delivery = estimated_delivery;
        if (status) updates.status = status;

        const order = await Order.update(req.params.id, updates);
        if (!order) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }
        res.json({ success: true, data: { order } });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

exports.deleteOrder = async (req, res) => {
    try {
        const result = await Order.delete(req.params.id);
        if (!result) {
            return res.status(404).json({ success: false, error: 'Order not found' });
        }
        res.json({ success: true, message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

exports.getOrderStats = async (req, res) => {
    try {
        const result = await require('../utils/db').query(`
            SELECT 
                COUNT(*) FILTER (WHERE status = 'pending') as pending,
                COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress,
                COUNT(*) FILTER (WHERE status = 'completed') as completed,
                COUNT(*) FILTER (WHERE status = 'delivered') as delivered,
                COUNT(*) as total
            FROM orders
        `);

        // Also get low stock materials count (placeholder until Material table is populated/used)
        const lowStockResult = await require('../utils/db').query(`
            SELECT COUNT(*) as count FROM materials WHERE current_stock <= min_stock_alert
        `);

        res.json({
            success: true,
            data: {
                ...result.rows[0],
                low_stock: isNaN(parseInt(lowStockResult.rows[0].count)) ? 0 : parseInt(lowStockResult.rows[0].count)
            }
        });
    } catch (error) {
        console.error('Stats error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};
