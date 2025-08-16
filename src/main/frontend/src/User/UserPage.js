import { useDispatch, useSelector } from "react-redux";
import { Card, ListGroup, Container, Row, Col, Image } from "react-bootstrap";
import { useEffect, useState } from "react";
import { setUser } from "../store";
import axios from "axios";
import ProfileImageSelector from "./ProfileImageSelector";

function UserPage() {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);

  // 사용자 정보를 가져오는 useEffect
  useEffect(() => {
    let jwtToken = localStorage.getItem("jwt");

    if (jwtToken) {
      axios
        .get("/user", {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
        })
        .then((response) => {
          console.log("초기 유저 정보: ", response.data);
          dispatch(setUser(response.data));
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [dispatch]);

  // 프로필 이미지 변경 함수
  const handleProfileImageChange = (newImage) => {
    const jwtToken = localStorage.getItem("jwt");
  
    if (!jwtToken) {
      alert("로그인 후 사용해주세요.");
      return;
    }
  
    axios
      .put(
        "/user/profile-image",
        { profileImage: newImage },
        {
          headers: {
            Authorization: `Bearer ${jwtToken}`,
          },
          withCredentials: true, // 쿠키 기반 인증도 함께 사용할 경우
        }
      )
      .then((response) => {
        console.log("프로필 이미지 업데이트 : ", response.data);
  
        // 새 토큰 저장
        localStorage.setItem("jwt", response.data.token);
  
        // axios 기본 헤더 Authorization 업데이트
        axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
  
        // 새 유저 정보 리덕스 상태에 반영
        dispatch(setUser({ ...response.data.user }));
      })
      .catch((error) => {
        if (error.response) {
          console.error("서버 응답 에러 상태 코드:", error.response.status);
          console.error("서버 응답 데이터:", error.response.data);
          if (error.response.status === 401) {
            alert("인증되지 않은 사용자입니다. 로그인 해주세요.");
          }
        } else {
          console.error("네트워크 에러 또는 요청 에러:", error.message);
        }
      });
  };
  
  

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow-lg rounded-4">
            <Card.Body className="text-center">
              <Image
                src={user.profileImage}
                roundedCircle
                width={150}
                height={150}
                className="mb-4"
                onClick={() => setShowModal(true)}  // 이미지 클릭 시 모달 열기
                style={{ cursor: "pointer", border: "3px solid #ddd" }}
              />
              <Card.Title className="fs-3">{user.displayName}</Card.Title>
              <Card.Subtitle className="mb-3 text-muted">@{user.username}</Card.Subtitle>
              <ListGroup variant="flush" className="text-start">
                <ListGroup.Item>
                  <strong>유저명:</strong> {user.username}
                </ListGroup.Item>
                <ListGroup.Item>
                  <strong>닉네임:</strong> {user.displayName}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <ProfileImageSelector
        show={showModal}
        onClose={() => setShowModal(false)}  // 모달 닫기
        onSelect={handleProfileImageChange}  // 이미지 선택 시 처리
      />
    </Container>
  );
}

export default UserPage;
