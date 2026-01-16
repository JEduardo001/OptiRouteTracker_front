import { useState, useEffect } from 'react';
import { Button, Card, Input, Loading, Select } from '../components/common';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import userService from '../services/userService';
import roleService from '../services/roleService';
import authService from '../services/authService';

const Profile = () => {
    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_\-]).{8,35}$/;
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const { user, updateUser } = useAuth();
    const toast = useToast();
    const [savingNewPassword, setSavingNewPassword] = useState(false);
    const [saving, setSaving] = useState(false);
    const [availableRoles, setAvailableRoles] = useState([]);
    const [formErrors, setFormErrors] = useState({});
    const [visibleCurrentPassword, setVisibleCurrentPassword] = useState(false);
    const [visibleNewPassword, setVisibleNewPassword] = useState(false);
    const [messageApi,setMessageApi] = useState('')


    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        username: '',
        email: '',
        birthday: '',
        roles: [],
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [selectedRole, setSelectedRole] = useState('');

    // Inicializa datos del usuario y roles
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                lastname: user.lastname || '',
                username: user.username || '',
                email: user.email || '',
                // Convertimos LocalDate a yyyy-MM-dd string
                birthday: user.birthday ? user.birthday : '',
                roles: user.roles || [],
            });
        }
        fetchRoles();
    }, [user]);

    // Trae roles disponibles del backend
    const fetchRoles = async () => {
        try {
            const response = await roleService.getAll({ page: 0, size: 50 }); // ajusta tamaño si hace falta
            const activeRoles = response.data.filter(r => r.active); // solo roles activos
            setAvailableRoles(activeRoles);
        } catch {
            setAvailableRoles([
                { id: 1, name: 'Admin', active: true },
                { id: 2, name: 'User', active: true },
            ]);
        }
    };

    // Maneja cambios de inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
    };

   
    // Función para agregar rol
    const handleAddRole = () => {
        if (!selectedRole) return;

        const id = parseInt(selectedRole, 10);
        const role = availableRoles.find(r => r.id === id);
        if (!role) return;

        // Evita duplicados
        if (!formData.roles.some(r => r.id === id)) {
            setFormData(prev => ({
                ...prev,
                roles: [...prev.roles, role],
            }));
        }

        setSelectedRole(''); // limpia el select
    };

    // Eliminar rol
    const handleRemoveRole = (roleId) => {
        setFormData(prev => ({
            ...prev,
            roles: prev.roles.filter(r => r.id !== roleId),
        }));
    };

    const validarEmail = (email) => {
        return regexEmail.test(email);
    }

     const validarPassword = (password) => {
        return regexPassword.test(password);
    }

    const validateForm = () => {
        const errors = {};
        if (!formData.name.trim()) errors.name = 'Requerido';
        if (!formData.username.trim()) errors.username = 'Requerido';
        if (!formData.email.trim()) {
            errors.email = 'Requerido';
        } else if (!validarEmail(formData.email)) {
            errors.email = 'Formato de correo inválido';
        }
        if (!formData.birthday) errors.birthday = 'Requerido';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

     const validateFormChangePassword = () => {
        const errors = {};
        if (!passwordData.currentPassword.trim()) errors.currentPassword = 'Requerido';
        if (!passwordData.newPassword.trim()) errors.newPassword = 'Requerido';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };


    // Guardar perfil
    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setSaving(true);
        try {
            formData.id = user.id;
            formData.active = user.active;
            await userService.update(formData);
            updateUser({ ...user, ...formData });
            toast.success('Perfil actualizado', 'Tus datos han sido guardados correctamente');
            setSaving(false);
           
        } catch (error) {
            toast.error('Error', 'No se pudo actualizar el perfil');
            setSaving(false);
        }
    };

    // Cambiar contraseña
    const handleChangePassword = async (e) => {
        e.preventDefault();
        setMessageApi('')
        if(!validateFormChangePassword()){
            return;
        }

        if(!validarPassword(passwordData.confirmPassword)){
            const errors = {
                passwordNotFormat: 'La contraseña no cumple el formato requerido: 8 - 35 caracteres, mayúsculas, minúsculas, números y un símbolo.'
            }
            setFormErrors(errors)
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            const errors = {
                passwordDoNotMatch:  'Las contraseñas no coinciden'
            }
            setFormErrors(errors);
            return;
        }

        setSaving(true);
        try {

            const payload = {
                id: user.id,
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword,
                confirmPassword: passwordData.confirmPassword
            }
            const response = await authService.changePassword(payload)
            toast.success('Contraseña actualizada', 'Tu contraseña ha sido cambiada correctamente');
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setSaving(false);
            setMessageApi(response.message)
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
                                error={formErrors.name}
                                onChange={handleChange}
                            />
                            <Input
                                label="Apellido"
                                name="lastname"
                                error={formErrors.lastname}
                                value={formData.lastname}
                                onChange={handleChange}
                            />
                        </div>

                        <Input
                            label="Email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            error={formErrors.email}
                        />

                        <Input
                            label="Usuario"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            error={formErrors.username}                       
                        />

                        <Input
                            type="date"
                            label="Fecha de Nacimiento"
                            name="birthday"
                            value={formData.birthday || ''} 
                            onChange={handleChange}
                            error={formErrors.birthday}
                        />

                        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                            <Button type="submit" variant="primary" loading={saving}  onClick={handleUpdateProfile}>
                                Guardar Cambios
                            </Button>
                        </div>

                       <Select
                            label="Seleccionar nuevo rol"
                            name="roles"
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            options={availableRoles.map(r => ({ value: r.id.toString(), label: r.name }))}
                            error={formErrors.roles}
                        />

                        <Button type="button" variant="primary" onClick={handleAddRole} style={{ marginTop: '0.5rem' }}>
                            Agregar Rol
                        </Button>


                        <div
                            style={{
                                marginTop: "1rem",
                                border: "1px solid #ddd",
                                borderRadius: "12px",
                                padding: "1rem",
                                maxHeight: "240px",
                                overflowY: "auto",
                            }}
                        >
                            <h4 style={{ marginBottom: "0.75rem" }}>Roles seleccionados</h4>

                            <ul
                                style={{
                                    listStyle: "none",
                                    padding: 0,
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                                    gap: "0.75rem",
                                }}
                            >
                                {formData.roles.map((item) => (
                                    <li
                                        key={item.id}
                                        style={{
                                            border: "1px solid #e5e5e5",
                                            borderRadius: "12px",
                                            padding: "0.8rem",
                                            fontSize: "0.9rem",
                                            background: "#888",
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            gap: "0.5rem",
                                        }}
                                    >
                                        <span style={{ wordBreak: "break-word", color: "white", flex: 1 }}>
                                            {item.name}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveRole(item.id)}
                                            style={{
                                                border: "none",
                                                padding: "0.35rem 0.6rem",
                                                borderRadius: "8px",
                                                cursor: "pointer",
                                                background: "#ff7474",
                                            }}
                                        >
                                            Eliminar
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </form>
                </Card>

                <Card title="Seguridad">
                    <p style={{ color: "#ca5151" }}>{messageApi}</p>

                    <form onSubmit={handleChangePassword}>
                        {/* CONTRASEÑA ACTUAL */}
                        <div style={{ position: "relative" }}>
                            <Input
                                type={visibleCurrentPassword ? "text" : "password"}
                                label="Contraseña Actual"
                                name="currentPassword"
                                error={formErrors.currentPassword}
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                            />
                            <button
                                type="button"
                                onClick={() => setVisibleCurrentPassword(v => !v)}
                                style={{
                                    position: "absolute",
                                    right: "12px",
                                    top: "38px",
                                    padding: "0.3rem 0.6rem",
                                    borderRadius: "6px",
                                    border: "1px solid #ccc",
                                    background: "#f3f4f6",
                                    cursor: "pointer",
                                    fontSize: "0.75rem",
                                }}
                            >
                                {visibleCurrentPassword ? "Ocultar" : "Ver"}
                            </button>
                        </div>

                        {/* NUEVA CONTRASEÑA */}
                        <div style={{ position: "relative" }}>
                            <Input
                                type={visibleNewPassword ? "text" : "password"}
                                label="Nueva Contraseña"
                                error={formErrors.newPassword}
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                            />
                            <button
                                type="button"
                                onClick={() => setVisibleNewPassword(v => !v)}
                                style={{
                                    position: "absolute",
                                    right: "12px",
                                    top: "38px",
                                    padding: "0.3rem 0.6rem",
                                    borderRadius: "6px",
                                    border: "1px solid #ccc",
                                    background: "#f3f4f6",
                                    cursor: "pointer",
                                    fontSize: "0.75rem",
                                }}
                            >
                                {visibleNewPassword ? "Ocultar" : "Ver"}
                            </button>
                        </div>

                        {/* CONFIRMAR NUEVA CONTRASEÑA (comparte estado) */}
                        <Input
                            type={visibleNewPassword ? "text" : "password"}
                            label="Confirmar Nueva Contraseña"
                            name="confirmPassword"
                            error={formErrors.passwordNotFormat}
                            value={passwordData.confirmPassword}
                            onChange={handlePasswordChange}
                        />

                        <p style={{ color: "#ca5151" }}>{formErrors.passwordDoNotMatch}</p>

                        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                            <Button type="submit" variant="secondary" loading={savingNewPassword}>
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
