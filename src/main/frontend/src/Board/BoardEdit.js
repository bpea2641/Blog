import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { setBoardDetails } from "../store";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Button, Card, Form, InputGroup } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

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

    const handleTitleChange = (e) => {
        dispatch(setBoardDetails({ ...board, title: e.target.value }));
    };

    const handleContentChange = (content) => {
        dispatch(setBoardDetails({ ...board, content }));
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

    const modules = {
        toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            [{ 'list': 'ordered'}, { 'list': 'bullet' }],
            ['bold', 'italic', 'underline'],
            [{ 'align': [] }],
            ['link', 'image', 'code-block'],
            [{ 'color': [] }, { 'background': [] }],
            ['clean']
        ]
    };

    return (
        <div className="d-flex justify-content-center mt-5">
            <form onSubmit={handleSubmit}>
                <Card style={{ width: '70rem', padding: '2rem' }}>
                    <Card.Body>
                        <InputGroup className="mb-3">
                            <InputGroup.Text>제목</InputGroup.Text>
                            <Form.Control
                                type="text"
                                id="title"
                                value={board.title || ""}
                                onChange={handleTitleChange}
                            />
                        </InputGroup>
                        
                        <ReactQuill
                            value={board.content || ''}
                            onChange={handleContentChange}
                            modules={modules}
                            style={{
                                height: '400px',
                                marginBottom: '4rem'
                            }}
                        />

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
