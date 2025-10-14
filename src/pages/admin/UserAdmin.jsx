import React, { useState, useEffect } from 'react';
import {
    Container,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
} from '@mui/material';

const MemberList = () => {
    const [members, setMembers] = useState([]);

    useEffect(() => {
        // 서버에서 회원 목록 데이터를 가져오는 API 호출
        fetchMemberData();
    }, []);

    const fetchMemberData = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/v1/admin/userList', {
                method: 'GET',
                headers: {
                    Authorization: `${localStorage.getItem('token')}`,
                },
            });
            const data = await response.json();
            console.log(data); // 데이터 확인
            setMembers(data);
        } catch (error) {
            console.error('Error fetching member data:', error);
        }
    };

    const handleRestoreMember = async (username) => {
        try {
            const response = await fetch(`http://localhost:8080/api/v1/restoreUser/${username}`, {
                method: 'PUT', // 'Put'를 'PUT'으로 변경
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${localStorage.getItem('token')}`,
                },
            });
            if (response.ok) {
                // 복구가 성공하면 다시 회원 목록을 갱신합니다.
                fetchMemberData();
                alert('회원 복구가 성공적으로 처리되었습니다.');
            } else {
                console.error('Failed to restore member');
            }
        } catch (error) {
            console.error('Error restoring member:', error);
        }
    };

    return (
        <Container>
            <h1>회원 목록</h1>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>이름</TableCell>
                            <TableCell>이메일</TableCell>
                            <TableCell>가입일</TableCell>
                            <TableCell>복구</TableCell> {/* 복구 버튼을 추가할 열 */}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {members.map((member) => (
                            <TableRow key={member.id}>
                                <TableCell>{member.id}</TableCell>
                                <TableCell>{member.name}</TableCell>
                                <TableCell>{member.username}</TableCell>
                                <TableCell>
                                    {member.createdDate ? new Date(member.createdDate).toLocaleDateString() : 'N/A'}
                                </TableCell>{' '}
                                {/* 값이 없을 경우 'N/A' 표시 */}
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleRestoreMember(member.username)}
                                        disabled={!member.deleted} // 삭제되지 않은 회원만 복구할 수 있도록 설정
                                        sx={{
                                            bgcolor: '#586555',
                                            '&:hover': {
                                                backgroundColor: '#6d7b77',
                                            },
                                        }}
                                    >
                                        복구
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
};

export default MemberList;
