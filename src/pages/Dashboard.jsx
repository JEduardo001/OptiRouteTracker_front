import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, Loading } from '../components/common';
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import inventoryService from '../services/inventoryService';
import userService from '../services/userService';

const Dashboard = () => {
    const [stats, setStats] = useState({
        products: 0,
        categories: 0,
        inventories: 0,
        users: 0,
    });
    const [loading, setLoading] = useState(true);
    const [recentProducts, setRecentProducts] = useState([]);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Intentar cargar datos de la API
            const [products, categories, inventories, users] = await Promise.all([
                productService.getAll({ page: 0, size: 10 }).catch(() => { }),
                categoryService.getAll({ page: 0, size: 10 }).catch(() => { }),
                inventoryService.getAll({ page: 0, size: 10 }).catch(() => { }),
                userService.getAll({ page: 0, size: 10 }).catch(() => { })

            ]);
            console.log(categories)
            setStats({
                products: products.totalElements || 0,
                categories: categories.totalElements || 0,
                inventories: inventories.totalElements || 0,
                users: users.totalElements || 0,
            });

            // Obtener productos recientes
            const productList = Array.isArray(products) ? products : products.content || [];
            setRecentProducts(productList.slice(0, 5));
        } catch (error) {
            console.log('Error loading dashboard data:', error);
            // Usar datos de demostración si la API no está disponible
            setStats({
                products: 128,
                categories: 12,
                inventories: 5,
                users: 24,
            });
        } finally {
            setLoading(false);
        }
    };

    const statsCards = [
        {
            icon: '🏷️',
            label: 'Productos',
            value: stats.products,
            color: 'primary',
            link: '/products',
        },
        {
            icon: '📁',
            label: 'Categorías',
            value: stats.categories,
            color: 'success',
            link: '/categories',
        },
        {
            icon: '📦',
            label: 'Inventarios',
            value: stats.inventories,
            color: 'warning',
            link: '/inventories',
        },
        {
            icon: '👥',
            label: 'Usuarios',
            value: stats.users,
            color: 'info',
            link: '/users',
        },
    ];

    const recentActivities = [
        { icon: '➕', color: 'success', title: 'Producto agregado', time: 'Hace 5 minutos' },
        { icon: '✏️', color: 'primary', title: 'Inventario actualizado', time: 'Hace 15 minutos' },
        { icon: '👤', color: 'info', title: 'Nuevo usuario registrado', time: 'Hace 1 hora' },
        { icon: '📁', color: 'warning', title: 'Categoría creada', time: 'Hace 2 horas' },
        { icon: '🗑️', color: 'danger', title: 'Producto eliminado', time: 'Hace 3 horas' },
    ];

    if (loading) {
        return <Loading fullPage text="Cargando dashboard..." />;
    }

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <div className="page-header-left">
                    <h1 className="page-title">Dashboard</h1>
                    <p className="page-subtitle">Bienvenido al panel de control de inventario</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="dashboard-stats">
                {statsCards.map((stat, index) => (
                    <Link to={stat.link} state={{ items: stat.value }} key={index} style={{ textDecoration: 'none' }}>
                        <Card className="stats-card hover-lift transition-transform" hoverable>
                            <div className={`stats-card-icon ${stat.color}`}>
                                {stat.icon}
                            </div>
                            <div className="stats-card-value">{stat.value.toLocaleString()}</div>
                            <div className="stats-card-label">{stat.label}</div>
                        </Card>
                    </Link>
                ))}
            </div>

            {/* Main Content Grid */}
            <div className="dashboard-grid">
                {/* Chart Placeholder */}
                <Card title="Resumen de Inventario">
                    <div className="dashboard-chart">
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📊</div>
                            <p className="text-secondary">
                                Gráficos disponibles cuando conectes tu API
                            </p>
                        </div>
                    </div>
                </Card>

                {/* Recent Activity */}
                <Card title="Actividad Reciente">
                    {recentActivities.map((activity, index) => (
                        <div key={index} className="recent-activity-item">
                            <div
                                className="activity-icon"
                                style={{
                                    background: `var(--${activity.color}-bg, rgba(99, 102, 241, 0.1))`,
                                    color: `var(--${activity.color})`,
                                }}
                            >
                                {activity.icon}
                            </div>
                            <div className="activity-content">
                                <div className="activity-title">{activity.title}</div>
                                <div className="activity-time">{activity.time}</div>
                            </div>
                        </div>
                    ))}
                </Card>
            </div>

            {/* Quick Actions */}
            <Card title="Acciones Rápidas" style={{ marginTop: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <Link to="/products" className="btn btn-primary">
                        ➕ Nuevo Producto
                    </Link>
                    <Link to="/categories" className="btn btn-secondary">
                        📁 Ver Categorías
                    </Link>
                    <Link to="/inventories" className="btn btn-secondary">
                        📦 Ver Inventarios
                    </Link>
                </div>
            </Card>
        </div>
    );
};

export default Dashboard;
