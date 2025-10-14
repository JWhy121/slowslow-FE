import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import Container from '@mui/material/Container';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';

function AdminOrderItem({
    orderId,
    totalPrice,
    orderName,
    orderDate,
    orderStatus,
    orderDetail,
    updateOrderList,
    updateOrderCount,
}) {
    const [value, setValue] = useState(orderStatus);

    let beforeStatus = value;

    // 주문상태 드롭박스 변경 이벤트 핸들러
    const handleChange = async (event) => {
        setValue(event.target.value);

        const url = `http://localhost:8080/admin/orders/${orderId}?status=${event.target.value}`;
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to update order status');
            }

            const updatedOrder = await response.json();
            console.log('Order updated successfully:', updatedOrder.status);
        } catch (error) {
            console.error('Error updating order status:', error);
        }

        // 부모에게 변경되기 전 값과 변경된 값을 알려줌
        updateOrderCount(beforeStatus, event.target.value);
        // 바뀐 값을 이전 값으로 세팅.
        beforeStatus = event.target.value;
    };

    // 주문날짜에서 초를 제외하고 출력하기위한 변수
    const formatDateTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    // 배송상태별 드롭박스 배경색 가져오는 함수.
    const getBackgroundColor = (value) => {
        switch (value) {
            case 'PENDING':
                return 'RGB(248,165,169)';
            case 'SHIPPING':
                return 'RGB(151,214,240)';
            case 'COMPLETED':
                return 'RGB(190,217,176)';
            case 'FAILED':
                return 'RGB(189,191,193)';
            default:
                return 'white';
        }
    };

    // 배송상태별 드롭박스 글씨색 가져오는 함수.
    const getTextColor = (value) => {
        switch (value) {
            case 'PENDING':
                return 'RGB(163,14,21)';
            case 'SHIPPING':
                return 'RGB(18,97,131)';
            case 'COMPLETED':
                return 'RGB(41,62,30)';
            case 'FAILED':
                return 'RGB(68,70,72)';
            default:
                return 'black';
        }
    };

    const [anchorEl, setAnchorEl] = React.useState(null);

    // 팝오버 오픈
    const handlePopoverOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    // 팝 오버 클로즈
    const handlePopoverClose = () => {
        setAnchorEl(null);
    };

    // 삭제 버튼 클릭 핸들러
    const orderDeleteHandler = async () => {
        // delete api. 상태를 CANCELLED로 변경.
        const url = `http://localhost:8080/admin/orders/${orderId}`;
        try {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${localStorage.getItem('token')}`,
                },
            });

            if (!response.ok) {
                throw new Error('Failed to delete order');
            }

            const updatedOrder = await response.json();
            console.log('Order deleted successfully:', updatedOrder.status);
        } catch (error) {
            console.error('Error delete order:', error);
        }

        // 부모 컴포넌트에게 주문삭제로 인한 주문목록 변경을 알림.
        updateOrderList();
    };

    const open = Boolean(anchorEl);

    return (
        <Box sx={{ flexGrow: 1, mt: 4 }}>
            <Grid
                container
                spacing={7}
                sx={{
                    textAlign: `center`,
                    fontWeight: 'bold',
                    borderBottom: 1,
                    height: 47,
                    backgroundColor: `RGB(233,233,233)`,
                    mr: -3,
                    ml: -3,
                }}
            >
                <Grid
                    xs={1}
                    p={0}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {orderId}
                </Grid>
                <Grid
                    xs={3}
                    p={0}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                    }}
                >
                    <Typography
                        aria-owns={open ? 'mouse-over-popover' : undefined}
                        aria-haspopup="true"
                        onMouseEnter={handlePopoverOpen}
                        onMouseLeave={handlePopoverClose}
                        sx={{
                            overflow: 'hidden', // Typography 내부에서 넘치는 내용을 숨기기 위해 추가
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap', // 텍스트가 줄 바꿈되지 않도록 설정
                            fontWeight: '600',
                        }}
                    >
                        {orderDetail.reduce((acc, Detail, index) => {
                            return acc + (index !== 0 ? ', ' : '') + Detail.productName;
                        }, '')}
                    </Typography>
                    <Popover
                        id="mouse-over-popover"
                        sx={{
                            pointerEvents: 'none',
                        }}
                        open={open}
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'left',
                        }}
                        onClose={handlePopoverClose}
                        disableRestoreFocus
                        disableScrollLock //스크롤 잠금 비활성화
                    >
                        <Box sx={{ p: 1 }}>
                            {orderDetail.map((Detail) => (
                                // key는 React.js에서만, map안에서 component들을 render할 때 사용한다.

                                <Box key={Detail.id}>
                                    <Typography>{`${Detail.productName} : ${Detail.productCnt}개`}</Typography>
                                </Box>
                            ))}
                        </Box>
                    </Popover>
                </Grid>
                <Grid
                    xs={1.5}
                    p={0}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {/*주문금액*/ totalPrice}
                </Grid>
                <Grid
                    xs={1}
                    p={0}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {/*주문자*/ orderName}
                </Grid>
                <Grid
                    xs={1.5}
                    p={0}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    {/*주문날짜*/ formatDateTime(orderDate)}
                </Grid>
                <Grid
                    xs={3}
                    p={0}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Box sx={{}}>
                        <FormControl fullWidth>
                            <Select
                                value={value}
                                onChange={handleChange}
                                MenuProps={{ disableScrollLock: true }} // 스크롤바 유지
                                sx={{
                                    '& .MuiSelect-select': {
                                        padding: `8px`,
                                        backgroundColor: getBackgroundColor(value),
                                        color: getTextColor(value),
                                        fontWeight: `bold`,
                                    },
                                    minWidth: 180,
                                }}
                            >
                                <MenuItem value="PENDING">상품준비중</MenuItem>
                                <MenuItem value="SHIPPING">상품배송중</MenuItem>
                                <MenuItem value="COMPLETED">배송완료</MenuItem>
                                <MenuItem value="FAILED">주문실패</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                </Grid>
                <Grid
                    xs={1}
                    p={0}
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <Box>
                        <Button onClick={orderDeleteHandler}>
                            <Typography sx={{ color: 'black', fontWeight: '500', textDecoration: 'underline' }}>
                                주문삭제
                            </Typography>
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
}

export default AdminOrderItem;
