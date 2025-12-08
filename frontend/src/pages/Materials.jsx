import { useState, useEffect, useCallback } from 'react';
import { Plus, AlertTriangle } from 'lucide-react';
import api from '../services/api';
import DataTable from '../components/DataTable';
import Modal from '../components/Modal';
import MaterialForm from '../components/MaterialForm';

const Materials = () => {
    const [materials, setMaterials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [lowStockFilter, setLowStockFilter] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMaterial, setEditingMaterial] = useState(null);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    const fetchMaterials = useCallback(async () => {
        setLoading(true);
        try {
            const params = { page, limit: 10 };
            if (categoryFilter) params.category = categoryFilter;
            if (lowStockFilter) params.low_stock = 'true';

            const response = await api.get('/materials', { params });
            setMaterials(response.data.data.materials);
            const total = response.data.data.total;
            setTotalPages(Math.ceil(total / 10));
        } catch (error) {
            console.error('Error fetching materials:', error);
        } finally {
            setLoading(false);
        }
    }, [page, categoryFilter, lowStockFilter, refreshTrigger]);

    useEffect(() => {
        fetchMaterials();
    }, [fetchMaterials]);

    const handleAdd = () => {
        setEditingMaterial(null);
        setIsModalOpen(true);
    };

    const handleEdit = (material) => {
        setEditingMaterial(material);
        setIsModalOpen(true);
    };

    const handleDelete = async (material) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este material?')) {
            try {
                await api.delete(`/materials/${material.id}`);
                setRefreshTrigger(prev => prev + 1);
            } catch (error) {
                console.error('Error deleting material:', error);
                alert('Failed to delete material');
            }
        }
    };

    const handleSave = async (formData) => {
        try {
            if (editingMaterial) {
                await api.put(`/materials/${editingMaterial.id}`, formData);
            } else {
                await api.post('/materials', formData);
            }
            setIsModalOpen(false);
            setRefreshTrigger(prev => prev + 1);
        } catch (error) {
            console.error('Error saving material:', error);
            alert(error.response?.data?.error || 'Error al guardar material');
        }
    };

    const columns = [
        { header: 'Nombre', accessor: 'name' },
        { header: 'Categoría', accessor: 'category', render: (row) => row.category.charAt(0).toUpperCase() + row.category.slice(1) },
        { header: 'Unidad', accessor: 'unit' },
        {
            header: 'Stock',
            accessor: 'current_stock',
            render: (row) => (
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {parseFloat(row.current_stock) <= parseFloat(row.min_stock_alert) && (
                        <AlertTriangle size={16} color="#F44336" title="Stock Bajo" />
                    )}
                    <span style={{
                        color: parseFloat(row.current_stock) <= parseFloat(row.min_stock_alert) ? '#F44336' : 'inherit',
                        fontWeight: parseFloat(row.current_stock) <= parseFloat(row.min_stock_alert) ? 'bold' : 'normal'
                    }}>
                        {row.current_stock}
                    </span>
                </div>
            )
        },
        { header: 'Costo Unitario', accessor: 'unit_cost', render: (row) => row.unit_cost ? `$${row.unit_cost}` : '-' }
    ];

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1 style={{ margin: 0, color: '#333' }}>Inventario de Materiales</h1>
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
                    <Plus size={20} /> Agregar Material
                </button>
            </div>

            <div style={{ marginBottom: '20px', display: 'flex', gap: '15px' }}>
                <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                    <option value="">Todas las Categorías</option>
                    <option value="madera">Madera</option>
                    <option value="pintura">Pintura</option>
                    <option value="herrajes">Herrajes</option>
                    <option value="otros">Otros</option>
                </select>

                <label style={{ display: 'flex', alignItems: 'center', gap: '5px', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        checked={lowStockFilter}
                        onChange={(e) => setLowStockFilter(e.target.checked)}
                    />
                    Ver solo stock bajo
                </label>
            </div>

            <DataTable
                columns={columns}
                data={materials}
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
                title={editingMaterial ? "Editar Material" : "Agregar Material"}
            >
                <MaterialForm
                    material={editingMaterial}
                    onSave={handleSave}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
};

export default Materials;
