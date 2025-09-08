import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBoard, setTag } from "../store";  // setTag 추가
import { Link } from "react-router-dom";
import { Card, InputGroup, Pagination } from 'react-bootstrap';

function BoardList() {
    const [id, setId] = useState(0);  // 현재 페이지 상태
    const [totalPages, setTotalPages] = useState(0);  // 전체 페이지 수 상태
    const board = useSelector((state) => state.board);  // 전체 board 객체 가져오기
    const dispatch = useDispatch();

    // 페이지 변경 시 호출되는 함수
    const handlePageChange = (newPage) => {
        setId(newPage);  // 새 페이지로 이동
        fetchBoardList(newPage);  // 게시판 목록 가져오기
    };

    const handleTagChange = (newTag) => {
        dispatch(setTag({ tag: newTag }));  // tag 상태 업데이트
    };

    const fetchBoardList = (page) => {
        const tag = board.tag || '';  // board 안의 tag 사용
        console.log("Fetching board list with tag:", tag);  // 요청할 때 사용되는 tag 확인
        const url = tag ? `/board/list/page/${page}?tag=${tag}` : `/board/list/page/${page}`;
        axios.get(url)
            .then(response => {
                dispatch(setBoard(response.data.boardList));  // 게시판 항목 업데이트
                setTotalPages(response.data.totalPages);  // totalPages 업데이트
            })
            .catch(error => {
                console.error(error);
            });
    };

    useEffect(() => {
        fetchBoardList(0);  // 페이지 로드 시 첫 번째 페이지 불러오기
    }, [board.tag]);  // board.tag가 변경될 때마다 게시판 목록 불러오기

    return (
        <div className="container">
            {/* 게시판 제목 */}
            <Card style={{ width: '79.8rem', paddingLeft: '20px', paddingRight: '20px', height: '3rem', marginTop: '28px' }}>
                <Card.Title style={{ textAlign: 'center', lineHeight: '3rem' }}>게시판</Card.Title>
            </Card>

            {/* 게시판 분류 토글 */}
            <div className="mt-3 mb-4">
                <label 
                    style={{
                        marginRight: '10px',
                        cursor: 'pointer',
                        color: board.tag === '공지사항' ? 'blue' : 'black'
                    }}
                    onClick={() => handleTagChange('공지사항')}
                >
                    공지사항
                </label>
                <label 
                    style={{
                        marginRight: '10px',
                        cursor: 'pointer',
                        color: board.tag === '일반' ? 'blue' : 'black'
                    }}
                    onClick={() => handleTagChange('일반')}
                >
                    일반
                </label>
                <label 
                    style={{
                        cursor: 'pointer',
                        color: board.tag === '질문' ? 'blue' : 'black'
                    }}
                    onClick={() => handleTagChange('질문')}
                >
                    질문
                </label>
            </div>

            <div className="d-flex mt-4">
                {/* 게시판 목록 */}
                <div className="flex-grow-1">
                    <ul className="list-group" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
                        {board.boardList.length > 0 ? (
                            board.boardList.map(item => (
                                <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center">
                                        <InputGroup.Text>
                                            <i className="bi bi-file-earmark-richtext"></i>
                                        </InputGroup.Text>
                                        <Link to={`/board/detail/${item.id}`} style={{ textDecoration: 'none', color: 'inherit', marginLeft: '10px' }}>
                                            {item.title}
                                        </Link>
                                    </div>
                                    <span className="badge bg-secondary ms-auto">작성자: {item.creatorName}</span>
                                </li>
                            ))
                        ) : (
                            <li className="list-group-item">게시물이 없습니다.</li>
                        )}
                    </ul>
                </div>
            </div>

            {/* 페이징 */}
            <div className="d-flex justify-content-center mt-4">
                <Pagination>
                    <Pagination.Prev onClick={() => handlePageChange(id - 1)} disabled={id === 0} />
                    {[...Array(totalPages)].map((_, index) => (
                        <Pagination.Item key={index} active={index === id} onClick={() => handlePageChange(index)}>
                            {index + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => handlePageChange(id + 1)} disabled={id === totalPages - 1} />
                </Pagination>
            </div>
        </div>
    );
}

export default BoardList;
