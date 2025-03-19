import 'bootstrap/dist/css/bootstrap.min.css';
import './Nav.css'
import {Navbar, Container, Nav, NavDropdown, Button} from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { resetUser, setUser } from './store';
import { useEffect } from 'react';

function NavToolBar() {
    let user = useSelector((state) => {
        return state.user;
    })
    let dispatch = useDispatch();

    useEffect(() => {
        let jwtToken = localStorage.getItem("jwt");

        if(jwtToken) {
            axios.get("/user", { 
                withCredentials: true, 
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                } 
            })
            .then(response => {
                dispatch(setUser(response.data));
            })
            .catch(error => {
                console.error(error);
            })
        }
    },[dispatch]);

    const handleLogout = () => {
        localStorage.removeItem("jwt"); // JWT 삭제
        dispatch(resetUser()); // Redux 상태 초기화
        window.location.href = "/"; // 홈으로 이동
    };

    return (
    <div className='Nav'>
        <Navbar expand="lg" className="bg-body-tertiary" style={{height: '80px'}}>
            <Container>
                <Navbar.Brand href="/">Blog</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="#home">모든 블로그</Nav.Link>
                        <Nav.Link href="#link">내 블로그</Nav.Link>
                        <NavDropdown title="홈페이지" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">이 블로그는 어떻게 만들어졌는가?</NavDropdown.Item>
                            <NavDropdown.Item href="/board">
                                게시판 작성
                            </NavDropdown.Item>
                            <NavDropdown.Item href="/board/list/page/1">
                                게시판 목록
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">
                                Separated link
                            </NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
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
                            <Link to='/login' style={{marginRight: '5px'}}>
                                <Button>로그인</Button>
                            </Link>
                            <Link to='/signup'>
                                <Button>회원가입</Button>
                            </Link>
                        </>
                    )}
                    </Navbar.Collapse>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    </div>
    )
}

export default NavToolBar;
