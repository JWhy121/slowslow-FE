import { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext';

function OAuthCallback() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useContext(AuthContext);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get('token');

        if (token) {
            // AuthContext의 login 함수 호출
            login(token);

            if (localStorage.getItem('role') === 'ROLE_ADMIN') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } else {
            alert('로그인에 실패했어요!');
            navigate('/login');
        }
    }, [location, navigate]);

    return <div>카카오 로그인 처리중...</div>;
}

export default OAuthCallback;
