import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

const pagesTitles = {
    '/dashboard': 'Dashboard',
    '/inventories': 'Inventarios',
    '/products': 'Productos',
    '/categories': 'Categorías',
    '/users': 'Usuarios',
    '/profile': 'Mi Perfil',
};

const DashboardLayout = () => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    const getPageTitle = () => {
        const basePath = '/' + location.pathname.split('/')[1];
        return pagesTitles[basePath] || 'Dashboard';
    };

    return (
        <div className="dashboard-layout">
            <Sidebar
                collapsed={sidebarCollapsed}
                onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
                mobileOpen={mobileOpen}
                onMobileClose={() => setMobileOpen(false)}
            />

            <div className={`dashboard-content ${sidebarCollapsed ? 'collapsed' : ''}`}>
                <Header
                    collapsed={sidebarCollapsed}
                    onMenuClick={() => setMobileOpen(true)}
                    title={getPageTitle()}
                />

                <main className="dashboard-main">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
