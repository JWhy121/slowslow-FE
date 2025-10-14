import React, { useEffect, useState } from 'react';
import Modal from '../../components/ProductModal';
import Form from '../../components/ProductForm';
import DeleteModal from '../../components/deleteModal';
import {
    Fab,
    Typography,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import '../../list-styles.css';

const ProductAdmin = () => {
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteProductId, setDeleteProductId] = useState(null);
    const [productToEdit, setProductToEdit] = useState(null);

    useEffect(() => {
        fetchProducts();
        fetchBrands();
        fetchCategories();
    }, []);

    const fetchProducts = () => {
        fetch('http://localhost:8080/product/all')
            .then((response) => response.json())
            .then((data) => {
                setProducts(data);
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
            });
    };

    const fetchBrands = () => {
        fetch('http://localhost:8080/brand/all')
            .then((response) => response.json())
            .then((data) => setBrands(data))
            .catch((error) => console.error('Error fetching brands:', error));
    };

    const fetchCategories = () => {
        fetch('http://localhost:8080/category/all')
            .then((response) => response.json())
            .then((data) => setCategories(data))
            .catch((error) => console.error('Error fetching categories:', error));
    };

    const handleAddProduct = (productDto) => {
        fetch('http://localhost:8080/admin/product/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(productDto),
        })
            .then((response) => response.json())
            .then((newProduct) => {
                setProducts([...products, newProduct]);
                setShowAddModal(false);
            })
            .catch((error) => console.error('Error adding product:', error));
    };

    const handleUpdateProduct = (productDto) => {
        fetch(`http://localhost:8080/admin/product/update/${productToEdit.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(productDto),
        })
            .then((response) => response.json())
            .then((updatedProduct) => {
                setProducts(products.map((product) => (product.id === updatedProduct.id ? updatedProduct : product)));
                setShowEditModal(false);
            })
            .catch((error) => console.error('Error updating product:', error));
    };

    const handleDeleteProduct = () => {
        fetch(`http://localhost:8080/admin/product/delete/${deleteProductId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${localStorage.getItem('token')}`,
            },
        })
            .then(() => {
                setProducts(products.filter((product) => product.id !== deleteProductId));
                setShowDeleteModal(false);
            })
            .catch((error) => console.error('Error deleting product:', error));
    };

    return (
        <div>
            <div className="product-list">
                <div
                    className="product-header"
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '20px',
                    }}
                >
                    <Typography sx={{ fontWeight: 'semibold', fontSize: '1.5rem' }}>제품 목록 - 관리자 화면</Typography>
                    <Fab
                        sx={{
                            backgroundColor: '#586555',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: '#3a4338',
                            },
                            zIndex: 0,
                        }}
                        aria-label="add"
                        onClick={() => setShowAddModal(true)}
                    >
                        <AddIcon />
                    </Fab>
                </div>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>이름</TableCell>
                                <TableCell>가격</TableCell>
                                <TableCell>설명</TableCell>
                                <TableCell>브랜드</TableCell>
                                <TableCell>카테고리</TableCell>
                                <TableCell>이미지</TableCell>
                                <TableCell>수정</TableCell>
                                <TableCell>삭제</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {products.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell>{product.id}</TableCell>
                                    <TableCell>{product.name}</TableCell>
                                    <TableCell>{product.price}</TableCell>
                                    <TableCell>{product.description}</TableCell>
                                    <TableCell>{product.brandName}</TableCell>
                                    <TableCell>{product.categoryName}</TableCell>
                                    <TableCell>
                                        <img
                                            src={product.imageLink}
                                            alt={product.name}
                                            style={{ width: '100px', height: 'auto' }}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            onClick={() => {
                                                setProductToEdit(product);
                                                setShowEditModal(true);
                                            }}
                                        >
                                            수정
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            onClick={() => {
                                                setDeleteProductId(product.id);
                                                setShowDeleteModal(true);
                                            }}
                                        >
                                            삭제
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Modal
                    show={showAddModal}
                    title="제품 추가"
                    onClose={() => setShowAddModal(false)}
                    onSave={handleAddProduct}
                    brands={brands}
                    categories={categories}
                />
                <Modal
                    show={showEditModal}
                    title="제품 수정"
                    onClose={() => setShowEditModal(false)}
                    onSave={handleUpdateProduct}
                    initialValue={productToEdit}
                    brands={brands}
                    categories={categories}
                />
                <DeleteModal
                    show={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDeleteProduct}
                />
            </div>
        </div>
    );
};
export default ProductAdmin;
