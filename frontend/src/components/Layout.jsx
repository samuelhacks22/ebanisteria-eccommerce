import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navigation from './Navigation';

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw', overflow: 'hidden', backgroundColor: 'var(--bg-light)' }}>
            <Sidebar isOpen={isSidebarOpen} />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <Navigation toggleSidebar={toggleSidebar} />
                <main style={{ flex: 1, overflowY: 'auto', padding: '0' }}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default Layout;
