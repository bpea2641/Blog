import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { setBoardDetails } from "../store";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Button, Card, Form, InputGroup } from 'react-bootstrap';

function BoardEdit() {
    const { id } = useParams(); // URL에서 게시글 ID 가져오기
    const dispatch = useDispatch();
    const board = useSelector(state => state.board);
    const [files, setFiles] = useState([]);

    useEffect(() => {
        axios.get(`/board/detail/${id}`)
            .then(response => {
                dispatch(setBoardDetails(response.data));
            })
            .catch(error => {
                console.log("게시판 데이터 로딩 실패: ", error);
            });
    }, [dispatch, id]);

    const handleChange = (e) => {
        const { id, value } = e.target;
        dispatch(setBoardDetails({ ...board, [id]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        const boardData = {
            title: board.title,
            content: board.content,
        };
        formData.append("boardData", JSON.stringify(boardData));
        if (files.length > 0) {
            for (let file of files) {
                formData.append("files", file);
            }
        }
        try {
            await axios.post(`/board/edit/${id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            alert('게시판 수정 성공');
            window.location.href = `/board/detail/${id}`;
        } catch (error) {
            console.error("수정 실패: ", error);
        }
    };

    const handleInput = (e) => {
        // 텍스트 입력이 끝난 후에 상태를 업데이트
        dispatch(setBoardDetails({ ...board, content: e.target.innerHTML }));
    };

    return (
        <div className="d-flex justify-content-center mt-5">
            <form onSubmit={handleSubmit}>
                <Card style={{ width: '50rem', padding: '2rem' }}>
                    <Card.Body>
                        <InputGroup className="mb-3">
                            <InputGroup.Text>제목</InputGroup.Text>
                            <Form.Control
                                type="text"
                                id="title"
                                value={board.title || ""}
                                onChange={handleChange}
                            />
                        </InputGroup>
                        <InputGroup className="mb-3">
                            <InputGroup.Text>내용</InputGroup.Text>
                            <div
                                id="content"
                                contentEditable
                                onBlur={handleInput} // onInput 대신 onBlur 사용
                                dangerouslySetInnerHTML={{ __html: board.content || "" }}
                                style={{
                                    width: '100%',
                                    minHeight: '300px',
                                    resize: 'none',
                                    border: '1px solid #ccc',
                                    padding: '10px',
                                    whiteSpace: 'pre-wrap', // 공백 및 줄 바꿈 처리
                                    overflowWrap: 'break-word',
                                    wordWrap: 'break-word',
                                    boxSizing: 'border-box',
                                    overflow: 'auto',
                                    textAlign: 'left', // 왼쪽 정렬
                                    lineHeight: '1.6', // 행간 조정
                                    display: 'block',
                                    direction: 'ltr', // 왼쪽에서 오른쪽으로 텍스트 방향 설정
                                }}
                            />
                        </InputGroup>
                        <div className="text-center">
                            <Button type="submit">수정 완료</Button>
                        </div>
                    </Card.Body>
                </Card>
            </form>
        </div>
    );
}

export default BoardEdit;
