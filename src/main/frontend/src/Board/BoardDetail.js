import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useNavigate } from "react-router-dom";
import { setBoard, setUser } from "../store";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Bootstrap Icons 가져오기
import { Button, Card } from 'react-bootstrap';

function BoardDetails() {
    let { id } = useParams();
    let board = useSelector((state) => state.board.boardList);
    let dispatch = useDispatch();
    let user = useSelector((state) => state.user);
    let navigate = useNavigate();  // 페이지 이동을 위한 useNavigate 추가

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

        axios.get(`/board/detail/${id}`)
            .then(response => {
                dispatch(setBoard(response.data)); // Redux에는 순수 데이터만 저장
            })
            .catch(error => {
                console.error(error);
            });
    }, [id, dispatch]);

    const handleDelete = () => {
        let jwtToken = localStorage.getItem("jwt");

        if(jwtToken) {
            axios.delete(`/board/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                }
            })
            .then(response => {
                alert('게시판 삭제 성공');
                navigate('/');  // 삭제 후 메인 페이지로 이동
            })
            .catch(error => {
                console.error(error);
                alert('게시판 삭제 실패');
            });
        }
    };

    return (
        <div className="container" style={{ marginTop: '20px' }}>
            {/* 게시판 제목 카드 */}
            <Card style={{ padding: '20px' }}>
                <Card.Title style={{ fontSize: '2rem', textAlign: 'left' }}>{board.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted" style={{ textAlign: 'left' }}>
                    {board.creator}
                </Card.Subtitle>
            </Card>

            {/* 게시판 내용 카드 */}
            <Card style={{ padding: '20px', marginTop: '20px' }}>
                <Card.Body>
                    <div 
                        style={{ whiteSpace: "pre-wrap", wordWrap: "break-word", textAlign: 'left' }} 
                        dangerouslySetInnerHTML={{ __html: board.content }}
                    ></div>
                </Card.Body>
            </Card>

            {user.username ? (
                <>
                    <Link to={`/board/edit/${id}`}>
                        <Button>수정버튼</Button>
                    </Link>
                    <Button onClick={handleDelete} variant="danger">삭제버튼</Button>
                </>
            ) : (
                <div></div>
            )}
        </div>
    );
}

export default BoardDetails;
