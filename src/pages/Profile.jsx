import { useState, useEffect } from 'react';
import { Button, Card, Input, Loading } from '../components/common';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import userService from '../services/userService';

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        username: '',
        email: '',
        birthday: '',
    });
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const toast = useToast();

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                lastname: user.lastname || '',
                username: user.username || '',
                email: user.email || '',
                birthday: user.birthday || '',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            // En una implementación real, esto llamaría a la API
            // const updatedUser = await userService.updateProfile(formData);

            // Simulación de actualización
            setTimeout(() => {
                updateUser({ ...user, ...formData });
                toast.success('Perfil actualizado', 'Tus datos han sido guardados correctamente');
                setSaving(false);
            }, 1000);

        } catch (error) {
            toast.error('Error', 'No se pudo actualizar el perfil');
            setSaving(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast.error('Error', 'Las contraseñas nuevas no coinciden');
            return;
        }

        setSaving(true);
        try {
            // await authService.changePassword(passwordData);
            setTimeout(() => {
                toast.success('Contraseña actualizada', 'Tu contraseña ha sido cambiada correctamente');
                setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                setSaving(false);
            }, 1000);
        } catch (error) {
            toast.error('Error', 'No se pudo cambiar la contraseña');
            setSaving(false);
        }
    };
    

    if (!user) return <Loading fullPage />;

    return (
        <div className="animate-fade-in">
            <div className="profile-header">
                <div className="profile-avatar">
                    <div className="avatar xl">
                        {user.name?.[0]}{user.lastname?.[0]}
                    </div>
                </div>
                <div className="profile-info">
                    <h1>{user.name} {user.lastname}</h1>
                    <p>@{user.username} • {user.roles?.[0]?.name || 'Usuario'}</p>
                </div>
            </div>

            <div className="profile-grid">
                <Card title="Información Personal">
                    <form onSubmit={handleUpdateProfile}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <Input
                                label="Nombre"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                            />
                            <Input
                                label="Apellido"
                                name="lastname"
                                value={formData.lastname}
                                onChange={handleChange}
                            />
                        </div>

                        <Input
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            disabled
                            helper="El email no se puede cambiar"
                        />

                        <Input
                            label="Usuario"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            disabled
                            helper="El nombre de usuario no se puede cambiar"
                        />

                        <Input
                            type="date"
                            label="Fecha de Nacimiento"
                            name="birthday"
                            value={formData.birthday}
                            onChange={handleChange}
                        />

                        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                            <Button type="submit" variant="primary" loading={saving}>
                                Guardar Cambios
                            </Button>
                        </div>
                    </form>
                </Card>

                <Card title="Seguridad">
                    <form onSubmit={handleChangePassword}>
                        <Input
                            type="password"
                            label="Contraseña Actual"
                            name="currentPassword"
                            value={passwordData.currentPassword}
                            onChange={handlePasswordChange}
                        />

                        <Input
                            type="password"
                            label="Nueva Contraseña"
                            name="newPassword"
                            value={passwordData.newPassword}
                            onChange={handlePasswordChange}
                        />

                        <Input
                            type="password"
                            label="Confirmar Nueva Contraseña"
                            name="confirmPassword"
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                        />

                        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                            <Button type="submit" variant="secondary" loading={saving}>
                                Cambiar Contraseña
                            </Button>
                        </div>
                    </form>
                </Card>
            </div>
        </div>
    );
};

export default Profile;
