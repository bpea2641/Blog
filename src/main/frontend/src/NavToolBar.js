import 'bootstrap/dist/css/bootstrap.min.css';
import './Nav.css';
import {Navbar, Container, Nav, NavDropdown, Button} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { resetUser, setUser } from './store';
import { useEffect } from 'react';
import PillNav from './Component/PillNav';
import RotatingText from './Component/RotatingText'
import logo from './Component/PNG/logo.png';

function NavToolBar() {
    let user = useSelector((state) => state.user);
    let dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            await axios.post('/logout', {}, {
                withCredentials: true,
            });
            localStorage.removeItem('jwt');
            dispatch(resetUser());
            window.location.href = "/";
        } catch (error) {
            console.error("로그아웃 중 오류 발생: ", error);
            dispatch(resetUser());
            window.location.href = "/";
        }
    };

    // PillNav 메뉴 아이템 구성
    const pillItems = [
        { label: '홈', href: '/' },
        user.username && { label: '마이페이지', href: '/userPage' },
        { label: '게시판 작성', href: '/board' },
        { label: '게시판 목록', href: '/board/list/page/1' },
        user.username && { label: 'Chat', href: '/chat' },
        { label: '코딩테스트', href: '/judge' },
        user.username === 'admin' && { label: '문제 등록', href: '/admin/add-problem' }
    ].filter(Boolean); // null 제거

    return (
        <div className='Nav'>
            <Navbar expand="lg" data-bs-theme="dark" style={{height: '80px', backgroundColor: '#060010'}}>
                <Container>
                    {/* PillNav 적용 */}
                    <PillNav
                        logo={logo}
                        logoAlt="Company Logo"
                        items={pillItems}
                        activeHref={window.location.pathname}
                        className="custom-nav"
                        ease="power2.easeOut"
                        baseColor="#060010"
                        pillColor="#060010"
                        hoveredPillTextColor="#38bdf8"
                        pillTextColor="#FFFFFF"
                    />

                    <Navbar.Collapse className="justify-content-end">
                      {user.username ? (
                        <>
                          <Navbar.Text>
                            {user.displayName || user.username}님, 환영합니다.
                          </Navbar.Text>
                          <Button onClick={handleLogout} className="ms-2">로그아웃</Button>
                        </>
                      ) : (
                        <>
                        <Link to="/signup" style={{ textDecoration: 'none', marginRight: '10px' }}>
                          <Button
                            className="px-8 py-3 min-w-[160px] rounded-lg bg-black text-white border-0"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              whiteSpace: 'nowrap', // ← 줄바꿈 금지
                            }}
                          >
                            <span style={{ display: 'inline-block' }}>Sign</span>
                            <span style={{ display: 'inline-block', lineHeight: 1, overflow: 'hidden' }}>
                              <RotatingText
                                texts={['UP', 'UP']}
                                splitBy="words"
                                initial={{ y: '100%', color: '#ffffff' }}
                                animate={{ y: 0, color: '#3b82f6' }}     // 들어올 때 파란색
                                exit={{ y: '-120%', color: '#ffffff' }}  // 나갈 때 흰색
                                transition={{ type: 'tween', duration: 0.45 }}
                                mainClassName="inline-block"
                                splitLevelClassName="inline-block"
                                rotationInterval={1800}
                              />
                            </span>
                          </Button>
                        </Link>

                        <Link to="/login" style={{ textDecoration: 'none' }}>
                          <Button
                            className="px-8 py-3 min-w-[160px] rounded-lg bg-black text-white border-0"
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            <span style={{ display: 'inline-block' }}>Sign</span>
                            <span style={{ display: 'inline-block', lineHeight: 1, overflow: 'hidden' }}>
                              <RotatingText
                                texts={['IN', 'IN']}  // ← 같은 트릭
                                splitBy="words"
                                initial={{ y: '100%', color: '#ffffff' }}
                                animate={{ y: 0, color: '#3b82f6' }}
                                exit={{ y: '-120%', color: '#ffffff' }}
                                transition={{ type: 'tween', duration: 0.45 }}
                                mainClassName="inline-block"
                                splitLevelClassName="inline-block"
                                rotationInterval={1800}
                              />
                            </span>
                          </Button>
                        </Link>


                        </>
                      )}
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
}

export default NavToolBar;