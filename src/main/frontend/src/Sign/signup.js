import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Bootstrap Icons 가져오기
import { Button, Card, InputGroup } from 'react-bootstrap';
import {setUser} from './../store';
import { useDispatch, useSelector } from 'react-redux';
import Form from 'react-bootstrap/Form';


function Join() {
//  let user = useSelector((state) => {
//    return state.user;
//  })

  const [formData, setFormData] = useState({
    username: '',
    displayName: '',
    password: ''
  });

//  let dispatch = useDispatch();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/signup', formData);  // 회원가입 요청 보내기
      alert('회원가입 완료');
      window.location.href = '/';  // 회원가입 후 홈으로 리디렉션
    } catch (error) {
      console.log('회원가입 에러: ' + error);  // 오류 처리
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="d-flex justify-content-center" style={{ marginTop: '70px', marginBottom: '100px' }}>
          <Card style={{ width: '35rem', height: '33rem', padding: '2rem' }}>
            <Card.Body>
              <Card.Title className="text-center mb-3">회원가입</Card.Title>
              <InputGroup className="mb-3" style={{height: '53px', marginTop: '31px'}}>
                <InputGroup.Text>
                  <i className="bi bi-person-fill"></i> {/* 아이콘 추가 */}
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  id="username"
                  value={formData.username}
                  placeholder="이름"
                  onChange={handleChange}
                />
              </InputGroup>
              <InputGroup className="mb-3" style={{height: '53px', marginTop: '20px'}}>
                <InputGroup.Text><i className="bi bi-person-badge"></i></InputGroup.Text>
                <Form.Control
                  type="text"
                  id="displayName"
                  value={formData.displayName || ''}
                  placeholder="닉네임"
                  onChange={handleChange}
                />
              </InputGroup>
              <InputGroup className="mb-3" style={{height: '53px', marginTop: '20px'}}>
                <InputGroup.Text><i className="bi bi-lock-fill"></i></InputGroup.Text>
                <Form.Control
                  type="password"
                  id="password"
                  value={formData.password || ''}
                  placeholder="비밀번호"
                  onChange={handleChange}
                />
              </InputGroup>
              <div className="text-center">
                <Button type="submit" style={{width: '460px', height: '45px'}}>회원가입</Button>
                <Card.Text style={{marginTop: '10px'}}>or 소셜 로그인</Card.Text>
              </div>
            </Card.Body>
          </Card>
        </div>
      </form>
    </div>
  );
}

export default Join;
