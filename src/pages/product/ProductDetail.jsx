import React, { useState, useEffect, useContext } from 'react'; // useContext 추가
import { Link, useParams, useNavigate } from 'react-router-dom'; // useNavigate 추가
import { Container, Typography, Divider, Button, Grid, Card, CardContent, CardMedia, TextField } from '@mui/material';
import { AuthContext } from '../user/AuthContext'; // AuthContext 임포트

const ProductDetail = () => {
    const { productId } = useParams();
    const navigate = useNavigate(); // 네비게이션 훅 사용
    const { isLoggedIn } = useContext(AuthContext); // AuthContext 사용
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1); // 기본 수량은 1로 설정

    const role = localStorage.getItem('role');

    useEffect(() => {
        fetch(`http://localhost:8080/product/${productId}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                setProduct(data);
                setLoading(false);
            })
            .catch((error) => {
                setError(error);
                setLoading(false);
            });
    }, [productId]);

    const handleQuantityChange = (event) => {
        const value = parseInt(event.target.value, 10);
        if (!isNaN(value) && value >= 1) {
            setQuantity(value);
        } else {
            setQuantity(1);
        }
    };

    const handleOrder = () => {
        if (role === 'ROLE_ADMIN') {
            alert('관리자는 주문이 불가능합니다.');
        } else if (isLoggedIn) {
            // 로그인 상태 확인
            // 제품 정보를 로컬스토리지에 저장
            const orderDetails = {
                productId: product.id,
                productName: product.name,
                orderImg: product.imageLink, // 이미지 링크 수정
                productCnt: quantity, // 수량 반영
                productPrice: product.price,
            };

            localStorage.setItem('orders', JSON.stringify([orderDetails]));

            // OrderPage로 이동
            navigate('/orders');
        } else {
            // 로그인 페이지로 이동
            navigate('/login');
        }

        console.log(`Ordered product ${product.name} with quantity ${quantity}`);
    };

    const handleAddToCart = () => {
        console.log(role);
        if (role === 'ROLE_ADMIN') {
            alert('관리자는 주문이 불가능합니다.');

            return false;
        }

        // 장바구니 추가 처리
        let storedOrders = JSON.parse(localStorage.getItem('orders')) || [];

        // 이미 장바구니에 담긴 상품인지 확인
        let isExist = storedOrders.some((order) => order.productId === product.id);

        if (isExist) {
            // 이미 담긴 상품이면 수량 추가
            let updatedOrders = storedOrders.map((order) =>
                order.productId === product.id ? { ...order, productCnt: order.productCnt + quantity } : order
            );
            localStorage.setItem('orders', JSON.stringify(updatedOrders));
        } else {
            // 장바구니에 새로 추가
            storedOrders.push({
                productId: product.id,
                productName: product.name,
                productCnt: quantity,
                productPrice: product.price,
                checked: true,
            });
            localStorage.setItem('orders', JSON.stringify(storedOrders));
        }

        alert(`"${product.name}"이(가) 장바구니에 ${quantity}개 추가되었습니다.`);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error loading product details: {error.message}</p>;
    }

    return (
        <Container>
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <Typography variant="h5" gutterBottom fontWeight="bold" letterSpacing={3} mt={3}>
                        {product.name} - {product.brandName} / {product.categoryName}
                    </Typography>
                    <Card>
                        <CardMedia component="img" height="400" image={product.imageLink} alt={product.name} />
                    </Card>
                </Grid>
                <Grid item xs={12} md={4}>
                    <Typography variant="body1" gutterBottom>
                        판매가 {product.price}원
                    </Typography>
                    <Divider style={{ margin: '20px 0' }} />
                    <TextField
                        type="number"
                        label="Quantity"
                        variant="outlined"
                        value={quantity}
                        onChange={handleQuantityChange}
                        inputProps={{ min: 1 }}
                        style={{ marginBottom: '20px' }}
                    />
                    <Typography variant="h6" gutterBottom fontWeight="bold">
                        Total {product.price * quantity}원
                    </Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleOrder} // 기존 handleOrder 함수 수정
                        fullWidth
                        style={{ marginBottom: '10px' }}
                        sx={{
                            bgcolor: '#586555',
                            '&:hover': {
                                backgroundColor: '#6d7b77',
                            },
                        }}
                    >
                        주문하기
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddToCart}
                        sx={{
                            bgcolor: '#586555',
                            color: '#fff',
                            '&:hover': {
                                backgroundColor: '#6d7b77',
                            },
                        }}
                        fullWidth
                    >
                        장바구니에 담기
                    </Button>
                </Grid>
            </Grid>
            <Divider style={{ margin: '20px 0' }} />
            {/* 설명 */}
            <Typography variant="body1">{product.description}</Typography>
            <Typography variant="body1"></Typography>
        </Container>
    );
};

export default ProductDetail;
