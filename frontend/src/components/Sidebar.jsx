import { Link, useLocation } from 'react-router-dom';
import { Home, Users, ClipboardList, Hammer, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen }) => {
    const location = useLocation();
    const { user } = useAuth();

    if (!isOpen) return null; // Or simpler implementation for mobile

    const menuItems = [
        { path: '/', label: 'Panel Principal', icon: <Home size={22} /> },
        { path: '/customers', label: 'Clientes', icon: <Users size={22} /> },
        { path: '/orders', label: 'Pedidos', icon: <ClipboardList size={22} /> },
        { path: '/materials', label: 'Materiales', icon: <Hammer size={22} /> },
        { path: '/reports', label: 'Reportes', icon: <FileText size={22} /> },
    ];

    return (
        <div style={{
            width: isOpen ? '260px' : '0',
            backgroundColor: 'var(--bg-dark)',
            color: 'var(--text-white)',
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            transition: 'width 0.3s ease',
            overflow: 'hidden',
            flexShrink: 0,
            boxShadow: '4px 0 10px rgba(0,0,0,0.1)'
        }}>
            <div style={{
                padding: '24px 20px',
                backgroundColor: 'var(--bg-darker)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                borderBottom: '1px solid rgba(255,255,255,0.05)'
            }}>
                <div style={{
                    width: '32px', height: '32px',
                    backgroundColor: 'var(--primary)',
                    borderRadius: '6px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <Hammer size={18} color="white" />
                </div>
                <div>
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0, lineHeight: 1 }}>Ebanistería Madera</h2>
                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>Gestión Pro</span>
                </div>
            </div>

            <nav style={{ flex: 1, padding: '20px 0', overflowY: 'auto' }}>
                <p style={{
                    padding: '0 20px 10px',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    color: 'rgba(255,255,255,0.4)',
                    fontWeight: '600'
                }}>Menú</p>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '12px 20px',
                                color: isActive ? 'white' : 'rgba(255,255,255,0.7)',
                                backgroundColor: isActive ? 'var(--primary)' : 'transparent',
                                textDecoration: 'none',
                                borderLeft: isActive ? '4px solid white' : '4px solid transparent',
                                transition: 'all 0.2s',
                                marginBottom: '2px'
                            }}
                        >
                            <span style={{ marginRight: '12px', opacity: isActive ? 1 : 0.8 }}>{item.icon}</span>
                            <span style={{ fontWeight: isActive ? 500 : 400 }}>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            {user?.role === 'admin' && (
                <div style={{
                    padding: '20px',
                    backgroundColor: 'rgba(0,0,0,0.2)',
                    fontSize: '0.85rem',
                    color: 'rgba(255,255,255,0.6)',
                    textAlign: 'center'
                }}>
                    Panel de Administrador
                </div>
            )}
        </div>
    );
};

export default Sidebar;
