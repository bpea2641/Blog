import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { setBoard, setBoardDetails, setTag } from "../store";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Bootstrap Icons 가져오기
import { Button, Card, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { jwtDecode } from "jwt-decode"; // npm install jwt-decode 필요
import ReactQuill from 'react-quill'; // ReactQuill을 사용
import 'react-quill/dist/quill.snow.css'; // Quill 스타일

function Board() {
    let board = useSelector((state) => ({
        title: state.board.title,
        content: state.board.content,
        tag: state.board.tag
    }));

    let boardList = useSelector((state) => state.board.boardList);
    let dispatch = useDispatch();
    const [files, setFiles] = useState([]); // 업로드할 파일 관리

    const handleChange = (e) => {
        const { id, value } = e.target;
        dispatch(setBoardDetails({ ...board, [id]: value.replace(/\n/g, '\n') }));  // 줄바꿈 처리
    };

    // JWT 토큰 가져오기
    const token = localStorage.getItem("jwt");
    let currentUser = null;

    if (token) {
        try {
            const decoded = jwtDecode(token);
            currentUser = decoded.username; // 백엔드에서 username이 어떤 필드인지 확인 필요
        } catch (error) {
            console.error("토큰 디코딩 오류:", error);
        }
    }

    const handleTagChange = (newTag) => {
        dispatch(setTag({ tag: newTag }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
    
        // boardData 객체 생성
        const boardData = {
            title: board.title,
            content: board.content,  // content에는 텍스트와 이미지 URL이 포함됨
            tag: board.tag,
            creator: currentUser,
        };
    
        formData.append("boardData", JSON.stringify(boardData));  // JSON 데이터를 boardData로 추가
    
        // 파일이 있다면 FormData에 추가
        if (files.length > 0) {
            for (let file of files) {
                formData.append("files", file);
                console.log("파일 확인 :", file); // 파일이 FormData에 추가되는지 확인
            }
        }
    
        try {
            const response = await axios.post("/board/save", formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",  // 멀티파트 폼 데이터 전송
                }
            });
            console.log("response 확인 : ", response);
            alert('게시판 등록 및 파일 업로드 성공');
            window.location.href = '/';
        } catch (error) {
            console.error("에러 상세:", error.response || error);
            alert('게시판 등록 실패');
        }
    };

    useEffect(() => {
        axios.get("/board/list")
            .then(response => {
                dispatch(setBoard(response.data));
            })
            .catch(error => {
                console.log(error);
            });
    }, [dispatch]);

    const userBoardList = boardList.filter(item => item.creator === currentUser);

    return (
        <div style={{ position: "relative", minHeight: "100vh", paddingLeft: "100px" }}>
            {/* 왼쪽 고정 카드 */}
            <Card style={{
                width: '15rem',
                height: '33rem',
                padding: '2rem',
                position: 'fixed',
                left: '20px',
                top: '42.5%',
                transform: 'translateY(-50%)',
                marginTop: '72.5px'
            }}>
                <Card.Body style={{ overflow: "auto", maxHeight: "28rem" }}>
                    <Card.Title className="mb-3">내가 쓴 게시글</Card.Title>
                    {
                        userBoardList.length > 0 ? (
                            <ul style={{ listStyle: 'none', padding: 0, textAlign: 'left', marginTop: '20px' }}>
                                {userBoardList.map(item => (
                                    <li key={item.id} style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '5px' }}>
                                        <Link to={`/board/detail/${item.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>{item.title}</Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>작성한 게시글이 없습니다.</p>
                        )
                    }
                </Card.Body>
            </Card>

            {/* 중앙 정렬된 form 카드 */}
            <div className="d-flex justify-content-center" style={{ marginTop: '28px', marginLeft: '100px' }}>
                <form onSubmit={handleSubmit}>
                    <Card style={{ width: '70rem', height: '45rem', padding: '2rem' }}>
                        <Card.Body>
                            {/* 태그 선택 토글 */}
                            <div className="d-flex justify-content-start mb-3 gap-3">
                                {['공지사항', '일반', '질문']
                                .filter(tag => tag !== '공지사항' || (tag === '공지사항' && currentUser === 'admin'))
                                .map((tag) => (
                                    <Button
                                        key={tag}
                                        variant={board.tag === tag ? "primary" : "outline-primary"}
                                        onClick={() => handleTagChange(tag)}
                                    >
                                        {tag}
                                    </Button>
                                ))}
                            </div>

                            {/* 제목 입력 */}
                            <InputGroup className="mb-3" style={{ height: '53px' }}>
                                <InputGroup.Text>
                                    <i className="bi bi-person-fill"></i> {/* 아이콘 추가 */}
                                </InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    id="title"
                                    value={board.title || ""}
                                    placeholder="제목"
                                    onChange={handleChange}
                                />
                            </InputGroup>

                            {/* ReactQuill 텍스트 편집기 */}
                            <InputGroup className="mb-3" style={{ marginTop: '20px', height: "30rem", flexDirection: 'column' }}>
                                <InputGroup.Text>
                                    <i className="bi bi-file-text"></i>
                                </InputGroup.Text>
                                <ReactQuill
                                    value={board.content}
                                    onChange={(content) => dispatch(setBoardDetails({ ...board, content }))}
                                    modules={{
                                        toolbar: [
                                            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
                                            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                                            ['bold', 'italic', 'underline'],
                                            [{ 'align': [] }],
                                            ['link'],
                                            [{ 'color': [] }, { 'background': [] }],
                                            ['image'],
                                            ['clean']
                                        ]
                                    }}
                                    style={{
                                        height: '400px',
                                        border: '1px solid #ccc',
                                    }}
                                />
                            </InputGroup>

                            <div className="text-center">
                                <Button type="submit" style={{ width: '100%', height: '45px' }}>등록</Button>
                            </div>
                        </Card.Body>
                    </Card>
                </form>
            </div>
        </div>
    );
}

export default Board;
