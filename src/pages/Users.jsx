import { useState, useEffect } from 'react';
import {
    Button,
    Table,
    Modal,
    Input,
    Select,
    SearchBox,
    Badge,
    ConfirmDialog,
    Pagination,
} from '../components/common';
import { useToast } from '../context/ToastContext';
import userService from '../services/userService';
import roleService from '../services/roleService';

const Users = () => {
    const regexPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_\-]).{8,35}$/;
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    const [availableRoles, setAvailableRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [formLoading, setFormLoading] = useState(false);
    const [showInputPassword, setShowInputPassword] = useState(false);

    var newRoleSelected;

    // AHORA formData coincide con DtoUpdateUser
    const [formData, setFormData] = useState({
        id: '',
        name: '',
        lastname: '',
        username: '',
        email: '',
        active: true,
        birthday: '',
        roles: [],
    });

    const [formErrors, setFormErrors] = useState({});
    const toast = useToast();

    const [passwordData, setPasswordData] = useState({
        newPassword: '',
        confirmPassword: '',
    });

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData((prev) => ({ ...prev, [name]: value }));
    };

    useEffect(() => { fetchUsers(); fetchRoles(); }, [currentPage]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await userService.getAll({ page: currentPage - 1, size: 10 });

            // Soporta backend paginado o no paginado
            const list =
                Array.isArray(response)
                    ? response
                    : response.data?.content || response.data || [];

            setUsers(list);
            setTotalPages(response.data?.totalPages || response.totalPages || 1);
        } catch {
            setUsers([
                { id: 1, name: 'Juan', lastname: 'Pérez', username: 'jperez', email: 'juan@email.com', active: true, birthday: '2026-01-01', roles: [{ id: 1, name: 'ROLE_ADMIN' }] },
                { id: 2, name: 'María', lastname: 'García', username: 'mgarcia', email: 'maria@email.com', active: true, birthday: '2026-01-01', roles: [{ id: 2, name: 'ROLE_USER' }] },
            ]);
        }
        setLoading(false);
    };

    const fetchRoles = async () => {
        try {
            const response = await roleService.getAll({ page: currentPage - 1, size: 10 });    

            setAvailableRoles(response.data);
        }
        catch { setAvailableRoles([{ id: 1, name: 'Admin' }, { id: 2, name: 'User' }]); }
    };

    const handleOpenModal = (user = null) => {
        setSelectedUser(user);

        if (user) {
            setFormData({
                id: user.id,
                name: user.name || '',
                lastname: user.lastname || '',
                username: user.username || '',
                email: user.email || '',
                active: user.active ?? true,
                birthday: user.birthday || '',
                roles: user.roles || [],
            });
        } else {
            setFormData({
                id: '',
                name: '',
                lastname: '',
                username: '',
                email: '',
                active: true,
                birthday: '',
                roles: [],
            });
        }

        setFormErrors({});
        setIsModalOpen(true);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // manejo especial roles como lista de objetos
        if (name === 'roles') {
            const roleId = Number(value);

            // obtienes el objeto completo aquí
            const selectedRoleObject = availableRoles.find(r => r.id === roleId);

            if (!selectedRoleObject) return;

            setFormData(prev => ({
                ...prev,
                // lista de objetos rol
                roles: [...prev.roles, selectedRoleObject],
                selectedRole: selectedRoleObject
            }));

            return;
        }

        if (name === 'active') {
            setFormData(prev => ({ ...prev, active: value === 'true' }));
            return;
        }

        setFormData(prev => ({ ...prev, [name]: value }));

        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };


    const validarPassword = (password) => {
        return regexPassword.test(password);
    }
    
    const validarEmail = (email) => {
        return regexEmail.test(email);
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
        if (!formData.roles || formData.roles.size === 0) errors.roles = 'Requerido';

        if(showInputPassword){
            if(passwordData.confirmPassword != passwordData.newPassword){
                errors.password = 'Las contrasenas no coinciden';
            }

             if(!validarPassword(passwordData.newPassword)){
                errors.password = 'La contraseña no cumple el formato requerido: 8 - 35 caracteres, mayúsculas, minúsculas, números y un símbolo.';
            }
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setFormLoading(true);

        try {
            const payload = {
                id: formData.id,
                username: formData.username,
                email: formData.email,
                name: formData.name,
                active: formData.active,
                lastname: formData.lastname,
                birthday: formData.birthday,
                roles: formData.roles,
            };

            if(showInputPassword){
                payload.password = passwordData.newPassword;
                payload.passwordRepeat = passwordData.confirmPassword;
            }

            if (selectedUser) {
                const response = await userService.update(payload);
                setMessageResponseApi(response.message)
                toast.success('Éxito', 'Usuario actualizado');
            } else {
                await userService.create(payload);
                toast.success('Éxito', 'Usuario creado');
            }

            setIsModalOpen(false);
            fetchUsers();
        } catch {
            toast.error('Error', 'Error al guardar');
        }

        setFormLoading(false);
    };

    const handleDelete = async () => {
        try {
            await userService.delete(selectedUser.id);
            toast.success('Éxito', 'Usuario eliminado');
            setIsDeleteDialogOpen(false);
            fetchUsers();
        } catch {
            toast.error('Error', 'Error al eliminar');
        }
    };

    const columns = [
        { key: 'fullName', title: 'Nombre', render: (_, u) => <div className="flex items-center gap-sm"><div className="avatar sm">{u.name?.[0]}{u.lastname?.[0]}</div><div><div className="font-medium">{u.name} {u.lastname}</div><div className="text-sm text-muted">@{u.username}</div></div></div> },
        { key: 'email', title: 'Email' },
        { key: 'active', title: 'Estado', render: (v) => <Badge variant={v ? 'success' : 'danger'}>{v ? 'Activo' : 'Inactivo'}</Badge> },
        { key: 'actions', title: 'Acciones', render: (_, u) => <div className="table-actions"><Button variant="ghost" size="sm" onClick={() => {setShowInputPassword(false), handleOpenModal(u)}}>✏️</Button></div> },
    ];

    return (
        <div className="animate-fade-in">
            <div className="page-header"><div className="page-header-left"><h1 className="page-title">Usuarios</h1><p className="page-subtitle">Gestiona los usuarios del sistema</p></div><div className="page-header-right"><Button variant="primary" onClick={() => {
                setShowInputPassword(true), 
                setPasswordData({ newPassword: '', confirmPassword: '' });
                handleOpenModal()
                
    
                }}>➕ Nuevo Usuario</Button></div></div>
            <div className="data-page-filters"><SearchBox value={searchTerm} onChange={setSearchTerm} placeholder="Buscar usuarios..." /></div>
            <Table columns={columns} data={users.filter(u => u.name?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email?.toLowerCase().includes(searchTerm.toLowerCase()))} loading={loading} emptyMessage="No se encontraron usuarios" />
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

            <Modal
                isOpen={isModalOpen}
                onClose={() => {setIsModalOpen(false) }}
                title={selectedUser ? 'Editar Usuario' : 'Nuevo Usuario'}
                size="lg"
                footer={<>
                    <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                    <Button variant="primary" onClick={handleSubmit} loading={formLoading}>{selectedUser ? 'Guardar' : 'Crear'}</Button>
                </>}
            >

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <Input label="Nombre" name="name" value={formData.name} onChange={handleChange} error={formErrors.name} />
                        <Input label="Apellido" name="lastname" value={formData.lastname} onChange={handleChange} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <Input label="Usuario" name="username" value={formData.username} onChange={handleChange} error={formErrors.username} />
                        <Input type="email" label="Email" name="email" value={formData.email} onChange={handleChange} error={formErrors.email} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                        <Input type="date" label="Nacimiento" name="birthday" value={formData.birthday} onChange={handleChange} error={formErrors.birthday} />
                        <Select
                            label="Estado"
                            name="active"
                            value={String(formData.active)}
                            onChange={handleChange}
                            options={[
                                { value: 'true', label: 'Activo' },
                                { value: 'false', label: 'Inactivo' },
                            ]}
                        />
                    </div>

                    <Select
                        label="Seleccionar nuevo rol"
                        name="roles"
                        value={newRoleSelected}
                        onChange={handleChange}
                        error={formErrors.roles}
                        options={availableRoles.map(r => ({ value: r.id, label: r.name }))}
                    />


                    {/* Lista responsiva con eliminación */}
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
                                <span style={{ wordBreak: "break-word", flex: 1 }}>
                                {item.name}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setFormData(prev => ({
                                            ...prev,
                                            roles: prev.roles.filter(rol => rol.id !== item.id)
                                        }));
                                    }}
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

                    {showInputPassword && (
                    <>
                    <Input
                    type="password"
                    label="Contraseña"
                    name="newPassword"
                    autoComplete="new-password"
                    value={passwordData.newPassword}
                    error={formErrors.password}
                    onChange={handlePasswordChange}
                    />

                    <Input
                    type="password"
                    label="Confirmar Contraseña"
                    name="confirmPassword"
                    autoComplete="new-password"
                    value={passwordData.confirmPassword}
                    error={formErrors.password}
                    onChange={handlePasswordChange}
                    />

                    </>
                    )}

                </form>
            </Modal>

            <ConfirmDialog isOpen={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)} onConfirm={handleDelete} title="Eliminar Usuario" message={`¿Eliminar a ${selectedUser?.name}?`} />
        </div>
    );
};

export default Users;
