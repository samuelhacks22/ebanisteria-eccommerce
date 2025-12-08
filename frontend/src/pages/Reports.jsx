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
        const headers = ['Order #', 'Customer', 'Date', 'Amount', 'Status'];
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
        { header: 'Date', accessor: 'created_at', render: (row) => new Date(row.created_at).toLocaleDateString() },
        { header: 'Order #', accessor: 'order_number' },
        { header: 'Customer', accessor: 'customer_name' },
        { header: 'Type', accessor: 'furniture_type' },
        { header: 'Status', accessor: 'status' },
        { header: 'Amount', accessor: 'agreed_price', render: (row) => `$${row.agreed_price}` }
    ];

    const StatCard = ({ title, value, icon: Icon, color }) => (
        <div style={{ backgroundColor: 'white', padding: '15px', borderRadius: '8px', border: '1px solid #ddd', display: 'flex', alignItems: 'center', gap: '15px', flex: 1 }}>
            <div style={{ padding: '10px', borderRadius: '50%', backgroundColor: `${color}20`, color: color }}>
                <Icon size={20} />
            </div>
            <div>
                <p style={{ margin: '0 0 5px 0', fontSize: '0.8rem', color: '#666' }}>{title}</p>
                <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold' }}>{value}</p>
            </div>
        </div>
    );

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h1 style={{ margin: 0, color: '#333' }}>Reports</h1>
                <button
                    onClick={handleExportCSV}
                    style={{
                        backgroundColor: '#4CAF50',
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
                    <Download size={18} /> Export CSV
                </button>
            </div>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '30px', flexWrap: 'wrap' }}>
                <StatCard title="Total Orders Revenue" value={`$${reportData.summary.total_value.toFixed(2)}`} icon={DollarSign} color="#4CAF50" />
                <StatCard title="Total Orders Count" value={reportData.summary.total_orders} icon={TrendingUp} color="#2196F3" />
                <StatCard title="Inventory Value" value={`$${(parseFloat(inventoryStats.total_value) || 0).toFixed(2)}`} icon={Package} color="#FF9800" />
            </div>

            <form onSubmit={handleApplyFilters} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', marginBottom: '20px', display: 'flex', gap: '15px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: 600 }}>Start Date</label>
                    <input type="date" name="start_date" value={filters.start_date} onChange={handleFilterChange} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: 600 }}>End Date</label>
                    <input type="date" name="end_date" value={filters.end_date} onChange={handleFilterChange} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} />
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem', fontWeight: 600 }}>Status</label>
                    <select name="status" value={filters.status} onChange={handleFilterChange} style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc', minWidth: '150px' }}>
                        <option value="">All Statuses</option>
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="delivered">Delivered</option>
                    </select>
                </div>
                <button type="submit" style={{ padding: '9px 20px', backgroundColor: '#8B4513', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Apply Filter</button>
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
