const Material = require('../models/Material');

exports.getAllMaterials = async (req, res) => {
    try {
        const { category, low_stock, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const result = await Material.findAll({ category, low_stock, limit, offset });

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Get materials error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

exports.createMaterial = async (req, res) => {
    try {
        const { name, category, unit, current_stock, min_stock_alert, unit_cost } = req.body;

        // Validation
        if (!name || !category || !unit) {
            return res.status(400).json({ success: false, error: 'Name, category and unit are required' });
        }

        const material = await Material.create({
            name,
            category,
            unit,
            current_stock: current_stock || 0,
            min_stock_alert: min_stock_alert || 0,
            unit_cost
        });

        res.status(201).json({
            success: true,
            data: { material }
        });
    } catch (error) {
        console.error('Create material error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

exports.getMaterialById = async (req, res) => {
    try {
        const material = await Material.findById(req.params.id);
        if (!material) {
            return res.status(404).json({ success: false, error: 'Material not found' });
        }
        res.json({ success: true, data: { material } });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

exports.updateMaterial = async (req, res) => {
    try {
        const { name, category, unit, current_stock, min_stock_alert, unit_cost } = req.body;
        const updates = {};
        if (name) updates.name = name;
        if (category) updates.category = category;
        if (unit) updates.unit = unit;
        if (current_stock !== undefined) updates.current_stock = current_stock;
        if (min_stock_alert !== undefined) updates.min_stock_alert = min_stock_alert;
        if (unit_cost !== undefined) updates.unit_cost = unit_cost;

        const material = await Material.update(req.params.id, updates);
        if (!material) {
            return res.status(404).json({ success: false, error: 'Material not found' });
        }
        res.json({ success: true, data: { material } });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

exports.deleteMaterial = async (req, res) => {
    try {
        const result = await Material.delete(req.params.id);
        if (!result) {
            return res.status(404).json({ success: false, error: 'Material not found' });
        }
        res.json({ success: true, message: 'Material deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

exports.getLowStockMaterials = async (req, res) => {
    try {
        // Re-using findAll with low_stock=true
        const result = await Material.findAll({ low_stock: 'true', limit: 100 });
        res.json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};
