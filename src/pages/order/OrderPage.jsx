import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    CircularProgress,
    Box,
    Grid,
    TextField,
    Button,
    Divider,
    Checkbox,
    FormControlLabel,
    Card,
    CardContent,
    FormControl,
    FormGroup,
} from '@mui/material';
import { styled } from '@mui/system';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from '../user/AuthContext';

const getCartData = () => {
    return JSON.parse(localStorage.getItem('orders')) || [];
};

const StyledContainer = styled(Container)({
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
});

const SectionTitle = styled(Typography)({
    fontWeight: 'bold',
    fontSize: '1.5rem',
    marginBottom: '1rem',
    borderBottom: '2px solid #ccc',
    paddingBottom: '0.5rem',
});

const FormSection = styled(Box)({
    marginBottom: '2rem',
});

const OrderPage = () => {
    const { isLoggedIn, role, username } = useContext(AuthContext);
    const navigate = useNavigate();
    const [orderPageData, setOrderPageData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        orderName: '',
        orderTel: '',
        orderEmail: '',
        shipName: '',
        shipTel: '',
        shipAddr: '',
        shipReq: '',
    });
    const [paymentMethod, setPaymentMethod] = useState('');
    const [agreementConfirmed, setAgreementConfirmed] = useState({
        personalInfo: false,
        orderAgreement: false,
    });

    useEffect(() => {
        const fetchOrderPage = async () => {
            try {
                const storedToken = localStorage.getItem('token');

                if (storedToken) {
                    const response = await axios.get('http://localhost:8080/api/v1/mypage', {
                        headers: {
                            Authorization: `${storedToken}`,
                        },
                    });
                    const userData = response.data;

                    const cartData = getCartData();
                    const totalPrice = cartData.reduce((total, item) => total + item.productCnt * item.productPrice, 0);

                    const data = {
                        orderDetails: cartData,
                        totalPrice,
                    };

                    setOrderPageData(data);
                    setFormData((prevFormData) => ({
                        ...prevFormData,
                        orderName: userData.name,
                        orderTel: userData.phoneNumber,
                        orderEmail: userData.username,
                        shipName: userData.name,
                        shipTel: userData.phoneNumber,
                        shipAddr: '',
                        shipReq: '배송 전 연락 바랍니다.',
                    }));
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrderPage();
    }, []);

    // useEffect(() => {
    //     const fetchOrderPage = () => {
    //         try {
    //             const cartData = getCartData();
    //             const totalPrice = cartData.reduce((total, item) => total + item.productCnt * item.productPrice, 0);

    //             const data = {
    //                 orderDetails: cartData,
    //                 totalPrice,
    //             };

    //             setOrderPageData(data);
    //             setFormData((prevFormData) => ({
    //                 ...prevFormData,
    //                 orderName: '',
    //                 orderTel: '',
    //                 orderEmail: '',
    //                 shipName: '',
    //                 shipTel: '',
    //                 shipAddr: '',
    //                 shipReq: '',
    //             }));
    //         } catch (err) {
    //             setError(err.message);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchOrderPage();
    // }, []);

    const handleSubmitOrder = async () => {
        const storedToken = localStorage.getItem('token');
        if (!storedToken) {
            alert('로그인이 필요합니다.');
            return;
        }

        if (!paymentMethod || !agreementConfirmed.personalInfo || !agreementConfirmed.orderAgreement) {
            alert('결제 수단과 주문자 동의에 체크해주세요.');
            return;
        }

        let userId = null;
        try {
            const decodedToken = jwtDecode(storedToken);
            console.log(decodedToken); // 디코딩된 토큰 구조를 확인
            userId = decodedToken.id; // 필요한 필드를 확인 후 수정
        } catch (error) {
            console.error('Invalid token structure', error);
            alert('유효하지 않은 토큰입니다.');
            return;
        }

        const orderData = {
            ...formData,
            userId,
            orderDetails: orderPageData.orderDetails,
            totalPrice: orderPageData.totalPrice,
        };

        console.log('Submitting order with data:', orderData);

        try {
            const response = await axios.post(
                `http://localhost:8080/orders?paymentConfirmed=true&agreementConfirmed=true`,
                orderData,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `${storedToken}`,
                    },
                }
            );

            navigate('/orders/success');
        } catch (err) {
            if (err.response && err.response.status === 500) {
                navigate('/orders/failure');
            } else {
                alert('주문 중 오류가 발생했습니다: ' + err.message);
            }
        }
    };

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handlePaymentChange = (e) => {
        setPaymentMethod(e.target.name);
    };

    const handleAgreementChange = (e) => {
        setAgreementConfirmed({
            ...agreementConfirmed,
            [e.target.name]: e.target.checked,
        });
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return (
            <Typography variant="h6" color="error">
                오류가 발생했습니다: {error}
            </Typography>
        );
    }

    const shippingFee = orderPageData.totalPrice >= 50000 ? 0 : 3000;

    return (
        <Container maxWidth="md">
            <Typography sx={{ fontWeight: 'bold', fontSize: '1.7rem' }} mb={1} ml={5}>
                주문서
            </Typography>
            <Divider sx={{ backgroundColor: 'rgba(128, 128, 128, 0.8)', width: '100%', mb: 2 }} />
            <StyledContainer maxWidth="md">
                <FormSection>
                    <SectionTitle variant="h6">주문 목록</SectionTitle>
                    <Card variant="outlined">
                        <CardContent sx={{ px: 4 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    {orderPageData.orderDetails.map((detail) => (
                                        <Box display="flex" alignItems="center" mb={2} key={detail.productId}>
                                            <img
                                                src={detail.orderImg}
                                                alt={detail.productName}
                                                style={{
                                                    width: '100px',
                                                    height: '100px',
                                                    borderRadius: '8px',
                                                    marginRight: '1rem',
                                                }}
                                            />
                                            <Box>
                                                <Typography variant="body1" fontWeight="bold">
                                                    {detail.productName}
                                                </Typography>
                                                <Typography variant="body2">수량: {detail.productCnt}</Typography>
                                                <Typography variant="body2">
                                                    {detail.productPrice.toLocaleString()}원
                                                </Typography>
                                            </Box>
                                        </Box>
                                    ))}
                                </Grid>
                                <Grid item xs={4} container direction="column" justifyContent="center">
                                    <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
                                        주문 금액
                                    </Typography>
                                    <Divider sx={{ my: 1 }} />
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        총 상품 가격:{' '}
                                        <Box component="span" sx={{ fontWeight: 'bold' }}>
                                            {orderPageData.totalPrice.toLocaleString()}원
                                        </Box>
                                    </Typography>
                                    <Typography variant="body1" sx={{ mb: 2 }}>
                                        총 배송비:{' '}
                                        <Box component="span" sx={{ fontWeight: 'bold' }}>
                                            +{shippingFee.toLocaleString()}원
                                        </Box>
                                    </Typography>
                                    <Divider sx={{ my: 1 }} />
                                    <Typography variant="h6" sx={{ mb: 2 }}>
                                        최종 결제 금액:{' '}
                                        <Box component="span" sx={{ fontWeight: 'bold', fontSize: '1.2rem' }}>
                                            {(orderPageData.totalPrice + shippingFee).toLocaleString()}원
                                        </Box>
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: '#586555', fontWeight: 'bold' }}>
                                        50,000원 이상 구매시 배송비 무료
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </FormSection>
                <FormSection>
                    <SectionTitle variant="h6">주문자 정보</SectionTitle>
                    <TextField
                        fullWidth
                        label="이름"
                        name="orderName"
                        value={formData.orderName}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="연락처"
                        name="orderTel"
                        value={formData.orderTel}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="이메일"
                        name="orderEmail"
                        value={formData.orderEmail}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                    />
                </FormSection>
                <FormSection>
                    <SectionTitle variant="h6">배송지 정보</SectionTitle>
                    <TextField
                        fullWidth
                        label="이름"
                        name="shipName"
                        value={formData.shipName}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="연락처"
                        name="shipTel"
                        value={formData.shipTel}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="주소"
                        name="shipAddr"
                        value={formData.shipAddr}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        fullWidth
                        label="요청사항"
                        name="shipReq"
                        value={formData.shipReq}
                        onChange={handleInputChange}
                        sx={{ mb: 2 }}
                    />
                </FormSection>
                <FormSection>
                    <SectionTitle variant="h6">결제 정보</SectionTitle>
                    <FormControl component="fieldset">
                        <FormGroup row>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={paymentMethod === 'kakaopay'}
                                        onChange={handlePaymentChange}
                                        name="kakaopay"
                                        color="primary"
                                    />
                                }
                                label="카카오페이"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={paymentMethod === 'creditcard'}
                                        onChange={handlePaymentChange}
                                        name="creditcard"
                                        color="primary"
                                    />
                                }
                                label="신용카드"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={paymentMethod === 'phone'}
                                        onChange={handlePaymentChange}
                                        name="phone"
                                        color="primary"
                                    />
                                }
                                label="휴대폰 결제"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={paymentMethod === 'account'}
                                        onChange={handlePaymentChange}
                                        name="account"
                                        color="primary"
                                    />
                                }
                                label="실시간 계좌이체"
                            />
                        </FormGroup>
                    </FormControl>
                </FormSection>
                <FormSection>
                    <SectionTitle variant="h6">주문자 동의</SectionTitle>
                    <FormControl component="fieldset">
                        <FormGroup>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={agreementConfirmed.personalInfo}
                                        onChange={handleAgreementChange}
                                        name="personalInfo"
                                        color="primary"
                                    />
                                }
                                label="개인정보 수집 이용"
                            />
                            <Typography variant="body2" sx={{ ml: 4 }}>
                                주문자 정보(연락처, 이메일) / 배송지 정보(이름, 연락처, 주소) / 관계 법령에 따라 5년간
                                보관
                            </Typography>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        checked={agreementConfirmed.orderAgreement}
                                        onChange={handleAgreementChange}
                                        name="orderAgreement"
                                        color="primary"
                                    />
                                }
                                label="주문 동의"
                            />
                            <Typography variant="body2" sx={{ ml: 4 }}>
                                주문 / 결제 정보를 확인하여 구매 진행에 동의합니다.
                            </Typography>
                        </FormGroup>
                    </FormControl>
                </FormSection>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ backgroundColor: '#E5F4E3', padding: '1rem', borderRadius: '8px' }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        최종 결제 금액:{' '}
                        <Box component="span" sx={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
                            {(orderPageData.totalPrice + shippingFee).toLocaleString()}원
                        </Box>
                    </Typography>
                </Box>
                <Box display="flex" justifyContent="center" mt={4}>
                    <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        sx={{
                            backgroundColor: '#586555',
                            color: '#ffffff',
                            fontWeight: 'bold',
                            borderRadius: '8px',
                            boxShadow: 'none',
                            '&:hover': {
                                backgroundColor: '#82957E',
                            },
                        }}
                        onClick={handleSubmitOrder}
                        disabled={
                            !paymentMethod || !agreementConfirmed.personalInfo || !agreementConfirmed.orderAgreement
                        }
                    >
                        주문하기
                    </Button>
                </Box>
            </StyledContainer>
        </Container>
    );
};

export default OrderPage;
