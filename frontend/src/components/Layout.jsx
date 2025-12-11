import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navigation from './Navigation';

const Layout = () => {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);

    // Detect mobile screen size and update
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            const wasMobile = isMobile;

            setIsMobile(mobile);

            // Auto-close sidebar when switching to mobile
            if (!wasMobile && mobile) {
                setIsSidebarOpen(false);
            }
            // Auto-open sidebar when switching to desktop
            else if (wasMobile && !mobile) {
                setIsSidebarOpen(true);
            }
        };

        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, [isMobile]);

    // Prevent body scroll when sidebar is open on mobile
    useEffect(() => {
        if (isMobile && isSidebarOpen) {
            document.body.classList.add('sidebar-open');
        } else {
            document.body.classList.remove('sidebar-open');
        }

        return () => {
            document.body.classList.remove('sidebar-open');
        };
    }, [isMobile, isSidebarOpen]);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const closeSidebar = () => {
        if (isMobile) {
            setIsSidebarOpen(false);
        }
    };

    return (
        <div className="flex w-full overflow-hidden bg-body" style={{ minHeight: '100vh' }}>
            <Sidebar isOpen={isSidebarOpen} isMobile={isMobile} onClose={closeSidebar} />

            {/* Mobile Overlay */}
            {isMobile && isSidebarOpen && (
                <div
                    onClick={closeSidebar}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 999,
                        transition: 'opacity 0.3s'
                    }}
                />
            )}

            <div className="flex flex-col flex-1 overflow-hidden relative" style={{ minHeight: '100vh' }}>
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
