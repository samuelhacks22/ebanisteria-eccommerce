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
        <div className="flex h-screen w-full overflow-hidden bg-body">
            <Sidebar isOpen={isSidebarOpen} />
            <div className="flex flex-col flex-1 overflow-hidden relative">
                <Navigation toggleSidebar={toggleSidebar} />
                <main className="flex-1 overflow-y-auto p-6 transition-all">
                    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Layout;
