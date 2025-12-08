import { useState, useEffect } from 'react';
import FormInput from './FormInput';
import api from '../services/api';

const OrderForm = ({ order, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        customer_id: '',
        furniture_type: '',
        description: '',
        agreed_price: '',
        estimated_delivery: '',
        status: 'pending'
    });
    const [customers, setCustomers] = useState([]);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                // Fetch all customers (limited to latest 50 for now or implement search dropdown later)
                const response = await api.get('/customers?limit=100');
                setCustomers(response.data.data.customers);
            } catch (error) {
                console.error('Failed to load customers', error);
            }
        };
        fetchCustomers();
    }, []);

    useEffect(() => {
        if (order) {
            setFormData({
                customer_id: order.customer_id || '',
                furniture_type: order.furniture_type || '',
                description: order.description || '',
                agreed_price: order.agreed_price || '',
                estimated_delivery: order.estimated_delivery ? order.estimated_delivery.split('T')[0] : '',
                status: order.status || 'pending'
            });
        }
    }, [order]);

    const validate = () => {
        const newErrors = {};
        if (!formData.customer_id) newErrors.customer_id = 'Cliente es requerido';
        if (!formData.furniture_type) newErrors.furniture_type = 'Requerido';
        if (!formData.description) newErrors.description = 'Requerido';
        if (!formData.agreed_price) newErrors.agreed_price = 'Requerido';
        if (order && !formData.status) newErrors.status = 'Required';
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
            <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Cliente</label>
                <select
                    name="customer_id"
                    value={formData.customer_id}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    disabled={!!order} // Prevent changing customer on edit for simplicity
                >
                    <option value="">Seleccionar Cliente</option>
                    {customers.map(c => (
                        <option key={c.id} value={c.id}>{c.full_name} ({c.identity_document})</option>
                    ))}
                </select>
                {errors.customer_id && <span style={{ color: '#F44336', fontSize: '0.8rem' }}>{errors.customer_id}</span>}
            </div>

            <FormInput
                label="Tipo de Mueble"
                name="furniture_type"
                value={formData.furniture_type}
                onChange={handleChange}
                error={errors.furniture_type}
                required
            />

            <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Descripción</label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc', fontFamily: 'inherit' }}
                />
                {errors.description && <span style={{ color: '#F44336', fontSize: '0.8rem' }}>{errors.description}</span>}
            </div>

            <div style={{ display: 'flex', gap: '20px' }}>
                <div style={{ flex: 1 }}>
                    <FormInput
                        label="Precio Acordado"
                        name="agreed_price"
                        type="number"
                        value={formData.agreed_price}
                        onChange={handleChange}
                        error={errors.agreed_price}
                        required
                    />
                </div>
                <div style={{ flex: 1 }}>
                    <FormInput
                        label="Fecha Estimada de Entrega"
                        name="estimated_delivery"
                        type="date"
                        value={formData.estimated_delivery}
                        onChange={handleChange}
                    />
                </div>
            </div>

            {order && (
                <div style={{ marginBottom: '16px' }}>
                    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>Estado</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleChange}
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                    >
                        <option value="pending">Pendiente</option>
                        <option value="in_progress">En Progreso</option>
                        <option value="completed">Completado</option>
                        <option value="delivered">Entregado</option>
                    </select>
                </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button
                    type="button"
                    onClick={onCancel}
                    style={{ padding: '8px 16px', backgroundColor: '#e0e0e0', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    style={{ padding: '8px 16px', backgroundColor: '#8B4513', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    {order ? 'Actualizar Pedido' : 'Crear Pedido'}
                </button>
            </div>
        </form>
    );
};

export default OrderForm;
