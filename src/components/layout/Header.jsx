import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = ({ collapsed, onMenuClick, title }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getInitials = (name) => {
        if (!name) return 'U';
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <header className={`header ${collapsed ? 'collapsed' : ''}`}>
            <div className="header-left">
                <button className="header-menu-btn" onClick={onMenuClick}>
                    ☰
                </button>
                <h1 className="header-title">{title}</h1>
            </div>

            <div className="header-right">
                <button className="header-notification">
                    🔔
                    <span className="header-notification-badge"></span>
                </button>

                <div className="dropdown" ref={dropdownRef}>
                    <div
                        className="header-user"
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                        <div className="avatar sm">
                            {getInitials(user?.name || user?.username)}
                        </div>
                        <div className="header-user-info">
                            <div className="header-user-name">
                                {user?.name || user?.username || 'Usuario'}
                            </div>
                            <div className="header-user-role">
                                {user?.roles?.[0]?.name || 'Usuario'}
                            </div>
                        </div>
                    </div>

                    {dropdownOpen && (
                        <div className="dropdown-menu">
                            <div
                                className="dropdown-item"
                                onClick={() => {
                                    navigate('/profile');
                                    setDropdownOpen(false);
                                }}
                            >
                                👤 Mi Perfil
                            </div>
                            <div className="dropdown-divider"></div>
                            <div
                                className="dropdown-item"
                                onClick={handleLogout}
                                style={{ color: 'var(--error)' }}
                            >
                                🚪 Cerrar Sesión
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
