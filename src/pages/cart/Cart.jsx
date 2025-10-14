import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useEffect, useState, useContext } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import CartProduct from './components/CartProduct';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { AuthContext } from '../user/AuthContext'; // AuthContext 임포트
import { Link, useParams, useNavigate } from 'react-router-dom'; // useNavigate 추가

// MUI 체크박스 만드는데 필요한 라벨
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

// MUI 그리드 안에 들어가는 Item스타일
const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

// 모달에 들어가는 스타일
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

// 전체선택 여부 초기에 확인하는 함수
const initSelectAll = () => {
    // 로컬스토리지의 값들이 전부 ture인지 확인하는 변수
    let isAllChecked = true;
    const carts = JSON.parse(localStorage.getItem('orders'));
    if (carts === null) {
        return true;
    }
    carts.map((cart) => {
        // 로컬 스토리지 체크박스중 체크가 꺼진 체크박스가 존재한다면 isAllChecked를 false로 바꿈.
        if (cart.checked === false) {
            isAllChecked = false;
        }
    });

    return isAllChecked;
};

// 메인 함수-----------------------------------------------------------------------------------------------------------------------------
function Cart() {
    // 로컬스토리지에 들어있는 제품 항목들을 가져와 담을 변수 products. json객체들이 들어있는 배열
    const [products, setProducts] = useState([]);
    // 상품 총 합계
    const [totalProductAmount, setTotalProductAmount] = useState(0);
    // 전체선택 체크박스 체크상태
    const [selectAll, setSelectAll] = useState(initSelectAll);
    // 배송비설정
    const [deliveryFee, setDeliveryFee] = useState(0);
    // 전체선택 버튼을 직접 눌러서 체크해제 했을때만 true로 바뀌는 변수. 필요이유 아래 설명.
    const [allCheckUncheckedByUser, setAllCheckUncheckedByUser] = useState(false);

    const { isLoggedIn } = useContext(AuthContext); // AuthContext 사용

    const navigate = useNavigate(); // 네비게이션 훅 사용

    // 모달용 변수와 함수. 장바구니를 아무것도 선택안하고 결제하기 눌렀을때 열리는 모달.
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    // 백엔드 서버에서 제품 정보를 가져오는 함수
    const fetchProductDetails = async (productId) => {
        const response = await fetch(`http://localhost:8080/product/${productId}`);
        const data = await response.json();
        return data;
    };

    // 전체선택 체크박스 이벤트핸들러
    const handleCheckChange = (event) => {
        const carts = JSON.parse(localStorage.getItem('orders'));
        const newCarts = carts.map((cart) => {
            return { ...cart, checked: event.target.checked };
        });
        localStorage.setItem('orders', JSON.stringify(newCarts));
        //getProducts();
        setSelectAll(event.target.checked);
        // 총상픔금액 계산
        CalcTotalProductAmount();
        if (!event.target.checked) {
            setAllCheckUncheckedByUser(true);
            return;
        }

        setAllCheckUncheckedByUser(false);
    };

    // 선택삭제 버튼 이벤트핸들러
    const DeleteSelectionBtnHandler = async (event) => {
        // 로컬스토리지 가져와서 JSON문자열을 JavaScript 객체로 변환.
        let carts = JSON.parse(localStorage.getItem('orders'));
        // 체크해제된 항목들로 이루어진 새로운 배열 생성
        carts = carts.filter((cart) => cart.checked === false);
        // 수정된 배열을 JSON 문자열로 변환.
        const newCarts = JSON.stringify(carts);

        // 로컬스토리지에 다시 저장
        localStorage.setItem('orders', newCarts);
        // 물품 다시 불러옴.
        await getProducts();
        // 총주문액 다시 계산.
        CalcTotalProductAmount();
    };

    // 구매하기 버튼 핸들러
    const purchaseBtnhandler = () => {
        // 장바구니에 선택한 상품이 없는지 체크하는 변수.
        let allSelectFalse = true;
        const carts = JSON.parse(localStorage.getItem('orders'));
        carts.map((cart) => {
            if (cart.checked) {
                allSelectFalse = false;
            }
        });

        // 만약 선택한 제품 없이 구매하기 눌렀다면 경고 모달 출력.
        if (allSelectFalse === true) {
            handleOpen();
            return;
        }

        // 선택한 제품 있다면 구매하기 버튼 동작.
        if (allSelectFalse === false) {
            // 장바구니에서 선택안한 제품들을 로컬스토리지에서 제거하는 작업.
            deleteUncheckedProduct();

            if (isLoggedIn) {
                // 로그인 상태 확인

                // OrderPage로 이동
                navigate('/orders');
            } else {
                // 로그인 페이지로 이동
                navigate('/login');
            }
        }
    };

    // 로컬스토리지에서 체크안된 제품들을 제거하는 함수.
    const deleteUncheckedProduct = () => {
        // 로컬스토리지 가져와서 JSON문자열을 JavaScript 객체로 변환.
        let carts = JSON.parse(localStorage.getItem('orders'));
        // 체크가 안된 제품들을 제외한 새로운 배열 생성
        carts = carts.filter((cart) => cart.checked === true);
        // 수정된 배열을 JSON 문자열로 변환.
        const newCarts = JSON.stringify(carts);
        // 로컬스토리지에 다시 저장
        localStorage.setItem('orders', newCarts);
    };

    // 로컬스토리지에 들어있는 제품들을 가져와서 백엔드 서버의 제품 정보와 합치는 함수
    const getProducts = async () => {
        // 로컬스토리지에서 값을 꺼내와서 JSON형태로 저장
        const cart = JSON.parse(localStorage.getItem('orders'));
        if (cart === null) {
            return [];
        }
        // 각 제품의 상세 정보를 백엔드에서 가져옴
        const detailedProducts = await Promise.all(
            cart.map(async (product) => {
                const details = await fetchProductDetails(product.productId);

                return {
                    ...product,
                    productName: details.name,
                    productPrice: details.price,
                    orderImg: details.imageLink,
                };
            })
        );
        //백엔드와 합쳐준 값을 products에 넣어줌.
        setProducts(detailedProducts);

        //합쳐준 값을 로컬스토리지에 저장.
        localStorage.setItem('orders', JSON.stringify(detailedProducts));
    };

    // 총 가격 계산하는 함수.
    const CalcTotalProductAmount = async () => {
        // 총 가격 저장할 변수
        let totalAmount = 0;
        //로컬 스토리지 가져옴.
        const carts = JSON.parse(localStorage.getItem('orders'));
        if (carts === null) {
            return;
        }
        await Promise.all(
            // 로컬스토리지 값 순차접근
            carts.map(async (cart) => {
                if (cart.checked === true) {
                    //백엔드에서 해당하는 상품 가져옴.
                    const productFromBE = await fetchProductDetails(cart.productId);

                    totalAmount = totalAmount + productFromBE.price * Number(cart.productCnt);
                }
            })
        );
        setTotalProductAmount(totalAmount);

        // 총 구매금액이 50,000원 미만이면 배솧비 3,000원 추가
        if (totalAmount > 0 && totalAmount < 50000) {
            setDeliveryFee(3000);
            return;
        }
        // 50,000 이상이면이거나 아무 제품도 선택하지 않아서 총액이 0원일때는 배송비 0원으로 표시
        if (totalAmount == 0 || totalAmount >= 50000) {
            setDeliveryFee(0);
        }
    };

    // 자식컴포넌트에서 전체선택 변경신호를 받기 위한 함수, allCheckUncheckedByUser를 false로 바꿔줌.
    const parentSelectAll = (parentSelectAll) => {
        setSelectAll(parentSelectAll);
        setAllCheckUncheckedByUser(false);
    };

    //자식컴포넌트 삭제버튼 눌렀을시 호출되는 함수.
    const productDelete = async (id) => {
        // 로컬스토리지 가져와서 JSON문자열을 JavaScript 객체로 변환.
        let carts = JSON.parse(localStorage.getItem('orders'));
        // 넘겨받은 매개변수 id를 가진 객체를 제외한 새로운 배열 생성
        carts = carts.filter((cart) => cart.productId !== id);
        // 수정된 배열을 JSON 문자열로 변환.
        const newCarts = JSON.stringify(carts);
        // 로컬스토리지에 다시 저장
        localStorage.setItem('orders', newCarts);
        // 물품 다시 불러옴.
        await getProducts();
        // 총주문액 다시 계산.
        CalcTotalProductAmount();
    };

    //테스트용 리셋버튼 핸들러
    const resetBtnHandler = (event) => {
        let resetCarts = [];
        resetCarts.push({
            productId: 1,
            productCnt: 1,
            checked: true,
        });
        resetCarts.push({
            productId: 2,
            productCnt: 1,
            checked: true,
        });
        resetCarts.push({
            productId: 3,
            productCnt: 1,
            checked: true,
        });
        resetCarts.push({
            productId: 4,
            productCnt: 1,
            checked: true,
        });
        localStorage.setItem('orders', JSON.stringify(resetCarts));
        getProducts();
        CalcTotalProductAmount();
        window.location.reload();
    };

    // useEffect를 사용하여 페이지 로딩시 필요값 세팅.
    useEffect(() => {
        // 로컬스토리지에서 제품들 불러옴.
        getProducts();
        // 총 가격 계산.
        CalcTotalProductAmount();
    }, []);

    return (
        <Box>
            <Container maxWidth="lg">
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2}>
                        <Grid xs={6}>
                            <Box sx={{ fontSize: 27, fontWeight: 'bold' }}>장바구니</Box>
                        </Grid>
                        <Grid xs={6}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'right',
                                    justifyContent: 'flex-end',
                                    alignItems: 'flex-end',
                                    gap: 1,
                                    height: '100%',
                                }}
                            >
                                <Box sx={{ fontSize: 20, fontWeight: 'bold', color: `black` }}>장바구니 &gt;</Box>
                                <Box
                                    sx={{
                                        fontSize: 20,
                                        fontWeight: 'bold',
                                        color: 'rgb(195, 195, 195)',
                                    }}
                                >
                                    주문/결제 &gt;
                                </Box>
                                <Box
                                    sx={{
                                        fontSize: 20,
                                        fontWeight: 'bold',
                                        color: 'rgb(195, 195, 195)',
                                    }}
                                >
                                    주문완료
                                </Box>
                            </Box>
                        </Grid>
                    </Grid>
                    <hr
                        style={{
                            height: `2px`,
                            backgroundColor: `black`,
                            border: 'none',
                        }}
                    />
                    <Grid container spacing={2} sx={{ mt: 4 }}>
                        {localStorage.getItem('orders') !== null &&
                        JSON.parse(localStorage.getItem('orders')).length > 0 ? (
                            <Grid xs={8}>
                                <Box>
                                    <Grid container spacing={2}>
                                        <Grid xs={10}>
                                            <Box sx={{ fontWeight: 500, fontSize: 17 }}>
                                                {/* 전체선택 체크박스 */}
                                                <Checkbox
                                                    {...label}
                                                    checked={selectAll}
                                                    onChange={handleCheckChange}
                                                    sx={{
                                                        '&.Mui-checked': {
                                                            color: 'rgb(88, 101, 85)',
                                                        },
                                                    }}
                                                />{' '}
                                                전체선택
                                            </Box>
                                        </Grid>
                                        <Grid xs={2}>
                                            <Box sx={{ textAlign: `right` }}>
                                                <Button
                                                    onClick={DeleteSelectionBtnHandler}
                                                    sx={{ fontSize: 16, textDecoration: 'underline', color: `black` }}
                                                >
                                                    {selectAll ? '전체삭제' : '선택삭제'}
                                                </Button>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>

                                {products.map((product) => (
                                    // key는 React.js에서만, map안에서 component들을 render할 때 사용한다.
                                    <Box key={product.productId}>
                                        <CartProduct
                                            id={product.productId}
                                            cnt={product.productCnt}
                                            checked={product.checked}
                                            name={product.productName}
                                            price={product.productPrice}
                                            image={product.orderImg}
                                            parentSelectAll={parentSelectAll}
                                            CalcTotalProductAmount={CalcTotalProductAmount}
                                            selectAll={selectAll}
                                            allCheckUncheckedByUser={allCheckUncheckedByUser}
                                            productDelete={productDelete}
                                        />
                                    </Box>
                                ))}
                            </Grid>
                        ) : (
                            <Box
                                sx={{
                                    textAlign: 'center',
                                    mt: 5,
                                    mb: 50,
                                    flexGrow: 1,
                                    fontSize: 20,
                                }}
                            >
                                장바구니에 담은 상품이 없습니다.
                            </Box>
                        )}
                        {localStorage.getItem('orders') !== null &&
                        JSON.parse(localStorage.getItem('orders')).length > 0 ? (
                            <Grid xs={4}>
                                <Item>
                                    <Grid container spacing={2}>
                                        <Grid xs={12}>
                                            <Box
                                                sx={{
                                                    textAlign: `left`,
                                                    fontSize: 22,
                                                    fontWeight: 'bold',
                                                    pl: 3,
                                                    pt: 2,
                                                    color: `black`,
                                                }}
                                            >
                                                주문 예상 금액
                                            </Box>
                                        </Grid>
                                        <Grid xs={6}>
                                            <Box
                                                sx={{
                                                    textAlign: `left`,
                                                    pl: 3,
                                                    color: `black`,
                                                    fontSize: 17,
                                                }}
                                            >
                                                총 상품 가격
                                            </Box>
                                        </Grid>
                                        <Grid xs={6}>
                                            <Box
                                                sx={{
                                                    textAlign: `right`,
                                                    pr: 3,
                                                    color: `black`,
                                                    fontSize: 17,
                                                }}
                                            >
                                                {totalProductAmount.toLocaleString('ko-KR')} 원
                                            </Box>
                                        </Grid>
                                        <Grid xs={6}>
                                            <Box
                                                sx={{
                                                    textAlign: `left`,
                                                    pl: 3,
                                                    color: `black`,
                                                    fontSize: 17,
                                                }}
                                            >
                                                총 배송비
                                            </Box>
                                        </Grid>
                                        <Grid xs={6}>
                                            <Box
                                                sx={{
                                                    textAlign: `right`,
                                                    pr: 3,
                                                    color: `black`,
                                                    fontSize: 17,
                                                }}
                                            >
                                                {deliveryFee.toLocaleString('ko-KR')} 원
                                            </Box>
                                        </Grid>
                                        <Grid xs={12} sx={{ fontSize: 12, textAlign: `left`, pl: 4 }}>
                                            50,000원 이상 구매시 무료배송
                                        </Grid>
                                    </Grid>
                                    <hr />
                                    <Grid xs={12}>
                                        <Box
                                            sx={{
                                                textAlign: `right`,
                                                pr: 2,
                                                color: `black`,
                                                fontSize: 21,
                                            }}
                                        >
                                            {(totalProductAmount + deliveryFee).toLocaleString('ko-KR')} 원
                                        </Box>
                                    </Grid>
                                    <br />
                                    <br />
                                    <Grid xs={12}>
                                        <Box>
                                            <Button
                                                onClick={purchaseBtnhandler}
                                                variant="contained"
                                                sx={{
                                                    width: '230px',
                                                    height: '45px',
                                                    backgroundColor: 'rgb(88, 101, 85)',
                                                    '&:hover': {
                                                        backgroundColor: 'rgb(63, 71, 61)',
                                                    },
                                                    fontSize: 17,
                                                }}
                                            >
                                                구매하기
                                            </Button>
                                        </Box>
                                    </Grid>
                                </Item>
                            </Grid>
                        ) : (
                            ''
                        )}
                    </Grid>
                </Box>
                {/* <Box>
                    <Button variant="contained" onClick={resetBtnHandler}>
                        물품 리셋
                    </Button>
                </Box> */}
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <Typography
                            id="modal-modal-description"
                            sx={{ fontSize: 17, mt: 2, textAlign: 'center', mb: 5 }}
                        >
                            1개 이상의 상품을 선택해 주세요.
                        </Typography>
                        <Box sx={{ textAlign: 'center' }}>
                            <Button
                                variant="contained"
                                onClick={handleClose}
                                sx={{
                                    backgroundColor: 'rgb(88, 101, 85)',
                                    '&:hover': {
                                        backgroundColor: 'rgb(63, 71, 61)',
                                    },
                                }}
                            >
                                확인
                            </Button>
                        </Box>
                    </Box>
                </Modal>
            </Container>
        </Box>
    );
}

export default Cart;
// 지금 총액이 50,000이상 제품 선택했다가 해제하면 괜찮은데
// 총액 50,000미만 제품만 클릭했다가 해제하면 총액에 배송비만 남아있는 오류가 있음.
