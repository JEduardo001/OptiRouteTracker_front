import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Button, Input } from '../../components/common';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        birthday: '',
        roles: []
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [messageApi, setMessageApi] = useState('');
    const { register } = useAuth();
    const toast = useToast();
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

        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es requerido';
        }

        if (!formData.lastname.trim()) {
            newErrors.lastname = 'El apellido es requerido';
        }

        if (!formData.username.trim()) {
            newErrors.username = 'El usuario es requerido';
        } else if (formData.username.length < 3) {
            newErrors.username = 'El usuario debe tener al menos 3 caracteres';
        }

        if (!formData.email) {
            newErrors.email = 'El email es requerido';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }

        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida';
        } else if (formData.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }

        if (!formData.birthday) {
            newErrors.birthday = 'La fecha de nacimiento es requerida';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        const result = await register({
            name: formData.name,
            lastname: formData.lastname,
            username: formData.username,
            email: formData.email,
            password: formData.password,
            passwordRepeat: formData.password,
            birthday: formData.birthday,
            roles: []
        });
        if (result.success) {
            toast.success('¡Registro exitoso!', 'Ahora puedes iniciar sesión');
            navigate('/login');
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

                    <h1 className="auth-title">Crear una cuenta</h1>
                    <p className="auth-subtitle">Completa el formulario para registrarte</p>
                    <p style={{ color: 'red', marginBottom: '1rem' }}>{messageApi}</p>
                    <form className="auth-form" onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <Input
                                type="text"
                                name="name"
                                label="Nombre"
                                placeholder="Juan"
                                value={formData.name}
                                onChange={handleChange}
                                error={errors.name}
                            />

                            <Input
                                type="text"
                                name="lastname"
                                label="Apellido"
                                placeholder="Pérez"
                                value={formData.lastname}
                                onChange={handleChange}
                                error={errors.lastname}
                            />
                        </div>

                        <Input
                            type="text"
                            name="username"
                            label="Usuario"
                            placeholder="juanperez"
                            value={formData.username}
                            onChange={handleChange}
                            error={errors.username}
                            autoComplete="off"
                        />

                        <Input
                            type="email"
                            name="email"
                            label="Email"
                            placeholder="tu@email.com"
                            value={formData.email}
                            onChange={handleChange}
                            error={errors.email}
                        />

                        <Input
                            type="date"
                            name="birthday"
                            label="Fecha de Nacimiento"
                            value={formData.birthday}
                            onChange={handleChange}
                            error={errors.birthday}
                        />

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <Input
                                type="password"
                                name="password"
                                label="Contraseña"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={handleChange}
                                error={errors.password}
                                autoComplete="new-password"
                            />

                            <Input
                                type="password"
                                name="confirmPassword"
                                label="Confirmar"
                                placeholder="••••••••"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                error={errors.confirmPassword}
                            />
                        </div>

                        <Button type="submit" variant="primary" loading={loading} style={{ width: '100%' }}>
                            Registrarse
                        </Button>
                    </form>

                    <div className="auth-footer">
                        ¿Ya tienes una cuenta?{' '}
                        <Link to="/login">Inicia sesión aquí</Link>
                    </div>
                </div>
            </div>

            <div className="auth-right">
                <div className="auth-right-content">
                    <h2 className="auth-right-title">Únete a nosotros</h2>
                    <p className="auth-right-subtitle">
                        Crea tu cuenta y comienza a gestionar tu inventario de manera profesional.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
