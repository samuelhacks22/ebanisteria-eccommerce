import { useState, useEffect } from 'react';
import api from '../services/api';
import DataTable from '../components/DataTable';
import { Download, TrendingUp, DollarSign, Package } from 'lucide-react';

const Reports = () => {
    const [reportData, setReportData] = useState({
        orders: [],
        summary: { total_orders: 0, total_value: 0, by_status: {} }
    });
    const [inventoryStats, setInventoryStats] = useState({ total_items: 0, total_value: 0, low_stock_items: 0 });
    const [filters, setFilters] = useState({
        start_date: '',
        end_date: '',
        status: ''
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchReports();
        fetchInventoryStats();
    }, []); // Initial load

    const fetchReports = async () => {
        setLoading(true);
        try {
            const params = {};
            if (filters.start_date) params.start_date = filters.start_date;
            if (filters.end_date) params.end_date = filters.end_date;
            if (filters.status) params.status = filters.status;

            const response = await api.get('/reports/orders', { params });
            setReportData(response.data.data);
        } catch (error) {
            console.error('Error loading reports:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchInventoryStats = async () => {
        try {
            const response = await api.get('/reports/inventory');
            setInventoryStats(response.data.data);
        } catch (error) {
            console.error('Error loading inventory stats:', error);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleApplyFilters = (e) => {
        e.preventDefault();
        fetchReports();
    };

    const handleExportCSV = () => {
        const headers = ['Pedido #', 'Cliente', 'Fecha', 'Monto', 'Estado'];
        const rows = reportData.orders.map(o => [
            o.order_number,
            o.customer_name,
            new Date(o.created_at).toLocaleDateString(),
            o.agreed_price,
            o.status
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "orders_report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const columns = [
        { header: 'Fecha', accessor: 'created_at', render: (row) => new Date(row.created_at).toLocaleDateString() },
        { header: 'Pedido #', accessor: 'order_number' },
        { header: 'Cliente', accessor: 'customer_name' },
        { header: 'Tipo', accessor: 'furniture_type' },
        { header: 'Estado', accessor: 'status' },
        { header: 'Monto', accessor: 'agreed_price', render: (row) => `$${row.agreed_price}` }
    ];

    const StatCard = ({ title, value, icon: Icon, color }) => (
        <div style={{
            backgroundColor: 'var(--surface)',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            flex: 1,
            minWidth: '250px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
        }}>
            <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: `${color}15`, color: color }}>
                <Icon size={24} />
            </div>
            <div>
                <p style={{ margin: '0 0 4px 0', fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 500 }}>{title}</p>
                <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{value}</p>
            </div>
        </div>
    );

    return (
        <div style={{ padding: '30px', maxWidth: '1600px', margin: '0 auto', width: '100%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ margin: 0, color: 'var(--text-main)' }}>Reportes</h1>
                <button
                    onClick={handleExportCSV}
                    style={{
                        backgroundColor: 'var(--success)',
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
                    <Download size={18} /> Exportar CSV
                </button>
            </div>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
                <StatCard title="Ingresos Totales" value={`$${reportData.summary.total_value.toFixed(2)}`} icon={DollarSign} color="#10B981" />
                <StatCard title="Total Pedidos" value={reportData.summary.total_orders} icon={TrendingUp} color="#3B82F6" />
                <StatCard title="Valor Inventario" value={`$${(parseFloat(inventoryStats.total_value) || 0).toFixed(2)}`} icon={Package} color="#F59E0B" />
            </div>

            <form onSubmit={handleApplyFilters} style={{
                backgroundColor: 'var(--surface)',
                padding: '24px',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                marginBottom: '30px',
                display: 'flex',
                gap: '20px',
                alignItems: 'flex-end',
                flexWrap: 'wrap',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-light)' }}>Fecha Inicio</label>
                    <input type="date" name="start_date" value={filters.start_date} onChange={handleFilterChange} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', color: 'var(--text-main)', backgroundColor: 'var(--bg-light)' }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-light)' }}>Fecha Fin</label>
                    <input type="date" name="end_date" value={filters.end_date} onChange={handleFilterChange} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', color: 'var(--text-main)', backgroundColor: 'var(--bg-light)' }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '6px', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-light)' }}>Estado</label>
                    <select name="status" value={filters.status} onChange={handleFilterChange} style={{ padding: '10px', borderRadius: '6px', border: '1px solid var(--border)', minWidth: '150px', color: 'var(--text-main)', backgroundColor: 'var(--bg-light)' }}>
                        <option value="">Todos</option>
                        <option value="pending">Pendiente</option>
                        <option value="in_progress">En Progreso</option>
                        <option value="completed">Completado</option>
                        <option value="delivered">Entregado</option>
                    </select>
                </div>
                <button type="submit" style={{ padding: '10px 24px', backgroundColor: 'var(--primary)', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}>Aplicar Filtros</button>
            </form>

            <DataTable
                columns={columns}
                data={reportData.orders}
                isLoading={loading}
            />
        </div>
    );
};

export default Reports;
