import { useState, useEffect } from 'react';
import FormInput from './FormInput';

const MaterialForm = ({ material, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        unit: 'unidades',
        current_stock: '',
        min_stock_alert: '',
        unit_cost: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (material) {
            setFormData({
                name: material.name || '',
                category: material.category || '',
                unit: material.unit || 'unidades',
                current_stock: material.current_stock || '',
                min_stock_alert: material.min_stock_alert || '',
                unit_cost: material.unit_cost || ''
            });
        }
    }, [material]);

    const validate = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Required';
        if (!formData.category) newErrors.category = 'Required';
        if (!formData.unit) newErrors.unit = 'Required';
        // Basic number validation could be added here
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        onSave(formData);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <FormInput
                label="Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                required
            />

            <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Category</label>
                <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                    <option value="">Select Category</option>
                    <option value="madera">Madera</option>
                    <option value="pintura">Pintura</option>
                    <option value="herrajes">Herrajes</option>
                    <option value="otros">Otros</option>
                </select>
                {errors.category && <span style={{ color: '#F44336', fontSize: '0.8rem' }}>{errors.category}</span>}
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Unit</label>
                    <select
                        name="unit"
                        value={formData.unit}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                        <option value="unidades">Unidades</option>
                        <option value="litros">Litros</option>
                        <option value="kg">Kg</option>
                        <option value="metros">Metros</option>
                    </select>
                </div>
                <div style={{ flex: 1 }}>
                    <FormInput
                        label="Unit Cost"
                        name="unit_cost"
                        type="number"
                        step="0.01"
                        value={formData.unit_cost}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                    <FormInput
                        label="Current Stock"
                        name="current_stock"
                        type="number"
                        step="0.01"
                        value={formData.current_stock}
                        onChange={handleChange}
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <FormInput
                        label="Min Stock Alert"
                        name="min_stock_alert"
                        type="number"
                        step="0.01"
                        value={formData.min_stock_alert}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button
                    type="button"
                    onClick={onCancel}
                    style={{ padding: '8px 16px', backgroundColor: '#e0e0e0', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    style={{ padding: '8px 16px', backgroundColor: '#8B4513', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    {material ? 'Update' : 'Add Material'}
                </button>
            </div>
        </form>
    );
};

export default MaterialForm;
