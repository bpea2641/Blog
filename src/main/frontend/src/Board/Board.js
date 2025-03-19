import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { setBoard, setBoardDetails } from "../store";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Bootstrap Icons 가져오기
import { Button, Card, Form, InputGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { jwtDecode } from "jwt-decode"; // npm install jwt-decode 필요

function Board() {
    let board = useSelector((state) => ({
        title: state.board.title,
        content: state.board.content
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
    
        // boardData 객체 생성
        const boardData = {
            title: board.title,
            content: board.content,  // content에는 텍스트와 이미지 URL이 포함됨
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

    // // 이미지 업로드 및 contentEditable에 삽입 처리
    // const handleImageUpload = (e) => {
    //     const file = e.target.files[0];
    //     if (file) {
    //         setFiles((prevFiles) => [...prevFiles, file]);  // 드래그 앤 드롭된 파일을 files 배열에 추가
    //         const reader = new FileReader();
    //         reader.onloadend = () => {
    //             const imageUrl = reader.result;
    //             const newContent = `${board.content} <img src="${imageUrl}" alt="uploaded" style="max-width: 100%; margin-top: 20px;" />`;
    //             dispatch(setBoardDetails({ ...board, content: newContent }));
    //         };
    //         reader.readAsDataURL(file);
    //     }
    // };

    // 드래그 앤 드롭 이미지 삽입
    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
    
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const imageUrl = reader.result;
    
                // 현재 커서 위치에 이미지를 삽입
                const imageHTML = `<img src="${imageUrl}" alt="uploaded" style="max-width: 100%; margin-top: 20px;" />`;
    
                const contentEditable = document.getElementById("content");
                contentEditable.focus();
    
                // insert the image at the current cursor position
                document.execCommand('insertHTML', false, imageHTML);
    
                // board content 업데이트
                const newContent = contentEditable.innerHTML;
                dispatch(setBoardDetails({ ...board, content: newContent }));
            };
            reader.readAsDataURL(file);
        }
    };
    
    const handleDragOver = (e) => {
        e.preventDefault();
    };
    

    return (
        <div style={{ position: "relative", minHeight: "100vh", paddingLeft: "250px" }}>
            {/* 왼쪽 고정 카드 */}
            <Card style={{
                width: '15rem',
                height: '33rem',
                padding: '2rem',
                position: 'fixed',
                left: '20px',
                top: '42.5%',
                transform: 'translateY(-50%)',
                marginTop: '24px'
            }}>
                <Card.Body style={{ overflow: "auto", maxHeight: "28rem" }}>
                    <Card.Title className="text-center mb-3">게시판</Card.Title>
                    {
                        userBoardList.length > 0 ? (
                            userBoardList.map(item => (
                                <li key={item.id}>
                                    <Link to={`/board/detail/${item.id}`}>{item.title}</Link>
                                </li>
                            ))
                        ) : (
                            <p className='text-center'>게시판이 없습니다</p>
                        )
                    }
                </Card.Body>
            </Card>

            {/* 중앙 정렬된 form 카드 */}
            <div className="d-flex justify-content-center" style={{ marginTop: '28px', marginRight: '100px' }}>
                <form onSubmit={handleSubmit}>
                    <Card style={{ width: '80rem', height: '45rem', padding: '2rem' }}>
                        <Card.Body>
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

                            {/* 내용 입력 (contentEditable 사용) */}
                            <InputGroup className="mb-3" style={{ marginTop: '20px', height: "33rem", flexDirection: 'column' }}>
                                <InputGroup.Text>
                                    <i className="bi bi-file-text"></i>
                                </InputGroup.Text>
                                <div
                                    id="content"
                                    contentEditable
                                    onInput={(e) => dispatch(setBoardDetails({ ...board, content: e.target.innerHTML }))}
                                    style={{
                                        minHeight: '300px',
                                        resize: 'none',
                                        border: '1px solid #ccc',
                                        padding: '10px',
                                        whiteSpace: 'pre-wrap',
                                        overflowWrap: 'break-word',
                                    }}
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
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
