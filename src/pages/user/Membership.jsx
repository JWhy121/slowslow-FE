import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

function Membership() {
    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const [showPassword, setShowPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowConfitmPassword = () => setShowConfirmPassword((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 비밀번호와 비밀번호 확인이 일치하는지 확인
        if (password !== confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }

        try {
            const response = await fetch('http://localhost:8080/api/v1/membership', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    username,
                    password,
                    phoneNumber,
                }),
            });

            if (response.ok) {
                // 회원가입 성공 시 루트 페이지로 이동
                navigate('/login');
                alert('회원가입이 완료되었습니다. 로그인해주세요.');
            } else {
                const errorData = await response.json();
                if (errorData.success === false && errorData.username) {
                    // 이메일 중복 에러 표시
                    alert(errorData.username);
                } else {
                    // 다른 에러 처리
                    if (errorData.errors.password) {
                        alert(errorData.errors.password);
                    }
                    if (errorData.errors.phoneNumber) {
                        alert(errorData.errors.phoneNumber);
                    }
                }
            }
        } catch (error) {
            console.error('회원가입 실패:', error);
            alert('회원가입에 실패했습니다. 다시 시도해주세요.');
        }
    };

    return (
        <div>
            <Box
                sx={{
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
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
                    <h2>회원가입</h2>
                    <form onSubmit={handleSubmit}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 2, mt: 7 }}>
                            <TextField
                                sx={{
                                    width: 400,
                                    color: '#586555',
                                }}
                                id="input-with-sx"
                                label="이름"
                                variant="outlined"
                                required
                                name="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            ></TextField>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 2 }}>
                            <TextField
                                sx={{
                                    width: 400,
                                    color: '#586555',
                                }}
                                id="input-with-sx"
                                label="이메일"
                                variant="outlined"
                                required
                                type="email"
                                name="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            ></TextField>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 2 }}>
                            <FormControl variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-password">비밀번호</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    type={showPassword ? 'text' : 'password'}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label="password"
                                    name="password"
                                    required
                                    onChange={(e) => setPassword(e.target.value)}
                                    value={password}
                                    sx={{ width: 400 }}
                                />
                            </FormControl>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 2 }}>
                            <FormControl variant="outlined">
                                <InputLabel htmlFor="outlined-adornment-password">비밀번호 확인</InputLabel>
                                <OutlinedInput
                                    id="outlined-adornment-confirmPassword"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={handleClickShowConfitmPassword}
                                                onMouseDown={handleMouseDownPassword}
                                                edge="end"
                                            >
                                                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    label="conformPassword"
                                    name="confirmPassword"
                                    required
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    value={confirmPassword}
                                    sx={{ width: 400 }}
                                />
                            </FormControl>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 2 }}>
                            <TextField
                                sx={{
                                    width: 400,
                                    color: '#586555',
                                }}
                                id="input-with-sx"
                                label="전화번호"
                                variant="outlined"
                                required
                                name="phoneNumber"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                            ></TextField>
                        </Box>
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
                                    backgroundColor: '#586555', // 마우스 오버 시 배경색 변경
                                },
                            }}
                        >
                            회원가입
                        </Button>
                    </form>
                </Box>
            </Box>
        </div>
    );
}

export default Membership;
