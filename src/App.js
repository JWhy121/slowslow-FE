import * as React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate, BrowserRouter } from 'react-router-dom';
import { TokenProvider } from './contexts/TokenContext'; // TokenProvider 임포트
import MainLayout from './layouts/MainLayout';
import BrandLayout from './layouts/BrandLayout.jsx';
import CategoryLayout from './layouts/CategoryLayout.jsx';
import AdminLayout from './layouts/AdminLayout.jsx';
import Cart from './pages/cart/Cart';
import Order from './pages/order/Order';
import OrderList from './pages/order/OrderList'; // OrderList 임포트
import OrderDetail from './pages/order/OrderDetail'; // OrderDetail 임포트
import OrderPage from './pages/order/OrderPage'; // OrderPage 임포트
import OrderSuccess from './pages/order/OrderSuccess'; // OrderSuccess 임포트
import OrderFailure from './pages/order/OrderFailure'; // OrderFailure 임포트
import Home from './pages/home/Home';
import BrandAdmin from './pages/admin/BrandAdmin';
import CategoryAdmin from './pages/admin/CategoryAdmin';
import ProductDetail from './pages/product/ProductDetail.jsx';
import ProductAdmin from './pages/admin/ProductAdmin.jsx';
import AdminOrder from './pages/admin/order/AdminOrder.jsx';

import Login from './pages/user/Login';
import Main from './pages/user/Main';
import Membership from './pages/user/Membership';
import AdminHome from './pages/admin/AdminHome.jsx';
import MyPage from './pages/user/MyPage';
import CheckPasswordForUpdate from './pages/user/CheckPasswordForUpdate.jsx';
import CheckPasswordForDelete from './pages/user/CheckPasswordForDelete.jsx';
import Update from './pages/user/Update.jsx';
import './index.css'; // CSS 파일 임포트
import { AuthProvider } from './pages/user/AuthContext'; //로그인 전역 설정
import { AuthContext } from './pages/user/AuthContext';
import { useContext, useEffect } from 'react';
import BrandMainPage from './pages/brand/BrandMainPage.jsx';
import CategoryMainPage from './pages/category/CategoryMainPage.jsx';
import Delete from './pages/user/Delete.jsx';
import UserAdmin from './pages/admin/UserAdmin.jsx';
import OAuthCallback from './pages/user/OAuthCallback.jsx';

const theme = createTheme({
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    // 커스터마이징 옵션 추가
                },
            },
        },
    },
});

const App = () => {
    const { isLoggedIn, role, username } = useContext(AuthContext);

    console.log(isLoggedIn);

    const admin = localStorage.getItem('role');

    useEffect(() => {
        // 모든 페이지가 렌더링된 후 실행되는 코드
        console.log('App 컴포넌트가 마운트되었습니다.');
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
                <Routes>
                    <Route path="/oauth/callback" element={<OAuthCallback />} />
                    <Route path="/" element={<MainLayout />}>
                        <Route index element={<Home />} />
                        <Route path="/cart" element={admin === 'ROLE_ADMIN' ? <Navigate to="/" replace /> : <Cart />} />
                        <Route
                            path="/order"
                            element={admin === 'ROLE_ADMIN' ? <Navigate to="/" replace /> : <Order />}
                        />
                        <Route
                            path="/orders"
                            element={admin === 'ROLE_ADMIN' ? <Navigate to="/" replace /> : <OrderPage />}
                        />
                        <Route path="/orders/success" element={<OrderSuccess />} />
                        <Route path="/orders/failure" element={<OrderFailure />} />
                        <Route
                            path="/mypage/orders"
                            element={
                                !isLoggedIn || admin === 'ROLE_ADMIN' ? <Navigate to="/" replace /> : <OrderList />
                            }
                        />
                        <Route path="/mypage/orders/:orderId" element={<OrderDetail />} />
                        <Route path="/brand" element={<BrandLayout />}>
                            <Route path="/brand" element={<BrandMainPage />} />
                            <Route path="/brand/:id" element={<BrandMainPage />} />
                        </Route>
                        <Route path="/category" element={<CategoryLayout />}>
                            <Route path="/category" element={<CategoryMainPage />} />
                            <Route path="/category/:id" element={<CategoryMainPage />} />
                        </Route>
                        <Route path="/product/:productId" element={<ProductDetail />} />
                        <Route path="/mypage" element={admin === 'ROLE_ADMIN' ? <AdminHome /> : <MyPage />} />
                        <Route path="/main" element={<Main />} />
                        <Route
                            path="/checkPasswordForUpdate"
                            element={
                                !isLoggedIn || admin === 'ROLE_ADMIN' ? (
                                    <Navigate to="/" replace />
                                ) : (
                                    <CheckPasswordForUpdate />
                                )
                            }
                        />
                        <Route
                            path="/checkPasswordForDelete"
                            element={
                                !isLoggedIn || admin === 'ROLE_ADMIN' ? (
                                    <Navigate to="/" replace />
                                ) : (
                                    <CheckPasswordForDelete />
                                )
                            }
                        />
                        <Route
                            path="/update"
                            element={!isLoggedIn || admin === 'ROLE_ADMIN' ? <Navigate to="/" replace /> : <Update />}
                        />
                        <Route
                            path="/delete"
                            element={!isLoggedIn || admin === 'ROLE_ADMIN' ? <Navigate to="/" replace /> : <Delete />}
                        />
                        <Route path="/login" element={isLoggedIn ? <Navigate to="/" replace /> : <Login />} />
                        <Route path="/membership" element={isLoggedIn ? <Navigate to="/" replace /> : <Membership />} />
                    </Route>
                    <Route
                        path="/admin"
                        element={admin === 'ROLE_ADMIN' ? <AdminLayout /> : <Navigate to="/" replace />}
                    >
                        <Route index element={<AdminHome />} />
                        <Route path="/admin/brand" element={<BrandAdmin />} />
                        <Route path="/admin/category" element={<CategoryAdmin />} />
                        <Route path="/admin/order" element={<AdminOrder />} />
                        <Route path="/admin/product" element={<ProductAdmin />} />
                        <Route path="/admin/userList" element={<UserAdmin />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
};

export default App;
