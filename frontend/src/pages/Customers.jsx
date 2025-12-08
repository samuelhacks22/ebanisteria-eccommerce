import { useState, useEffect, useCallback } from 'react';
import { Plus, Search } from 'lucide-react';
import api from '../services/api';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import CustomerForm from '../components/CustomerForm';

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const fetchCustomers = useCallback(async () => {
        setLoading(true);
        try {
            const response = await api.get('/customers', {
                params: { search, page, limit: 10 }
            });
            setCustomers(response.data.data.customers);
            const total = response.data.data.total;
            setTotalPages(Math.ceil(total / 10)); // Assuming limit 10
        } catch (error) {
            console.error('Error fetching customers:', error);
        } finally {
            setLoading(false);
        }
    }, [search, page, refreshTrigger]);

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchCustomers();
        }, 300); // Debounce search
        return () => clearTimeout(timer);
    }, [fetchCustomers]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(1); // Reset to page 1 on search
    };

    const handleAdd = () => {
        setEditingCustomer(null);
        setIsModalOpen(true);
    };

    const handleEdit = (customer) => {
        setEditingCustomer(customer);
        setIsModalOpen(true);
    };

    const handleDelete = async (customer) => {
        if (window.confirm('Are you sure you want to delete this customer?')) {
            try {
                await api.delete(`/customers/${customer.id}`);
                setRefreshTrigger(prev => prev + 1);
            } catch (error) {
                console.error('Error deleting customer:', error);
                alert('Failed to delete customer');
            }
        }
    };

    const handleSave = async (formData) => {
        try {
            if (editingCustomer) {
                await api.put(`/customers/${editingCustomer.id}`, formData);
            } else {
                await api.post('/customers', formData);
            }
            setIsModalOpen(false);
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            console.error('Error saving customer:', error);
            alert(error.response?.data?.error || 'Failed to save customer');
        }
    };

    const columns = [
        { header: 'Identity Doc', accessor: 'identity_document' },
        { header: 'Full Name', accessor: 'full_name' },
        { header: 'Phone', accessor: 'phone' },
        { header: 'Email', accessor: 'email' },
        { header: 'Address', accessor: 'address', render: (row) => row.address ? row.address.substring(0, 30) + '...' : '' }
    ];

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1 style={{ margin: 0, color: '#333' }}>Customers</h1>
                <button
                    onClick={handleAdd}
                    style={{
                        backgroundColor: '#8B4513',
                        color: 'white',
                        padding: '10px 16px',
                        borderRadius: '4px',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer'
                    }}
                >
                    <Plus size={20} /> Add Customer
                </button>
            </div>

            <div style={{ marginBottom: '20px', position: 'relative', maxWidth: '400px' }}>
                <input
                    type="text"
                    placeholder="Search customers..."
                    value={search}
                    onChange={handleSearchChange}
                    style={{
                        width: '100%',
                        padding: '10px 10px 10px 35px',
                        borderRadius: '4px',
                        border: '1px solid #ccc',
                        boxSizing: 'border-box'
                    }}
                />
                <Search size={18} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: '#888' }} />
            </div>

            <DataTable
                columns={columns}
                data={customers}
                isLoading={loading}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    style={{ padding: '5px 10px', cursor: 'pointer', disabled: page === 1 }}
                >
                    Previous
                </button>
                <span style={{ padding: '5px' }}>Page {page} of {totalPages || 1}</span>
                <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(p => p + 1)}
                    style={{ padding: '5px 10px', cursor: 'pointer', disabled: page >= totalPages }}
                >
                    Next
                </button>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingCustomer ? "Edit Customer" : "Add Customer"}
            >
                <CustomerForm
                    customer={editingCustomer}
                    onSave={handleSave}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default Customers;
