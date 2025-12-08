const Customer = require('../models/Customer');

exports.getAllCustomers = async (req, res) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;
        const offset = (page - 1) * limit;

        const result = await Customer.findAll({ search, limit, offset });

        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error('Get customers error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

exports.createCustomer = async (req, res) => {
    try {
        const { identity_document, full_name, phone, email, address } = req.body;

        // Validation
        if (!identity_document || !full_name || !phone) {
            return res.status(400).json({ success: false, error: 'Identity document, name and phone are required' });
        }

        const customer = await Customer.create({ identity_document, full_name, phone, email, address });

        res.status(201).json({
            success: true,
            data: { customer }
        });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ success: false, error: 'Identity document already exists' });
        }
        console.error('Create customer error:', error);
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

exports.getCustomerById = async (req, res) => {
    try {
        const customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).json({ success: false, error: 'Customer not found' });
        }
        res.json({ success: true, data: { customer } });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

exports.updateCustomer = async (req, res) => {
    try {
        const customer = await Customer.update(req.params.id, req.body);
        if (!customer) {
            return res.status(404).json({ success: false, error: 'Customer not found' });
        }
        res.json({ success: true, data: { customer } });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ success: false, error: 'Identity document already exists' });
        }
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

exports.deleteCustomer = async (req, res) => {
    try {
        const result = await Customer.delete(req.params.id);
        if (!result) {
            return res.status(404).json({ success: false, error: 'Customer not found' });
        }
        res.json({ success: true, message: 'Customer deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};
