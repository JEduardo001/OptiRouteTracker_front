import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Sidebar = ({ collapsed, onToggle, mobileOpen, onMobileClose }) => {
    const location = useLocation();
    const { user, logout } = useAuth();

    const menuItems = [
        {
            section: 'Principal',
            items: [
                { path: '/dashboard', icon: '📊', label: 'Dashboard' },
            ],
        },
        {
            section: 'Gestión',
            items: [
                { path: '/inventories', icon: '📦', label: 'Inventarios' },
                { path: '/products', icon: '🏷️', label: 'Productos' },
                { path: '/categories', icon: '📁', label: 'Categorías' },
            ],
        },
        {
            section: 'Administración',
            items: [
                { path: '/users', icon: '👥', label: 'Usuarios' },
            ],
        },
    ];

    const isActiveRoute = (path) => {
        return location.pathname === path || location.pathname.startsWith(`${path}/`);
    };

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`sidebar-overlay ${mobileOpen ? 'visible' : ''}`}
                onClick={onMobileClose}
            />

            {/* Sidebar */}
            <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'open' : ''}`}>
                <div className="sidebar-header">
                    <div className="sidebar-logo">
                        <div className="sidebar-logo-icon">📦</div>
                        <span className="sidebar-logo-text">Inventory</span>
                    </div>
                    <button className="sidebar-toggle hide-mobile" onClick={onToggle}>
                        {collapsed ? '→' : '←'}
                    </button>
                    <button className="sidebar-toggle hide-desktop" onClick={onMobileClose}>
                        ✕
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((section, index) => (
                        <div key={index} className="sidebar-section">
                            <div className="sidebar-section-title">{section.section}</div>
                            {section.items.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={`sidebar-link ${isActiveRoute(item.path) ? 'active' : ''}`}
                                    onClick={onMobileClose}
                                >
                                    <span className="sidebar-link-icon">{item.icon}</span>
                                    <span className="sidebar-link-text">{item.label}</span>
                                </NavLink>
                            ))}
                        </div>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <NavLink
                        to="/profile"
                        className={`sidebar-link ${isActiveRoute('/profile') ? 'active' : ''}`}
                        onClick={onMobileClose}
                    >
                        <span className="sidebar-link-icon">👤</span>
                        <span className="sidebar-link-text">Mi Perfil</span>
                    </NavLink>
                    <button className="sidebar-link" onClick={logout} style={{ width: '100%', border: 'none', background: 'transparent', textAlign: 'left' }}>
                        <span className="sidebar-link-icon">🚪</span>
                        <span className="sidebar-link-text">Cerrar Sesión</span>
                    </button>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
