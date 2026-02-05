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
import productService from '../services/productService';
import categoryService from '../services/categoryService';
import inventoryService from '../services/inventoryService';
import authService from '../services/authService';

const Products = () => {
    const {getCurrentUser} = authService;
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [inventories, setInventories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const sizeElementByPage = 10;

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [formLoading, setFormLoading] = useState(false);
    var categorySelected;

    const defatultFormData = {
        id: '',
        name: '',
        description: '',
        quantity: '',
        serialNumber: '',
        batch: '',
        active: true,
        createdByUserId: '',
        categories: [],
        inventory: '',
    }

    const [formData, setFormData] = useState(defatultFormData);
    const [formErrors, setFormErrors] = useState({});

    const toast = useToast();

    useEffect(() => {
        fetchProducts();
        fetchCategories();
        fetchInventories();
    }, [currentPage]);


    const addNewCategory = (selectedId) => {
        const category = categories.find(
            (c) => c.id.toString() === selectedId.toString()
        );
        if (!category) return;

        setFormData((prev) => ({
            ...prev,
            categories: prev.categories.some((c) => c.id === category.id)
            ? prev.categories
            : [...prev.categories, category],
        }));
    };


    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await productService.getAll({ page: currentPage - 1, size: sizeElementByPage });
            const productList = Array.isArray(response) ? response : response.data || [];
            setProducts(productList);
            setTotalPages(response.totalPages || 1);
        } catch (error) {
            // Demo data
            setProducts([
                { id: 1, name: 'Laptop Dell XPS', description: 'Laptop de alto rendimiento', quantity: 15, serialNumber: 'DELL-001', batch: 1, active: true, createDate: '2024-01-15' },
                { id: 2, name: 'Monitor Samsung 27"', description: 'Monitor 4K UHD', quantity: 30, serialNumber: 'SAM-002', batch: 2, active: true, createDate: '2024-01-14' },
                { id: 3, name: 'Teclado Mecánico RGB', description: 'Teclado gaming', quantity: 50, serialNumber: 'KEY-003', batch: 1, active: true, createDate: '2024-01-13' },
                { id: 4, name: 'Mouse Logitech', description: 'Mouse inalámbrico', quantity: 100, serialNumber: 'LOG-004', batch: 3, active: false, createDate: '2024-01-12' },
                { id: 5, name: 'Webcam HD', description: 'Cámara 1080p', quantity: 25, serialNumber: 'CAM-005', batch: 1, active: true, createDate: '2024-01-11' },
            ]);
            setTotalPages(1);
        }
        setLoading(false);
    };

    const fetchCategories = async () => {
        try {
            const response = await categoryService.getAll({ page: currentPage - 1, size: sizeElementByPage });
            console.log("categorias: ", response)
            const categoryList = Array.isArray(response) ? response : response.data || [];
            setCategories(categoryList);
        } catch (error) {
            setCategories([
                { id: 1, name: 'Electrónicos' },
                { id: 2, name: 'Accesorios' },
                { id: 3, name: 'Periféricos' },
            ]);
        }
    };



    const fetchInventories = async () => {
        try {
            const response = await inventoryService.getAll({ page: currentPage - 1, size: sizeElementByPage });
            const inventoryList = Array.isArray(response) ? response : response.data || [];
            setInventories(inventoryList);
        } catch (error) {
            setInventories([
                { id: 1, name: 'Almacén Principal' },
                { id: 2, name: 'Bodega Sur' },
            ]);
        }
    };

    const handleOpenModal = (product = null) => {
        if (product) {
            setSelectedProduct(product);
            console.log("id pro: ", product.inventory.id)
            setFormData({
                name: product.name || '',
                description: product.description || '',
                quantity: product.quantity || '',
                serialNumber: product.serialNumber || '',
                batch: product.batch || '',
                active: product.active || false,
                categories: product.category || [],
                createdByUserId:  product.createdByUserId || '',
                inventory: product.inventory.id || '',
            });
        } else {
            setSelectedProduct(null);
            setFormData(defatultFormData);
        }
        setFormErrors({});
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedProduct(null);
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
        if (!formData.quantity) errors.quantity = 'La cantidad es requerida';
        if (formData.quantity && formData.quantity < 0) errors.quantity = 'La cantidad debe ser mayor o igual a 0';
        if (!formData.inventory) errors.inventory = 'Porfavor indique el inventario';


        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setFormLoading(true);
        try {
            const data = {
                ...formData,
                quantity: parseInt(formData.quantity),
                batch: formData.batch ? parseInt(formData.batch) : null,
            };

            if (selectedProduct) {
                data.id = selectedProduct.id;
                await productService.update(data);
                toast.success('Éxito', 'Producto actualizado correctamente');
            } else {
                const actualUser = await getCurrentUser();
                data.createdByUserId = actualUser.id;

                await productService.create(data);
                toast.success('Éxito', 'Producto creado correctamente');
            }
            handleCloseModal();
            fetchProducts();
        } catch (error) {
            toast.error('Error', error.response?.data?.message || 'Error al guardar el producto');
        }
        setFormLoading(false);
    };

    const handleDelete = async () => {
        try {
            await productService.delete(selectedProduct.id);
            toast.success('Éxito', 'Producto eliminado correctamente');
            setIsDeleteDialogOpen(false);
            setSelectedProduct(null);
            fetchProducts();
        } catch (error) {
            toast.error('Error', 'Error al eliminar el producto');
        }
    };

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const columns = [
        { key: 'name', title: 'Nombre' },
        { key: 'serialNumber', title: 'N° Serie' },
        { key: 'quantity', title: 'Cantidad' },
        { key: 'batch', title: 'Lote' },
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
            render: (_, product) => (
                <div className="table-actions">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenModal(product)}
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
                    <h1 className="page-title">Productos</h1>
                    <p className="page-subtitle">Gestiona todos los productos del inventario</p>
                </div>
                <div className="page-header-right">
                    <Button variant="primary" onClick={() => handleOpenModal()}>
                        ➕ Nuevo Producto
                    </Button>
                </div>
            </div>

            <div className="data-page-filters">
                <SearchBox
                    value={searchTerm}
                    onChange={setSearchTerm}
                    placeholder="Buscar productos..."
                />
            </div>

            <Table
                columns={columns}
                data={filteredProducts}
                loading={loading}
                emptyMessage="No se encontraron productos"
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
                title={selectedProduct ? 'Editar Producto' : 'Nuevo Producto'}
                size="lg"
                footer={
                    <>
                        <Button variant="secondary" onClick={handleCloseModal}>
                            Cancelar
                        </Button>
                        <Button variant="primary" onClick={handleSubmit} loading={formLoading}>
                            {selectedProduct ? 'Guardar Cambios' : 'Crear Producto'}
                        </Button>
                    </>
                }
            >
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <Input
                            label="Nombre"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            error={formErrors.name}
                            placeholder="Nombre del producto"
                        />

                        <Input
                            type="textarea"
                            label="Descripción"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Descripción del producto"
                        />
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <Input
                                type="number"
                                label="Cantidad"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                error={formErrors.quantity}
                                placeholder="0"
                                min="0"
                            />

                            <Input
                                label="N° Serie"
                                name="serialNumber"
                                value={formData.serialNumber}
                                onChange={handleChange}
                                placeholder="ABC-123"
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <Input
                                type="number"
                                label="Lote"
                                name="batch"
                                value={formData.batch}
                                onChange={handleChange}
                                placeholder="1"
                                min="1"
                            />

                            <Select
                                label="Inventario"
                                name="inventory"
                                value={formData.inventory || ""}
                                onChange={handleChange}
                                options={inventories.map((inv) => ({
                                    value: inv.id,
                                    label: inv.name,
                                }))}
                                placeholder="Seleccionar inventario"
                            />

                            <p style = {{color: '#ed4444'}}>{formErrors.inventory}</p>
                        </div>

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

                        
                        {/* Select para agregar categoría */}
                        <Select
                        label="Agregar categoria"
                        name="categoryId"
                        value={categorySelected?.id || ""}
                        onChange={(e) => addNewCategory(e.target.value)}
                        options={categories.map((inv) => ({
                            value: inv.id,
                            label: inv.name,
                        }))}
                        placeholder="Categorias Disponibles"
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
                        <h4 style={{ marginBottom: "0.75rem" }}>Categorias seleccionadas</h4>

                        <ul
                            style={{
                            listStyle: "none",
                            padding: 0,
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                            gap: "0.75rem",
                            }}
                        >
                            {formData.categories?.map((item) => (
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
                                    setFormData((prev) => ({
                                    ...prev,
                                    categories: prev.categories.filter(
                                        (cat) => cat.id !== item.id
                                    ),
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
                    </div>
                </form>
            </Modal>

            {/* Diálogo de confirmación */}
            <ConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                onConfirm={handleDelete}
                title="Eliminar Producto"
                message={`¿Estás seguro de que deseas eliminar "${selectedProduct?.name}"? Esta acción no se puede deshacer.`}
            />
        </div>
    );
};

export default Products;
