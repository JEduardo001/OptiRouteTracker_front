
import { useState, useEffect } from 'react';
import {
    Button,
    Table,
    Modal,
    Input,
    SearchBox,
    Badge,
    ConfirmDialog,
    Pagination,
} from '../components/common';
import { useToast } from '../context/ToastContext';
import categoryService from '../services/categoryService';

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [formLoading, setFormLoading] = useState(false);

    const [formData, setFormData] = useState({
        id: '',
        name: '',
        active: false,
        quantityProducts: '',
    });

    const [formErrors, setFormErrors] = useState({});
    const toast = useToast();

    useEffect(() => {
        fetchCategories();
    }, [currentPage]);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await categoryService.getAll({ page: currentPage - 1, size: 10 });
            const categoryList = Array.isArray(response) ? response : response.data || [];
            setCategories(categoryList);
            setTotalPages(response.totalPages || 1);
        } catch (error) {
            setCategories([
                { id: 1, name: 'Electrónicos', active: true, quantityProducts: 45 },
                { id: 2, name: 'Accesorios', active: true, quantityProducts: 120 },
                { id: 3, name: 'Periféricos', active: true, quantityProducts: 67 },
                { id: 4, name: 'Software', active: false, quantityProducts: 23 },
                { id: 5, name: 'Redes', active: true, quantityProducts: 34 },
            ]);
            setTotalPages(1);
        }
        setLoading(false);
    };

    const handleOpenModal = (category = null) => {
        if (category) {
            setSelectedCategory(category);
            setFormData({
                id: category.id,
                name: category.name || '',
                active: category.active,
                quantityProducts: category.quantityProducts ?? 0,
            });
        } else {
            setSelectedCategory(null);
            setFormData({
                id: '',
                name: '',
                active: false,
                quantityProducts: '',
            });
        }
        setFormErrors({});
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCategory(null);
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
        if (!formData.name.trim()) errors.name = 'Requerido';
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setFormLoading(true);
        try {

            if (selectedCategory) {
                await categoryService.update({
                    id: formData.id,
                    name: formData.name,
                    active: formData.active,
                    quantityProducts: formData.quantityProducts,
                });
                toast.success('Éxito', 'Categoría actualizada correctamente');
            } else {
                await categoryService.create({
                    name: formData.name,
                    active: formData.active,

                });
                toast.success('Éxito', 'Categoría creada correctamente');
            }
            handleCloseModal();
            fetchCategories();
        } catch (error) {
            const data = error.response?.data;
            toast.error('Error', data?.message || 'Error');
        }
        setFormLoading(false);
    };

    const handleToggleActive = async (category) => {
        try {
            await categoryService.toggleActive(category.id);
            toast.success('Éxito', `Categoría ${category.active ? 'desactivada' : 'activada'}`);
            fetchCategories();
        } catch (error) {
            toast.error('Error', error.response?.data?.message || 'Error');
        }
    };

    const filteredCategories = categories.filter((category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        { key: 'id', title: 'ID', width: '80px' },
        { key: 'name', title: 'Nombre' },
        {
            key: 'quantityProducts',
            title: 'Productos',
            render: (value) => <span className="font-medium">{value || 0}</span>,
        },
        {
            key: 'active',
            title: 'Estado',
            render: (value) => (
                <Badge variant={value ? 'success' : 'danger'}>
                    {value ? 'Activo' : 'Inactivo'}
                </Badge>
            ),
        },
        {
            key: 'actions',
            title: 'Acciones',
            render: (_, category) => (
                <div className="table-actions">
                    <Button variant="ghost" size="sm" onClick={() => handleOpenModal(category)}>✏️</Button>

                </div>
            ),
        },
    ];

    return (
        <div className="animate-fade-in">
            <div className="page-header">
                <div className="page-header-left">
                    <h1 className="page-title">Categorías</h1>
                    <p className="page-subtitle">Gestiona las categorías de productos</p>
                </div>
                <div className="page-header-right">
                    <Button variant="primary" onClick={() => handleOpenModal()}>
                        ➕ Nueva Categoría
                    </Button>
                </div>
            </div>

            <div className="data-page-filters">
                <SearchBox
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Buscar categorías..."
                />
            </div>

            <Table
                columns={columns}
                data={filteredCategories}
                loading={loading}
                emptyMessage="No se encontraron categorías"
            />

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(Number(page))}
            />

            <Modal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                title={selectedCategory ? 'Editar Categoría' : 'Nueva Categoría'}
                footer={
                    <>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={handleSubmit} loading={formLoading}>
                            {selectedCategory ? 'Guardar Cambios' : 'Crear Categoría'}
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit}>
                    <Input
                        label="Nombre de la Categoría"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        error={formErrors.name}
                        placeholder="Ej: Electrónicos"
                    />


                    <div className="form-group">
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

export default Categories;
