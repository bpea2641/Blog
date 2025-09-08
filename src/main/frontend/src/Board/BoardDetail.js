import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams, useNavigate } from "react-router-dom";
import { setBoard, setUser } from "../store";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Bootstrap Icons 가져오기
import { Button, Card } from 'react-bootstrap';
import parse, { domToReact } from 'html-react-parser';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';

function BoardDetails() {
    let { id } = useParams();
    let boardDetail = useSelector((state) => state.board.boardList); // The detail object is here
    let dispatch = useDispatch();
    let user = useSelector((state) => state.user);
    let navigate = useNavigate();

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
                dispatch(setBoard(response.data));
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
                navigate('/');
            })
            .catch(error => {
                console.error(error);
                alert('게시판 삭제 실패');
            });
        }
    };

    const options = {
        replace: ({ attribs, children }) => {
            if (attribs && attribs.class === 'ql-syntax') {
                const codeText = children.map(child => child.data).join('');
                return (
                    <SyntaxHighlighter language="javascript" style={dark}>
                        {codeText}
                    </SyntaxHighlighter>
                );
            }
        }
    };

    return (
        <div className="container" style={{ marginTop: '20px' }}>
            <Card style={{ padding: '20px' }}>
                <Card.Title style={{ fontSize: '2rem', textAlign: 'left' }}>{boardDetail.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted" style={{ textAlign: 'left' }}>
                    {boardDetail.creatorName}
                </Card.Subtitle>
            </Card>

            <Card style={{ padding: '20px', marginTop: '20px' }}>
                <Card.Body style={{ textAlign: 'left' }}>
                    {boardDetail.content && parse(boardDetail.content, options)}
                </Card.Body>
            </Card>

            {user.id === boardDetail.creatorId && (
                <div className="d-flex justify-content-end mt-3">
                    <Link to={`/board/edit/${id}`} className="btn btn-outline-primary me-2">
                        <i className="bi bi-pencil-square"></i> 수정
                    </Link>
                    <Button variant="outline-danger" onClick={handleDelete}>
                        <i className="bi bi-trash"></i> 삭제
                    </Button>
                </div>
            )}
        </div>
    );
}

export default BoardDetails;
