import { useState, useEffect } from 'react';
import {
    Button,
    Table,
    Modal,
    Input,
    SearchBox,
    ConfirmDialog,
    Pagination,
} from '../components/common';
import { useToast } from '../context/ToastContext';
import inventoryService from '../services/inventoryService';

const Inventories = () => {
    const [inventories, setInventories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedInventory, setSelectedInventory] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    const [formData, setFormData] = useState({
        id: '',
        name: '',
        description: '',
        location: '',
        active: false
    });
    const [formErrors, setFormErrors] = useState({});

    const toast = useToast();

    useEffect(() => {
        fetchInventories();
    }, [currentPage]);

    const fetchInventories = async () => {
        setLoading(true);
        try {
            const response = await inventoryService.getAll({ page: currentPage - 1, size: 10 });
            const inventoryList = Array.isArray(response) ? response : response.data || [];
            setInventories(inventoryList);
            setTotalPages(response.totalPages || 1);
        } catch (error) {
            setInventories([
                { id: 1, name: 'Almacén Principal', description: 'Almacén central de la empresa', location: 'Edificio A, Piso 1', quantity: 245, createDate: '2024-01-01' },
                { id: 2, name: 'Bodega Sur', description: 'Bodega de productos terminados', location: 'Zona Industrial Sur', quantity: 189, createDate: '2024-01-05' },
                { id: 3, name: 'Depósito Norte', description: 'Materias primas', location: 'Zona Industrial Norte', quantity: 312, createDate: '2024-01-10' },
                { id: 4, name: 'Almacén Temporal', description: 'Para productos en tránsito', location: 'Edificio B', quantity: 56, createDate: '2024-01-15' },
            ]);
            setTotalPages(1);
        }
        setLoading(false);
    };

    const handleOpenModal = (inventory = null) => {
        if (inventory) {
            setSelectedInventory(inventory);
            setFormData({
                id: inventory.id || '',
                name: inventory.name || '',
                description: inventory.description || '',
                location: inventory.location || '',
                active: inventory.active || false,
            });
        } else {
            setSelectedInventory(null);
            setFormData({
                id: '',
                name: '',
                description: '',
                location: '',
                active: false
            });
        }
        setFormErrors({});
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedInventory(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors((prev) => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.name.trim()) errors.name = 'El nombre es requerido';
        if (!formData.location.trim()) errors.location = 'La ubicación es requerida';

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setFormLoading(true);
        try {

            if (selectedInventory) {
                await inventoryService.update(formData);
                toast.success('Éxito', 'Inventario actualizado correctamente');
            } else {
                await inventoryService.create(formData);
                toast.success('Éxito', 'Inventario creado correctamente');
            }
            handleCloseModal();
            fetchInventories();
        } catch (error) {
            toast.error('Error', error.response?.data?.message || 'Error al guardar el inventario');
        }
        setFormLoading(false);
    };

    const filteredInventories = inventories.filter((inventory) =>
        inventory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inventory.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (dateString) => {
        if (!dateString) return '-';
        return new Date(dateString).toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const columns = [
        { key: 'name', title: 'Nombre' },
        { key: 'location', title: 'Ubicación' },
        {
            key: 'quantity',
            title: 'Productos',
            render: (value) => (
                <span className="font-semibold">{value || 0}</span>
            ),
        },
        {
            key: 'createDate',
            title: 'Fecha Creación',
            render: (value) => formatDate(value),
        },
        {
            key: 'actions',
            title: 'Acciones',
            render: (_, inventory) => (
                <div className="table-actions">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenModal(inventory)}
                    >
                        ✏️
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <div className="page-header-left">
                    <h1 className="page-title">Inventarios</h1>
                    <p className="page-subtitle">Gestiona los almacenes e inventarios</p>
                </div>
                <div className="page-header-right">
                    <Button variant="primary" onClick={() => handleOpenModal()}>
                        ➕ Nuevo Inventario
                    </Button>
                </div>
            </div>

            <div className="data-page-filters">
                <SearchBox
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Buscar inventarios..."
                />
            </div>

            <Table
                columns={columns}
                data={filteredInventories}
                loading={loading}
                emptyMessage="No se encontraron inventarios"
            />

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
            />

            {/* Modal de Crear/Editar */}
            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={selectedInventory ? 'Editar Inventario' : 'Nuevo Inventario'}
                footer={
                    <>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={handleSubmit} loading={formLoading}>
                            {selectedInventory ? 'Guardar Cambios' : 'Crear Inventario'}
                        </Button>
                    </>
                }
            >
               
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <Input
                            label="Nombre del Inventario"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            error={formErrors.name}
                            placeholder="Ej: Almacén Principal"
                        />

                        <Input
                            type="textarea"
                            label="Descripción"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Descripción del inventario"
                        />

                        <Input
                            label="Ubicación"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            error={formErrors.location}
                            placeholder="Ej: Edificio A, Piso 1"
                        />

                          <label className="form-label" style={{ display: 'block', marginBottom: '0.5rem' }}>
                            Activo
                        </label>
                        <input
                            type="checkbox"
                            style={{ width: '20px', height: '20px' }}
                            checked={formData.active}
                            onChange={(e) =>
                                setFormData((prev) => ({
                                    ...prev,
                                    active: e.target.checked,
                                }))
                            }
                        />
                        {formErrors.active && (
                            <div className="form-error">{formErrors.active}</div>
                        )}
                    </div>
                </form>
            </Modal>

          
        </div>
    );
};

export default Inventories;
