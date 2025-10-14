import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Divider, Grid, Card, CardContent, CardMedia } from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import LatestProducts from '../product/LatestProducts';
import LatestModifiedProducts from '../product/LatestModifiedProducts';

const Home = () => {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
    };
    const navigate = useNavigate();

    const banners = [
        'https://www.ocamall.com/design/ocamall/2022_renew/img/PC1.jpg',
        'https://img.autocamping.co.kr/event/2023/20231019SHELTER.jpg',
        'https://img.autocamping.co.kr/event/2022/event_0721.jpg',
    ];

    const [latestProducts, setLatestProducts] = useState([]);
    const [modifiedProducts, setModifiedProducts] = useState([]);

    useEffect(() => {
        const fetchLatestProducts = async () => {
            try {
                const response = await fetch('http://localhost:8080/product/latest');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setLatestProducts(data); // 서버에서 받은 최신 상품 리스트를 상태에 설정
            } catch (error) {
                console.error('Error fetching latest products:', error);
            }
        };

        fetchLatestProducts();
    }, []);

    useEffect(() => {
        const fetchModifiedProducts = async () => {
            try {
                const response = await fetch('http://localhost:8080/product/modify');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setModifiedProducts(data); // 서버에서 받은 최신 상품 리스트를 상태에 설정
            } catch (error) {
                console.error('Error fetching latest products:', error);
            }
        };

        fetchModifiedProducts();
    }, []);

    const handleCardClick = (productId) => {
        navigate(`/product/${productId}`);
    };

    return (
        <Box px={5}>
            <Divider sx={{ backgroundColor: 'rgba(128, 128, 128, 0.3)', width: '100%', mb: 2 }} />
            <Slider {...settings}>
                {banners.map((banner, index) => (
                    <Box
                        key={index}
                        component="img"
                        src={banner}
                        alt={`Banner ${index + 1}`}
                        sx={{ width: '100%', height: 'auto' }}
                    />
                ))}
            </Slider>

            <Divider sx={{ backgroundColor: 'rgba(128, 128, 128, 0.3)', width: '100%', mb: 2, marginTop: '50px' }} />
            <Typography sx={{ fontWeight: 'bold', fontSize: '1.5rem', mt: 4, mb: 2 }}>신상품</Typography>

            <LatestProducts products={latestProducts} handleCardClick={handleCardClick} />
            <Typography sx={{ fontWeight: 'bold', fontSize: '1.5rem', mt: 4, mb: 2 }}>최신 업데이트 상품</Typography>
            <LatestModifiedProducts products={modifiedProducts} handleCardClick={handleCardClick} />
        </Box>
    );
};

export default Home;
