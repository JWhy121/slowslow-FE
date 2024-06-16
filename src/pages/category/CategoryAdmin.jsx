import React, { useEffect, useState } from 'react';
import Modal from '../../components/Modal';
import Form from '../../components/Form';
import CategoryDelete from './CategoryDelete';
import { Fab, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

const CategoryListAdmin = () => {
    const [categories, setCategories] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteCategoryId, setDeleteCategoryId] = useState(null);
    const [categoryToEdit, setCategoryToEdit] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8080/category/all')
            .then(response => response.json())
            .then(data => setCategories(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    const handleAddCategory = (categoryName) => {
        fetch('http://localhost:8080/category/post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ categoryName }),
        })
        .then(response => response.json())
        .then(newCategory => {
            setCategories([...categories, newCategory]);
            setShowAddModal(false);
        })
        .catch(error => console.error('Error adding category:', error));
    };

    const handleUpdateCategory = (categoryName) => {
        fetch(`http://localhost:8080/category/edit/${categoryToEdit.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ categoryName }),
        })
        .then(response => response.json())
        .then(updatedCategory => {
            setCategories(categories.map(category => (category.id === updatedCategory.id ? updatedCategory : category)));
            setShowEditModal(false);
        })
        .catch(error => console.error('Error updating category:', error));
    };

    const handleDeleteCategory = () => {
        fetch(`http://localhost:8080/category/delete/${deleteCategoryId}`, {
            method: 'DELETE',
        })
        .then(() => {
            setCategories(categories.filter(category => category.id !== deleteCategoryId));
            setShowDeleteModal(false);
        })
        .catch(error => console.error('Error deleting category:', error));
    };

    return (
        <div>
            <div className="category-list">
                <div className="category-header">
                    <h2>카테고리 목록 - 관리자 화면</h2>
                    <Fab color="primary" aria-label="add" onClick={() => setShowAddModal(true)}>
                        <AddIcon />
                    </Fab>
                </div>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>카테고리명</TableCell>
                                <TableCell>수정</TableCell>
                                <TableCell>삭제</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {categories.map(category => (
                                <TableRow key={category.id}>
                                    <TableCell>{category.id}</TableCell>
                                    <TableCell>{category.categoryName}</TableCell>
                                    <TableCell>
                                        <Button onClick={() => {
                                            setCategoryToEdit(category);
                                            setShowEditModal(true);
                                        }}>수정</Button>
                                    </TableCell>
                                    <TableCell>
                                        <Button onClick={() => {
                                            setDeleteCategoryId(category.id);
                                            setShowDeleteModal(true);
                                        }}>삭제</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <Modal 
                    show={showAddModal}
                    title="카테고리 추가"
                    onClose={() => setShowAddModal(false)}
                >
                    <Form 
                        initialValue=""
                        onSave={handleAddCategory}
                        onClose={() => setShowAddModal(false)}
                    />
                </Modal>
                <Modal
                    show={showEditModal}
                    title="카테고리 수정"
                    onClose={() => setShowEditModal(false)}
                >
                    <Form
                        initialValue={categoryToEdit ? categoryToEdit.categoryName : ''}
                        onSave={handleUpdateCategory}
                        onClose={() => setShowEditModal(false)}
                    />
                </Modal>
                <CategoryDelete
                    show={showDeleteModal}
                    onClose={() => setShowDeleteModal(false)}
                    onConfirm={handleDeleteCategory}
                />
            </div>
        </div>
    );
};

export default CategoryListAdmin;