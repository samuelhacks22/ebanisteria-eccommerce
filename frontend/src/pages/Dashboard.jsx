import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Clock, CheckCircle, AlertTriangle, Package } from 'lucide-react';

const Dashboard = () => {
    const { user } = useAuth();
    const [dashboardData, setDashboardData] = useState({
        stats: { pending: 0, in_progress: 0, completed: 0, delivered: 0, low_stock: 0 },
        recent_orders: [],
        upcoming_deliveries: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get('/reports/dashboard');
                setDashboardData(response.data.data);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    const StatCard = ({ title, value, icon: Icon, color }) => (
        <div style={{
            backgroundColor: 'var(--surface)',
            padding: '24px',
            borderRadius: '12px',
            border: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
        }}>
            <div style={{ padding: '12px', borderRadius: '10px', backgroundColor: `${color}15`, color: color }}>
                <Icon size={28} />
            </div>
            <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '0.85rem', color: 'var(--text-light)', fontWeight: 500 }}>{title}</h3>
                <p style={{ margin: 0, fontSize: '1.75rem', fontWeight: '700', color: 'var(--text-main)' }}>{value}</p>
            </div>
        </div>
    );

    const SectionHeader = ({ title }) => (
        <h2 style={{
            fontSize: '1.25rem',
            margin: '0 0 0',
            color: 'var(--text-main)',
            fontWeight: 700
        }}>{title}</h2>
    );

    return (
        <div style={{
            padding: window.innerWidth < 768 ? '15px' : '30px',
            maxWidth: '1600px',
            margin: '0 auto',
            width: '100%'
        }}>
            <div style={{ marginBottom: window.innerWidth < 768 ? '20px' : '30px' }}>
                <h1 style={{ marginBottom: '8px', color: 'var(--text-main)' }}>Panel Principal</h1>
                <p style={{ color: 'var(--text-light)', marginTop: 0 }}>¡Bienvenido de nuevo, <strong style={{ color: 'var(--primary)' }}>{user?.full_name}</strong>!</p>
            </div>

            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: window.innerWidth < 768 ? '12px' : '20px'
            }}>
                <StatCard title="Pedidos Pendientes" value={dashboardData.stats.pending} icon={Clock} color="#FF9800" />
                <StatCard title="En Progreso" value={dashboardData.stats.in_progress} icon={Package} color="#2196F3" />
                <StatCard title="Completados" value={dashboardData.stats.completed} icon={CheckCircle} color="#4CAF50" />
                <StatCard title="Stock Bajo" value={dashboardData.stats.low_stock} icon={AlertTriangle} color="#F44336" />
            </div>

            {/* Main Content Info */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(auto-fit, minmax(400px, 1fr))',
                gap: window.innerWidth < 768 ? '20px' : '30px',
                marginTop: '20px'
            }}>

                {/* Recent Orders */}
                <div>
                    <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <SectionHeader title="Pedidos Recientes" />
                        <a href="/orders" style={{ fontSize: '0.85rem', fontWeight: 600 }}>Ver Todos &rarr;</a>
                    </div>
                    <div style={{ backgroundColor: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        {dashboardData.recent_orders.length > 0 ? (
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '500px' }}>
                                    <thead style={{ backgroundColor: 'var(--bg-light)', borderBottom: '1px solid var(--border)' }}>
                                        <tr>
                                            <th style={{ padding: window.innerWidth < 768 ? '8px' : '12px', textAlign: 'left', fontSize: '0.9rem', color: '#666' }}>Pedido #</th>
                                            <th style={{ padding: window.innerWidth < 768 ? '8px' : '12px', textAlign: 'left', fontSize: '0.9rem', color: '#666' }}>Cliente</th>
                                            <th style={{ padding: window.innerWidth < 768 ? '8px' : '12px', textAlign: 'left', fontSize: '0.9rem', color: '#666' }}>Estado</th>
                                            <th style={{ padding: window.innerWidth < 768 ? '8px' : '12px', textAlign: 'right', fontSize: '0.9rem', color: '#666' }}>Monto</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {dashboardData.recent_orders.map((order, i) => (
                                            <tr key={order.id} style={{ borderBottom: i < dashboardData.recent_orders.length - 1 ? '1px solid var(--border)' : 'none' }}>
                                                <td style={{ padding: window.innerWidth < 768 ? '8px' : '12px', fontWeight: '500' }}>#{order.order_number}</td>
                                                <td style={{ padding: window.innerWidth < 768 ? '8px' : '12px' }}>{order.customer_name}</td>
                                                <td style={{ padding: window.innerWidth < 768 ? '8px' : '12px' }}>
                                                    <span style={{
                                                        padding: '4px 8px',
                                                        borderRadius: '12px',
                                                        fontSize: '0.8rem',
                                                        backgroundColor:
                                                            order.status === 'completed' ? '#E8F5E8' :
                                                                order.status === 'in_progress' ? '#E3F2FD' :
                                                                    order.status === 'delivered' ? '#F3E5F5' : '#FFF3E0',
                                                        color:
                                                            order.status === 'completed' ? '#2E7D32' :
                                                                order.status === 'in_progress' ? '#1565C0' :
                                                                    order.status === 'delivered' ? '#7B1FA2' : '#E65100'
                                                    }}>
                                                        {order.status === 'pending' ? 'Pendiente' :
                                                            order.status === 'in_progress' ? 'En Progreso' :
                                                                order.status === 'completed' ? 'Completado' : 'Entregado'}
                                                    </span>
                                                </td>
                                                <td style={{ padding: window.innerWidth < 768 ? '8px' : '12px', textAlign: 'right' }}>${order.agreed_price}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <p style={{ padding: '20px', textAlign: 'center', color: '#999', margin: 0 }}>No hay pedidos recientes</p>
                        )}
                    </div>
                </div>

                {/* Upcoming Deliveries */}
                <div>
                    <div style={{ marginBottom: '16px' }}>
                        <SectionHeader title="Próximas Entregas (7 Días)" />
                    </div>
                    <div style={{ backgroundColor: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                        {dashboardData.upcoming_deliveries.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                {dashboardData.upcoming_deliveries.map((delivery, i) => (
                                    <div key={delivery.id} style={{
                                        padding: window.innerWidth < 768 ? '12px' : '16px',
                                        borderBottom: i < dashboardData.upcoming_deliveries.length - 1 ? '1px solid var(--border)' : 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '20px'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            alignItems: 'center',
                                            backgroundColor: '#FFF3E0',
                                            padding: '8px 12px',
                                            borderRadius: '6px',
                                            color: '#E65100',
                                            minWidth: '60px'
                                        }}>
                                            <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>
                                                {new Date(delivery.estimated_delivery).toLocaleString('default', { month: 'short' }).toUpperCase()}
                                            </span>
                                            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                                                {new Date(delivery.estimated_delivery).getDate()}
                                            </span>
                                        </div>
                                        <div>
                                            <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', color: '#333' }}>#{delivery.order_number} - {delivery.customer_name}</p>
                                            <p style={{ margin: 0, fontSize: '0.9rem', color: '#666' }}>Estado: {delivery.status === 'pending' ? 'Pendiente' :
                                                delivery.status === 'in_progress' ? 'En Progreso' :
                                                    delivery.status === 'completed' ? 'Completado' : 'Entregado'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p style={{ padding: '20px', textAlign: 'center', color: '#999', margin: 0 }}>No hay entregas próximas</p>
                        )}
                    </div>
                </div>

            </div>

            <div style={{ marginTop: window.innerWidth < 768 ? '30px' : '40px' }}>
                <h2 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>Acciones Rápidas</h2>
                <div style={{
                    display: 'flex',
                    flexDirection: window.innerWidth < 768 ? 'column' : 'row',
                    gap: '15px'
                }}>
                    <a href="/customers" style={{
                        textDecoration: 'none',
                        backgroundColor: 'var(--primary)',
                        color: 'white',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        fontWeight: 500,
                        boxShadow: '0 4px 6px rgba(139, 69, 19, 0.2)',
                        textAlign: 'center'
                    }}>Gestionar Clientes</a>
                    <a href="/orders" style={{
                        textDecoration: 'none',
                        backgroundColor: 'var(--secondary)',
                        color: 'white',
                        padding: '12px 24px',
                        borderRadius: '8px',
                        fontWeight: 500,
                        boxShadow: '0 4px 6px rgba(210, 105, 30, 0.2)',
                        textAlign: 'center'
                    }}>Crear Pedido</a>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
