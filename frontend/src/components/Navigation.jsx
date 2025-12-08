import { LogOut, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navigation = ({ toggleSidebar }) => {
    const { user, logout } = useAuth();

    return (
        <header style={{
            height: '64px',
            backgroundColor: 'var(--surface)',
            borderBottom: '1px solid var(--border)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 24px',
            justifyContent: 'space-between',
            boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
        }}>
            <button
                onClick={toggleSidebar}
                style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--text-main)',
                    display: 'flex',
                    padding: '8px',
                    borderRadius: '8px',
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--bg-light)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
                <Menu size={24} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{ textAlign: 'right', display: 'none', md: 'block' }}>
                    <span style={{ display: 'block', fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-main)' }}>
                        {user?.full_name}
                    </span>
                    <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-light)', textTransform: 'capitalize' }}>
                        {user?.role === 'admin' ? 'Administrador' : 'Empleado'}
                    </span>
                </div>
                <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border)' }}></div>
                <button
                    onClick={logout}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        background: 'white',
                        border: '1px solid var(--border)',
                        color: 'var(--danger)',
                        cursor: 'pointer',
                        padding: '8px 12px',
                        fontSize: '0.85rem',
                        fontWeight: '600',
                        borderRadius: '6px',
                        transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#FEF2F2'; e.currentTarget.style.borderColor = '#FECACA'; }}
                    onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.borderColor = 'var(--border)'; }}
                >
                    <LogOut size={16} /> Cerrar Sesión
                </button>
            </div>
        </header>
    );
};

export default Navigation;
