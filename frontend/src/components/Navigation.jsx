import { LogOut, Menu } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navigation = ({ toggleSidebar }) => {
    const { user, logout } = useAuth();

    return (
        <header style={{ height: '60px', backgroundColor: 'white', borderBottom: '1px solid #ddd', display: 'flex', alignItems: 'center', padding: '0 20px', justifyContent: 'space-between' }}>
            <button onClick={toggleSidebar} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <Menu size={24} />
            </button>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                <span>{user?.full_name} ({user?.role})</span>
                <button
                    onClick={logout}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        background: 'none',
                        border: 'none',
                        color: '#F44336',
                        cursor: 'pointer'
                    }}
                >
                    <LogOut size={18} /> Logout
                </button>
            </div>
        </header>
    );
};

export default Navigation;
