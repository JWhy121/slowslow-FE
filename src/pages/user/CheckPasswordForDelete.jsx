import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { Box, Typography, Button, List, ListItem, ListItemText, TextField, Container, Divider } from '@mui/material';
import SvgIcon from '@mui/material/SvgIcon';
import Grid from '@mui/material/Unstable_Grid2';

function HomeIcon(props) {
    return (
        <SvgIcon {...props}>
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </SvgIcon>
    );
}

const PasswordCheckForm = () => {
    const { isLoggedIn } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const isCurrentPage = (path) => location.pathname === path;

    const handlePasswordChange = (e) => setPassword(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (!isLoggedIn) {
                navigate('/login');
                return;
            }

            const token = localStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:8080/api/v1/checkPasswordForDelete',
                { password },
                { headers: { Authorization: `${token}` } }
            );

            if (response.data === '회원 탈퇴') {
                navigate('/delete');
            } else {
                setError('비밀번호가 일치하지 않습니다.');
            }
        } catch (error) {
            setError('서버 오류가 발생했습니다.');
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
                                <Box sx={{ fontSize: 20, fontWeight: 'bold', color: `black` }}>비밀번호확인</Box>
                            </Box>
                        </Grid>
                    </Grid>
                    <Divider sx={{ backgroundColor: 'rgba(128, 128, 128, 0.8)', width: '100%', mb: 2 }} />
                    <Box
                        sx={{
                            padding: '20px',
                            borderRadius: '4px',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <h2>비밀번호 확인</h2>
                        <form onSubmit={handleSubmit}>
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <label>
                                    <TextField
                                        id="password-field"
                                        label="비밀번호 확인"
                                        type="password"
                                        variant="outlined"
                                        value={password}
                                        onChange={handlePasswordChange}
                                        sx={{ mb: 2, width: 400 }}
                                    />
                                </label>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    sx={{
                                        mb: 2,
                                        height: 50,
                                        width: 400,
                                        backgroundColor: '#586555',
                                        borderRadius: '10px',
                                        '&:hover': {
                                            backgroundColor: '#586555',
                                        },
                                        disabled: loading,
                                    }}
                                >
                                    {loading ? '로딩 중...' : '확인'}
                                </Button>
                            </div>

                            {error && <p style={{ color: 'red' }}>{JSON.stringify(error)}</p>}

                            {message && (
                                <div>
                                    {typeof message === 'string' ? (
                                        <p>{message}</p>
                                    ) : (
                                        <ul>
                                            {Object.entries(message).map(([key, value]) => (
                                                <li key={key}>
                                                    {key}: {value}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}
                        </form>
                    </Box>
                </Container>
            </Box>
        </Box>
    );
};

export default PasswordCheckForm;
