import {Container, Card, Col, Image, Row} from 'react-bootstrap';
import Lottie from 'react-lottie';
import { useEffect, useState } from 'react';

function Card1() {
  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch("/AnimeJson/Hello.json")
      .then((response) => response.json())
      .then((data) => setAnimationData(data));
  }, []);

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid meet", // 비율 유지하면서 컨테이너 크기에 맞춤
    },
  };
  

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {/* 카드 */}
      <Card style={{ width: "50%", height: "500px", border: "none" }}>
        <Card.Body>
          <Card.Title style={{ fontSize: "4rem", marginTop: "130px" }}>
            타이틀
          </Card.Title>
          <Card.Text style={{ fontSize: "1.5rem", marginTop: "80px" }}>
            해당 카드 내용
          </Card.Text>
        </Card.Body>
      </Card>
      <Container style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center", overflow: "visible" }}>
  <div style={{ width: "500px", height: "500px" }}>
    {animationData && <Lottie options={defaultOptions} height="100%" width="100%" />}
  </div>
</Container>


    </div>
  );
}

function Card2() {
    return (
    <Card style={{ width: '100%', height: '50px', border: 'none' }}>
      <Card.Body>
        <Card.Title style={{ fontSize: '3rem', marginTop: '130px'}}>무슨 기술이 쓰였나요?</Card.Title>
        <Container>
          <Row style={{marginTop : '100px', marginBottom: '100px'}}>
            <Col xs={6} md={4}>
              <Image src="/images/react.png" rounded style={{width: '150px', height: '150px'}}/>
            </Col>
            <Col xs={6} md={4}>
              <Image src="/images/spring.png" rounded style={{width: '200px', height: '150px'}}/>
            </Col>
            <Col xs={6} md={4}>
              <Image src="/images/bootstrap.png" rounded style={{width: '250px', height: '150px'}}/>
            </Col>
          </Row>
          <Row style={{marginTop : '100px', marginBottom: '100px'}}>
            <Col xs={6} md={4}>
              <Image src="/images/mysql.png" rounded style={{width: '150px', height: '150px'}}/>
            </Col>
            <Col xs={6} md={4}>
              <Image src="/images/redux.png" rounded style={{width: '300px', height: '150px'}}/>
            </Col>
            <Col xs={6} md={4}>
              <Image src="/images/security.png" rounded style={{width: '150px', height: '150px'}}/>
            </Col>
          </Row>
        </Container>
        <Card.Text style={{ fontSize: '1.6rem' }}>
          저의 블로그는 <strong>React</strong>와 <strong>Spring Boot (JPA)</strong>를 사용한 <strong>풀스택</strong> 애플리케이션입니다. <br />
          보안에는 <strong>Spring Security</strong>가 적용되었고, UI 컴포넌트는 <strong>React-Bootstrap</strong>, 상태 관리는 <strong>Redux</strong>로 처리되었습니다. <br />
          데이터베이스는 <strong>MySQL</strong>을 사용하여 데이터를 관리합니다.
        </Card.Text>
      </Card.Body>
    </Card>
    )
}

export {Card1, Card2};