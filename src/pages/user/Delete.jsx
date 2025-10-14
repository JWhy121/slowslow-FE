import React, { useContext } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import {
    Box,
    Typography,
    Button,
    List,
    ListItem,
    ListItemText,
    Container,
    Card,
    CardContent,
    Divider,
} from '@mui/material';
import SvgIcon from '@mui/material/SvgIcon';
import Grid from '@mui/material/Unstable_Grid2';
import { AuthContext } from './AuthContext';

function HomeIcon(props) {
    return (
        <SvgIcon {...props}>
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </SvgIcon>
    );
}

const ConfirmDelete = () => {
    const navigate = useNavigate();
    const { username, logout } = useContext(AuthContext);
    const location = useLocation();

    const isCurrentPage = (path) => {
        return location.pathname === path;
    };

    const handleDeleteAccount = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(
                'http://localhost:8080/api/v1/delete', // 회원 탈퇴 요청을 보내는 엔드포인트
                {
                    headers: {
                        Authorization: `${token}`,
                    },
                    params: {
                        username: username,
                    },
                }
            );

            if (response.status === 200) {
                logout();
                // localStorage.removeItem('token'); // 로컬 스토리지에서 토큰 삭제
                alert('회원 탈퇴가 성공적으로 처리되었습니다.');
                navigate('/');
            } else {
                alert('회원 탈퇴에 실패했습니다.');
            }
        } catch (error) {
            console.error('Error deleting user account:', error);
            alert('회원 탈퇴에 실패했습니다.');
        }
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
                            backgroundColor: isCurrentPage('/delete') ? '#586555' : 'transparent',
                            color: isCurrentPage('/delete') ? 'common.white' : 'inherit',
                            '&:hover': {
                                backgroundColor: isCurrentPage('/delete') ? '#6d7b77' : '#f0f0f0',
                            },
                        }}
                    >
                        <ListItemText primary="회원탈퇴" />
                    </ListItem>
                </List>
            </Box>

            <Box sx={{ flexGrow: 1, mt: 3 }}>
                <Container maxWidth="md">
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Box sx={{ fontSize: 27, fontWeight: 'bold' }}>회원탈퇴</Box>
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
                                <Box sx={{ fontSize: 20, fontWeight: 'bold', color: `black` }}>회원탈퇴</Box>
                            </Box>
                        </Grid>
                    </Grid>
                    <Divider sx={{ backgroundColor: 'rgba(128, 128, 128, 0.8)', width: '100%', mb: 2 }} />
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Grid alignItems="center">
                                <Grid item xs={12} sm={3} container direction="row" mt={3} ml={5}>
                                    {/* 회원 탈퇴 폼 */}
                                    <Box sx={{ mr: 2 }}>
                                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                                            회원 탈퇴
                                        </Typography>
                                        <Typography variant="body1" sx={{ mb: 2 }}>
                                            정말로 탈퇴하시겠습니까?
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: 2,
                        }}
                        mt={3}
                    >
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleDeleteAccount}
                            sx={{
                                bgcolor: '#586555',
                                '&:hover': {
                                    backgroundColor: '#6d7b77',
                                },
                            }}
                        >
                            &nbsp;&nbsp;&nbsp;네&nbsp;&nbsp;&nbsp;
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => navigate('/mypage')}
                            sx={{
                                bgcolor: '#586555',
                                '&:hover': {
                                    backgroundColor: '#6d7b77',
                                },
                            }}
                        >
                            아니오
                        </Button>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default ConfirmDelete;
