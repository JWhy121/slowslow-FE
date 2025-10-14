import React, { useEffect, useState } from 'react';
import Modal from '../../components/Modal';
import Form from '../../components/Form';
import DeleteModal from '../../components/deleteModal';
import {
    Fab,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import '../../list-styles.css';

const BrandListAdmin = () => {
    const [brands, setBrands] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteBrandId, setDeleteBrandId] = useState(null);
    const [brandToEdit, setBrandToEdit] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8080/brand/all')
            .then((response) => response.json())
            .then((data) => setBrands(data))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    const handleAddBrand = (brandName) => {
        fetch('http://localhost:8080/admin/brand/post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ brandName }),
        })
            .then((response) => response.json())
            .then((newBrand) => {
                setBrands([...brands, newBrand]);
                setShowAddModal(false);
            })
            .catch((error) => console.error('Error adding brand:', error));
    };

    const handleUpdateBrand = (brandName) => {
        fetch(`http://localhost:8080/admin/brand/edit/${brandToEdit.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({ brandName }),
        })
            .then((response) => response.json())
            .then((updatedBrand) => {
                setBrands(brands.map((brand) => (brand.id === updatedBrand.id ? updatedBrand : brand)));
                setShowEditModal(false);
            })
            .catch((error) => console.error('Error updating brand:', error));
    };

    const handleDeleteBrand = () => {
        fetch(`http://localhost:8080/admin/brand/delete/${deleteBrandId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${localStorage.getItem('token')}`,
            },
        })
            .then(() => {
                setBrands(brands.filter((brand) => brand.id !== deleteBrandId));
                setShowDeleteModal(false);
            })
            .catch((error) => console.error('Error deleting brand:', error));
    };

    return (
        <div>
            <div className="brand-list">
                <div
                    className="brand-header"
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '20px',
                    }}
                >
                    <Typography sx={{ fontWeight: 'semibold', fontSize: '1.5rem' }}>
                        브랜드 목록 - 관리자 화면
                    </Typography>
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
                                <TableCell>브랜드명</TableCell>
                                <TableCell>수정</TableCell>
                                <TableCell>삭제</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {brands.map((brand) => (
                                <TableRow key={brand.id}>
                                    <TableCell>{brand.id}</TableCell>
                                    <TableCell>{brand.brandName}</TableCell>
                                    <TableCell>
                                        <Button
                                            onClick={() => {
                                                setBrandToEdit(brand);
                                                setShowEditModal(true);
                                            }}
                                        >
                                            수정
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <Button
                                            onClick={() => {
                                                setDeleteBrandId(brand.id);
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
                <Modal show={showAddModal} title="브랜드 추가" onClose={() => setShowAddModal(false)}>
                    <Form initialValue="" onSave={handleAddBrand} onClose={() => setShowAddModal(false)} />
                </Modal>
                <Modal show={showEditModal} title="브랜드 수정" onClose={() => setShowEditModal(false)}>
                    <Form
                        initialValue={brandToEdit ? brandToEdit.brandName : ''}
                        onSave={handleUpdateBrand}
                        onClose={() => setShowEditModal(false)}
                    />
                </Modal>
                <DeleteModal
                    show={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDeleteBrand}
                />
            </div>
        </div>
    );
};

export default BrandListAdmin;
