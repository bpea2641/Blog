import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setBoard } from "../store";
import { Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Bootstrap Icons 가져오기
import { Card, InputGroup, Pagination } from 'react-bootstrap';

function BoardList() {
    const [id, setId] = useState(0); // 현재 페이지 번호 상태 관리
    const [totalPages, setTotalPages] = useState(0); // 전체 페이지 수 상태 관리
    const board = useSelector((state) => state.board.boardList); // 게시판 목록
    const dispatch = useDispatch();

    // 페이지 변경 시 호출되는 함수
    const handlePageChange = (newPage) => {
        setId(newPage); // 새 페이지로 이동
        axios.get(`/board/list/page/${newPage}`)
            .then(response => {
                dispatch(setBoard(response.data.boardList)); // 게시판 항목 업데이트
                setTotalPages(response.data.totalPages); // totalPages 업데이트
            })
            .catch(error => {
                console.error(error);
            });
    };


    useEffect(() => {
        // 페이지 로드 시 첫 번째 페이지 불러오기
        handlePageChange(0);
    }, []);

    return (
        <div className="container">
            {/* 게시판 제목 */}
            <Card style={{ width: '79.8rem', paddingLeft: '20px', paddingRight: '20px', height: '3rem', marginTop: '28px' }}>
                <Card.Title style={{ textAlign: 'center', lineHeight: '3rem' }}>게시판</Card.Title>
            </Card>

            <div className="d-flex mt-4">
                {/* 왼쪽 프로필 카드 */}
                <Card style={{ width: '18rem', marginRight: '20px' }}>
                    <Card.Body>
                        <Card.Title>프로필</Card.Title>
                        <Card.Text>
                            {/* 나중에 프로필 내용 추가 예정 */}
                            여기 프로필 정보를 넣을 수 있습니다.
                        </Card.Text>
                    </Card.Body>
                </Card>

                {/* 게시판 목록 */}
                <div className="flex-grow-1">
                    <ul className="list-group" style={{ paddingLeft: '20px', paddingRight: '20px' }}>
                        {
                            Array.isArray(board) && board.length > 0 ? (
                                board.map(item => (
                                    <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
                                        <div className="d-flex align-items-center">
                                            <InputGroup.Text>
                                                <i className="bi bi-file-earmark-richtext"></i>
                                            </InputGroup.Text>
                                            <Link to={`/board/detail/${item.id}`} style={{ textDecoration: 'none', color: 'inherit', marginLeft: '10px' }}>
                                                {item.title}
                                            </Link>
                                        </div>
                                        <span className="badge bg-secondary ms-auto">작성자: {item.creator}</span>
                                    </li>
                                ))
                            ) : (
                                <li className="list-group-item">게시물이 없습니다.</li>
                            )
                        }
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
