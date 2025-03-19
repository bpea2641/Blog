import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from './../store';
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Bootstrap Icons 가져오기
import { Button, Card, Form, InputGroup } from 'react-bootstrap';

function Login() {
  let user = useSelector((state) => state.user);  // Redux 상태에서 user 가져오기
  let dispatch = useDispatch();

  // handleChange 함수로 상태 업데이트
  const handleChange = (e) => {
    const { id, value } = e.target;
    dispatch(setUser({ ...user, [id]: value }));  // 상태 업데이트, username과 password만 갱신
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(user);
    try {
      const loginData = {
        username: user.username,
        password: user.password
      };

      const response = await axios.post('/login/jwt', loginData, {
        headers: { "Content-Type": "application/json" }
      });  // 로그인 요청 보내기

      const jwtToken = response.data;
      localStorage.setItem("jwt", jwtToken);

      alert('로그인 완료');
      console.log(response.data);
      window.location.href = '/';  // 홈으로 리디렉션
    } catch (error) {
      console.log('로그인 에러: ' + error);  // 오류 처리
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="d-flex justify-content-center" style={{ marginTop: '70px', marginBottom: '100px' }}>
          <Card style={{ width: '35rem', height: '33rem', padding: '2rem' }}>
            <Card.Body>
              <Card.Title className="text-center mb-3">로그인</Card.Title>
              <InputGroup className="mb-3" style={{height: '53px', marginTop: '31px'}}>
                <InputGroup.Text>
                  <i className="bi bi-person-fill"></i> {/* 아이콘 추가 */}
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  id="username"
                  value={user.username || ''}
                  placeholder="이름"
                  onChange={handleChange}
                />
              </InputGroup>
              <InputGroup className="mb-3" style={{height: '53px', marginTop: '20px'}}>
                <InputGroup.Text><i className="bi bi-lock-fill"></i></InputGroup.Text>
                <Form.Control
                  type="password"
                  id="password"
                  value={user.password || ''}
                  placeholder="비밀번호"
                  onChange={handleChange}
                />
              </InputGroup>
              <div className="text-center">
                <Button type="submit" style={{width: '460px', height: '45px'}}>로그인</Button>
                <Card.Text style={{marginTop: '10px'}}>or 소셜 로그인</Card.Text>
              </div>
            </Card.Body>
          </Card>
        </div>
      </form>
    </div>
  );
}

export default Login;
