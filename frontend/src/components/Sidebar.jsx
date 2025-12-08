import { Link, useLocation } from 'react-router-dom';
import { Home, Users, ShoppingCart, Hammer, FileText } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = ({ isOpen }) => {
    const location = useLocation();
    const { user } = useAuth();

    if (!isOpen) return null; // Or simpler implementation for mobile

    const menuItems = [
        { path: '/', label: 'Panel Principal', icon: <Home size={20} /> },
        { path: '/customers', label: 'Clientes', icon: <Users size={20} /> },
        { path: '/orders', label: 'Pedidos', icon: <ShoppingCart size={20} /> },
        { path: '/materials', label: 'Materiales', icon: <Hammer size={20} /> },
        { path: '/reports', label: 'Reportes', icon: <FileText size={20} /> },
    ];

    return (
        <div style={{ width: '250px', backgroundColor: '#333', color: 'white', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '20px', fontSize: '1.2rem', fontWeight: 'bold', borderBottom: '1px solid #444' }}>
                Carpentry Shop
            </div>
            <nav style={{ flex: 1, padding: '10px 0' }}>
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            padding: '12px 20px',
                            color: location.pathname === item.path ? '#fff' : '#aaa',
                            backgroundColor: location.pathname === item.path ? '#8B4513' : 'transparent',
                            textDecoration: 'none',
                            transition: 'color 0.2s'
                        }}
                    >
                        <span style={{ marginRight: '10px' }}>{item.icon}</span>
                        {item.label}
                    </Link>
                ))}
            </nav>
            {user?.role === 'admin' && (
                <div style={{ padding: '20px', borderTop: '1px solid #444', fontSize: '0.9rem', color: '#aaa' }}>
                    Admin Panel
                </div>
            )}
        </div>
    );
};

export default Sidebar;
