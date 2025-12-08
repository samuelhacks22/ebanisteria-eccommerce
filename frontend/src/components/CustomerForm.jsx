import { useState, useEffect } from 'react';
import FormInput from './FormInput';

const CustomerForm = ({ customer, onSave, onCancel }) => {
    const [formData, setFormData] = useState({
        identity_document: '',
        full_name: '',
        phone: '',
        email: '',
        address: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (customer) {
            setFormData({
                identity_document: customer.identity_document || '',
                full_name: customer.full_name || '',
                phone: customer.phone || '',
                email: customer.email || '',
                address: customer.address || ''
            });
        }
    }, [customer]);

    const validate = () => {
        const newErrors = {};
        if (!formData.identity_document) newErrors.identity_document = 'Requerido';
        if (!formData.full_name) newErrors.full_name = 'Requerido';
        if (!formData.phone) newErrors.phone = 'Requerido';
        // Add more regex validation if needed
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
                label="Documento de Identidad"
                name="identity_document"
                value={formData.identity_document}
                onChange={handleChange}
                error={errors.identity_document}
                required
            />
            <FormInput
                label="Nombre Completo"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                error={errors.full_name}
                required
            />
            <FormInput
                label="Teléfono"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                required
            />
            <FormInput
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
            />
            <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.9rem', fontWeight: 600, color: '#333' }}>Dirección</label>
                <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="3"
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box', fontFamily: 'inherit' }}
                />
            </div>

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
                    {customer ? 'Actualizar' : 'Crear'}
                </button>
            </div>
        </form>
    );
};

export default CustomerForm;
