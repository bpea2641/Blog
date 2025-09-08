import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../store';
import { jwtDecode } from 'jwt-decode';

const KakaoCallback = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const token = searchParams.get('token');

        if (token) {
            localStorage.setItem('jwt', token);

            // 토큰을 디코딩하여 사용자 정보를 추출
            const decodedUser = jwtDecode(token);
            
            // Redux 스토어의 사용자 상태를 업데이트
            dispatch(setUser({
                id: decodedUser.id,
                username: decodedUser.username,
                displayName: decodedUser.displayName,
                profileImage: decodedUser.profileImage,
                authorities: decodedUser.authorities ? decodedUser.authorities.split(',') : [],
            }));

            alert('카카오 로그인이 완료되었습니다.');
            navigate('/');
        } else {
            console.error("토큰을 받지 못했습니다.");
            alert('카카오 로그인에 실패했습니다. 다시 시도해주세요.');
            navigate('/login');
        }
    }, [location, navigate, dispatch]);

    return (
        <div>
            <p>카카오 로그인 처리 중...</p>
        </div>
    );
};

export default KakaoCallback;
