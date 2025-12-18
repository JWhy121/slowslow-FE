import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { List, ListItem, ListItemText, TextField } from '@mui/material';

const BrandSidebar = () => {
    const { id } = useParams(); // 현재 URL의 id를 가져옴
    const [brands, setBrands] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchBrands = async () => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/brand/all`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setBrands(Array.isArray(data) ? data : []);
            } catch (error) {
                console.error('Error fetching brands:', error);
                setBrands([]);
            }
        };

        fetchBrands();
    }, []);

    const filteredBrands = brands.filter((brand) => brand.brandName.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div>
            <TextField
                label="브랜드 검색"
                variant="outlined"
                fullWidth
                margin="normal"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            <List>
                <ListItem
                    button
                    component={Link}
                    to={`/brand`}
                    selected={!id}
                    sx={{
                        backgroundColor: !id ? '#586555 !important' : 'transparent',
                        color: !id ? '#fff' : 'inherit',
                        '&:hover': {
                            backgroundColor: !id ? '#6d7b77' : '#f0f0f0',
                        },
                    }}
                >
                    <ListItemText primary="전체 보기" />
                </ListItem>
                {filteredBrands.map((brand) => (
                    <ListItem
                        key={brand.id}
                        button
                        component={Link}
                        to={`/brand/${brand.id}`}
                        selected={brand.id === parseInt(id)}
                        sx={{
                            backgroundColor: brand.id === parseInt(id) ? '#586555 !important' : 'transparent',
                            color: brand.id === parseInt(id) ? '#fff' : 'inherit',
                            '&:hover': {
                                backgroundColor: brand.id === parseInt(id) ? '#6d7b77' : '#f0f0f0',
                            },
                        }}
                    >
                        <ListItemText primary={brand.brandName} />
                    </ListItem>
                ))}
            </List>
        </div>
    );
};

export default BrandSidebar;
