import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Clock, CheckCircle, AlertTriangle, Package } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        pending: 0,
        in_progress: 0,
        completed: 0,
        low_stock: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/orders/stats');
                setStats(response.data.data);
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const StatCard = ({ title, value, icon: Icon, color }) => (
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #ddd', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{ padding: '12px', borderRadius: '50%', backgroundColor: `${color}20`, color: color }}>
                <Icon size={24} />
            </div>
            <div>
                <h3 style={{ margin: '0 0 5px 0', fontSize: '0.9rem', color: '#666' }}>{title}</h3>
                <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>{value}</p>
            </div>
        </div>
    );

    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{ marginBottom: '20px', color: '#333' }}>Dashboard</h1>
            <p style={{ marginBottom: '30px', color: '#666' }}>Welcome back, <strong>{user?.full_name}</strong>!</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                <StatCard
                    title="Pending Orders"
                    value={stats.pending}
                    icon={Clock}
                    color="#FF9800"
                />
                <StatCard
                    title="In Progress"
                    value={stats.in_progress}
                    icon={Package}
                    color="#2196F3"
                />
                <StatCard
                    title="Completed"
                    value={stats.completed}
                    icon={CheckCircle}
                    color="#4CAF50"
                />
                <StatCard
                    title="Low Stock Materials"
                    value={stats.low_stock}
                    icon={AlertTriangle}
                    color="#F44336"
                />
            </div>

            <div style={{ marginTop: '40px' }}>
                <h2 style={{ fontSize: '1.2rem', marginBottom: '15px' }}>Quick Actions</h2>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <a href="/customers" style={{ textDecoration: 'none', backgroundColor: '#8B4513', color: 'white', padding: '10px 20px', borderRadius: '4px' }}>Manage Customers</a>
                    <a href="/orders" style={{ textDecoration: 'none', backgroundColor: '#D2691E', color: 'white', padding: '10px 20px', borderRadius: '4px' }}>Create Order</a>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
