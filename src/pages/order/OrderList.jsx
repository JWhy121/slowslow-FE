import React, { useEffect, useState, useContext } from 'react';
import {
    Container,
    Typography,
    CircularProgress,
    Divider,
    Pagination,
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';
import axios from 'axios';
import { AuthContext } from '../user/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import SvgIcon from '@mui/material/SvgIcon';

function HomeIcon(props) {
    return (
        <SvgIcon {...props}>
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </SvgIcon>
    );
}

const OrderList = () => {
    const { id, isLoggedIn, role, username } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 3;
    const navigate = useNavigate();
    const location = useLocation();

    const isCurrentPage = (path) => {
        return location.pathname === path;
    };

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        console.log('Stored Token:', storedToken);
        if (storedToken) {
            axios
                .get('http://localhost:8080/api/v1/mypage/orders', {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `${storedToken}`,
                    },
                })
                .then((response) => {
                    const data = response.data;
                    const sortedData = data.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
                    setOrders(sortedData);
                })
                .catch((error) => {
                    setError(error);
                    console.error('There was an error!', error);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            navigate('/login');
        }
    }, [navigate]);

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return (
            <Typography variant="h6" color="error">
                오류가 발생했습니다: {error.message}
            </Typography>
        );
    }

    const indexOfLastOrder = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const formatNumber = (num) => {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    };

    return (
        <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'row' }}>
            {/* 왼쪽 메뉴 */}
            <Box sx={{ width: 200, bgcolor: 'background.paper', position: 'relative' }}>
                <Box className="bucket-list-header">
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
                        <HomeIcon color="white" />
                        마이페이지
                    </Typography>
                </Box>
                <List component="nav">
                    <ListItem
                        button
                        onClick={() => navigate('/mypage')}
                        sx={{
                            backgroundColor: isCurrentPage('/mypage') ? '#586555' : 'transparent',
                            color: isCurrentPage('/mypage') ? 'common.white' : 'inherit',
                            '&:hover': {
                                backgroundColor: isCurrentPage('/mypage') ? '#6d7b77' : '#f0f0f0',
                            },
                        }}
                    >
                        <ListItemText primary="회원정보" />
                    </ListItem>
                    <ListItem
                        button
                        onClick={() => navigate('/mypage/orders')}
                        sx={{
                            backgroundColor: isCurrentPage('/mypage/orders') ? '#586555' : 'transparent',
                            color: isCurrentPage('/mypage/orders') ? 'common.white' : 'inherit',
                            '&:hover': {
                                backgroundColor: isCurrentPage('/mypage/orders') ? '#6d7b77' : '#f0f0f0',
                            },
                        }}
                    >
                        <ListItemText primary="주문목록" />
                    </ListItem>
                    <ListItem
                        button
                        onClick={() => navigate('/checkPasswordForDelete')}
                        sx={{
                            backgroundColor: isCurrentPage('/checkPasswordForDelete') ? '#586555' : 'transparent',
                            color: isCurrentPage('/checkPasswordForDelete') ? 'common.white' : 'inherit',
                            '&:hover': {
                                backgroundColor: isCurrentPage('/checkPasswordForDelete') ? '#6d7b77' : '#f0f0f0',
                            },
                        }}
                    >
                        <ListItemText primary="회원탈퇴" />
                    </ListItem>
                </List>
            </Box>

            {/* 오른쪽 컨텐츠 */}
            <Box sx={{ flexGrow: 1, mt: 3 }}>
                <Container maxWidth="md">
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Box sx={{ fontSize: 27, fontWeight: 'bold' }}>주문목록</Box>
                        </Grid>
                        <Grid item xs={6}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    alignItems: 'flex-end',
                                    gap: 1,
                                    height: '100%',
                                }}
                            >
                                <Box sx={{ fontSize: 20, fontWeight: 'bold', color: 'rgb(195, 195, 195)' }}>
                                    마이페이지 &gt;
                                </Box>
                                <Box sx={{ fontSize: 20, fontWeight: 'bold', color: `black` }}>주문목록</Box>
                            </Box>
                        </Grid>
                    </Grid>
                    <Divider sx={{ backgroundColor: 'rgba(128, 128, 128, 0.8)', width: '100%', mb: 2 }} />
                    {currentOrders.length > 0 ? (
                        <>
                            {currentOrders.map((order) => (
                                <Card key={order.id} sx={{ mb: 3 }}>
                                    <CardContent>
                                        <Grid container spacing={2} alignItems="center">
                                            <Grid
                                                item
                                                xs={12}
                                                sm={3}
                                                container
                                                direction="column"
                                                justifyContent="space-between"
                                            >
                                                <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
                                                    <Typography
                                                        variant="subtitle2"
                                                        sx={{ color: 'gray', marginRight: '8px' }}
                                                    >
                                                        {String(order.id).padStart(5, '0')}
                                                    </Typography>
                                                    <Typography variant="h6">
                                                        {new Date(order.createdDate).toLocaleDateString()}
                                                    </Typography>
                                                </Box>
                                                <Button
                                                    variant="contained"
                                                    sx={{
                                                        backgroundColor: '#586555',
                                                        color: '#ffffff',
                                                        fontWeight: 'bold',
                                                        borderRadius: '8px',
                                                        boxShadow: 'none',
                                                        margin: '0 16px',
                                                        padding: '8px 16px',
                                                        '&:hover': {
                                                            backgroundColor: '#82957E',
                                                        },
                                                    }}
                                                    onClick={() => navigate(`/mypage/orders/${order.id}`)}
                                                >
                                                    주문상세 조회
                                                </Button>
                                            </Grid>
                                            <Grid
                                                item
                                                xs={12}
                                                sm={6}
                                                container
                                                justifyContent="center"
                                                alignItems="center"
                                            >
                                                {order.orderDetails.map((detail) => (
                                                    <Box key={detail.id} mx={1} textAlign="center">
                                                        <img
                                                            src={detail.orderImg}
                                                            alt={detail.productName}
                                                            style={{ width: '100px', height: '100px' }}
                                                        />
                                                        <Typography variant="body2">{detail.productName}</Typography>
                                                    </Box>
                                                ))}
                                            </Grid>
                                            <Grid
                                                item
                                                xs={12}
                                                sm={3}
                                                container
                                                direction="column"
                                                justifyContent="flex-end"
                                            >
                                                <Typography variant="h5" align="right">
                                                    <Box
                                                        component="span"
                                                        sx={{ fontWeight: 'bold', marginRight: '2px' }}
                                                    >
                                                        {formatNumber(order.totalPrice)}
                                                    </Box>
                                                    <Box component="span" sx={{ fontSize: '0.875rem' }}>
                                                        원
                                                    </Box>
                                                </Typography>
                                                <Box mt={2}>
                                                    <Typography
                                                        variant="body2"
                                                        align="right"
                                                        sx={{
                                                            color:
                                                                order.status === 'CANCELLED' ||
                                                                order.status === 'FAILED'
                                                                    ? 'darkred'
                                                                    : 'black',
                                                        }}
                                                    >
                                                        {order.status === 'PENDING' && '상품준비중'}
                                                        {order.status === 'SHIPPING' && '배송중'}
                                                        {order.status === 'CANCELLED' && '취소 완료'}
                                                        {order.status === 'COMPLETED' && '배송 완료'}
                                                        {order.status === 'FAILED' && '주문 실패'}
                                                    </Typography>
                                                </Box>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            ))}
                            <Box display="flex" justifyContent="center" mt={3}>
                                <Pagination
                                    count={Math.ceil(orders.length / ordersPerPage)}
                                    page={currentPage}
                                    onChange={handlePageChange}
                                    sx={{
                                        '& .MuiPaginationItem-root': {
                                            color: '#000000',
                                            '&:hover': {
                                                backgroundColor: '#82957E',
                                                color: '#ffffff',
                                            },
                                        },
                                        '& .MuiPaginationItem-previousNext': {
                                            color: '#000000',
                                        },
                                        '& .MuiPaginationItem-root.Mui-selected': {
                                            backgroundColor: '#586555',
                                            color: '#ffffff',
                                        },
                                    }}
                                />
                            </Box>
                        </>
                    ) : (
                        <Typography variant="h6">주문 내역이 없습니다.</Typography>
                    )}
                </Container>
            </Box>
        </Box>
    );
};

export default OrderList;
