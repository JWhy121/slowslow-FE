import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Grid, Card, CardContent, CardMedia, Divider } from '@mui/material';

const BrandMainPage = () => {
    const { id: brandId } = useParams(); // useParams를 올바르게 사용
    const [products, setProducts] = useState([]);
    const [brands, setBrands] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // 브랜드 정보 가져오기
        fetch(`http://localhost:8080/brand/all`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                const brandsMap = {};
                data.forEach((brand) => {
                    brandsMap[brand.id] = brand.brandName;
                });
                setBrands(brandsMap);
            })
            .catch((error) => {
                setError(error);
            });

        // 해당 브랜드 또는 전체 상품 정보 가져오기
        fetch(brandId ? `http://localhost:8080/brand/${brandId}` : `http://localhost:8080/product/all`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                // 데이터 구조 확인 및 설정
                if (data.content) {
                    setProducts(data.content);
                } else {
                    setProducts(data);
                }
                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });
    }, [brandId]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error loading products: {error.message}</p>;
    }

    const getBrandName = (brandId) => {
        return brands[brandId] || '전체 상품';
    };

    const handleCardClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    return (
        <Container>
            <Typography
                variant="h5"
                gutterBottom
                fontWeight="bold"
                letterSpacing={3}
                marginTop={'20px'}
                marginBottom={'20px'}
            >
                {getBrandName(brandId)}
            </Typography>
            <Divider sx={{ backgroundColor: 'rgba(128, 128, 128, 0.8)', width: '100%', mb: 2 }} />
            {products.length > 0 ? (
                <Grid container spacing={4}>
                    {products.map((product) => (
                        <Grid item key={product.id} xs={12} sm={6} md={4}>
                            <Card onClick={() => handleCardClick(product.id)} style={{ cursor: 'pointer' }}>
                                <CardMedia component="img" height="140" image={product.imageLink} alt={product.name} />
                                <CardContent>
                                    <Typography gutterBottom variant="h6" component="div">
                                        {product.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {product.description}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        가격: {product.price}원
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography variant="body1">{getBrandName(brandId)} 브랜드에 속하는 상품이 없습니다.</Typography>
            )}
        </Container>
    );
};

export default BrandMainPage;
