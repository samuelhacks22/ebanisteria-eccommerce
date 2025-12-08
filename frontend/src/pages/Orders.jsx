import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import api from '../services/api';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import OrderForm from '../components/OrderForm';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingOrder, setEditingOrder] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page, limit: 10 };
            if (statusFilter) params.status = statusFilter;

            const response = await api.get('/orders', { params });
            setOrders(response.data.data.orders);
            const total = response.data.data.total;
            setTotalPages(Math.ceil(total / 10));
        } catch (error) {
            console.error('Error fetching orders:', error);
        } finally {
            setLoading(false);
        }
    }, [page, statusFilter, refreshTrigger]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleAdd = () => {
        setEditingOrder(null);
        setIsModalOpen(true);
    };

    const handleEdit = (order) => {
        setEditingOrder(order);
        setIsModalOpen(true);
    };

    const handleDelete = async (order) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este pedido?')) {
            try {
                await api.delete(`/orders/${order.id}`);
                setRefreshTrigger(prev => prev + 1);
            } catch (error) {
                console.error('Error deleting order:', error);
                alert('Failed to delete order');
            }
        }
    };

    const handleSave = async (formData) => {
        try {
            if (editingOrder) {
                await api.put(`/orders/${editingOrder.id}`, formData);
            } else {
                await api.post('/orders', formData);
            }
            setIsModalOpen(false);
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            console.error('Error saving order:', error);
            alert(error.response?.data?.error || 'Error al guardar pedido');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return '#FF9800';
            case 'in_progress': return '#2196F3';
            case 'completed': return '#4CAF50';
            case 'delivered': return '#9C27B0';
            default: return '#999';
        }
    };

    const columns = [
        { header: 'Pedido #', accessor: 'order_number' },
        { header: 'Cliente', accessor: 'customer_name' },
        { header: 'Tipo', accessor: 'furniture_type' },
        { header: 'Precio', accessor: 'agreed_price', render: (row) => `$${row.agreed_price}` },
        {
            header: 'Estado',
            accessor: 'status',
            render: (row) => (
                <span style={{
                    backgroundColor: getStatusColor(row.status),
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    textTransform: 'capitalize'
                }}>
                    {row.status === 'pending' ? 'Pendiente' :
                        row.status === 'in_progress' ? 'En Progreso' :
                            row.status === 'completed' ? 'Completado' : 'Entregado'}
                </span>
            )
        },
        {
            header: 'Entrega',
            accessor: 'estimated_delivery',
            render: (row) => row.estimated_delivery ? new Date(row.estimated_delivery).toLocaleDateString() : '-'
        }
    ];

    return (
        <div style={{ padding: '30px', maxWidth: '1600px', margin: '0 auto', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ margin: 0, color: 'var(--text-main)' }}>Pedidos</h1>
                <button
                    onClick={handleAdd}
                    style={{
                        backgroundColor: 'var(--secondary)',
                        color: 'white',
                        padding: '10px 16px',
                        borderRadius: '6px',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        cursor: 'pointer',
                        fontWeight: 500,
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                >
                    <Plus size={20} /> Crear Pedido
                </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    style={{
                        padding: '10px 16px',
                        borderRadius: '8px',
                        border: '1px solid var(--border)',
                        backgroundColor: 'var(--surface)',
                        color: 'var(--text-main)',
                        fontSize: '0.95rem'
                    }}
                >
                    <option value="">Todos los Estados</option>
                    <option value="pending">Pendiente</option>
                    <option value="in_progress">En Progreso</option>
                    <option value="completed">Completado</option>
                    <option value="delivered">Entregado</option>
                </select>
            </div>

            <DataTable
                columns={columns}
                data={orders}
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
                    Anterior
                </button>
                <span style={{ padding: '5px' }}>Página {page} de {totalPages || 1}</span>
                <button
                    disabled={page >= totalPages}
                    onClick={() => setPage(p => p + 1)}
                    style={{ padding: '5px 10px', cursor: 'pointer', disabled: page >= totalPages }}
                >
                    Siguiente
                </button>
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingOrder ? "Editar Pedido" : "Crear Pedido"}
            >
                <OrderForm
                    order={editingOrder}
                    onSave={handleSave}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default Orders;
