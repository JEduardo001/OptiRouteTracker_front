import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button, Input } from '../../components/common';

const Login = () => {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const toast = useToast();
    const [messageApi, setMessageApi] = useState('');
    const navigate = useNavigate();


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.username) {
            newErrors.username = 'El username es requerido';
        }
        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        const result = await login({
            username: formData.username,
            password: formData.password,
        });
        console.log(result);
        if (result.success) {
            toast.success('¡Bienvenido!', 'Has iniciado sesión correctamente');
            console.log("todo bien");
            navigate('/dashboard');
        } else {
            toast.error('Error', result.error);
            setMessageApi(result.error);
        }
        setLoading(false);
    };

    return (
        <div className="auth-page">
            <div className="auth-left">
                <div className="auth-card">
                    <div className="auth-logo">
                        <div className="auth-logo-icon">📦</div>
                        <span className="auth-logo-text">Inventory Manager</span>
                    </div>

                    <h1 className="auth-title">Bienvenido de vuelta</h1>
                    <p className="auth-subtitle">Ingresa tus credenciales para acceder a tu cuenta</p>
                    <p style={{ color: 'red', marginBottom: '1rem' }}>{messageApi}</p>

                    <form className="auth-form" onSubmit={handleSubmit}>
                        <Input
                            type="text"
                            name="username"
                            label="Username"
                            placeholder="tu username"
                            value={formData.username}
                            onChange={handleChange}
                            error={errors.username}
                        />

                        <Input
                            type="password"
                            name="password"
                            label="Contraseña"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            error={errors.password}
                        />

                        <Button type="submit" variant="primary" loading={loading} style={{ width: '100%' }}>
                            Iniciar Sesión
                        </Button>
                    </form>

                    <div className="auth-footer">
                        ¿No tienes una cuenta?{' '}
                        <Link to="/register">Regístrate aquí</Link>
                    </div>
                </div>
            </div>

            <div className="auth-right">
                <div className="auth-right-content">
                    <h2 className="auth-right-title">Gestiona tu inventario</h2>
                    <p className="auth-right-subtitle">
                        Una plataforma completa para administrar tus productos, inventarios y categorías de manera eficiente.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
