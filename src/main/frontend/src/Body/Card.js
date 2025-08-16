import {Container, Card, Col, Image, Row, Button} from 'react-bootstrap';
import { useEffect, useState } from 'react';
import SplitText from "../Component/SplitText";
import Orb from '../Component/Orb';
import ScrollReveal from '../Component/ScrollReveal';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import RSpng from '../Component/PNG/transparent-Photoroom.jpg'

gsap.registerPlugin(ScrollTrigger);

function Card1() {

  useEffect(() => {
    fetch("/increase", {method: 'POST'});
  }, []);

  return (
  <div style={{ width: '100%', height: '650px', position: 'relative', backgroundColor: 'black'}}>
    <Orb
      hoverIntensity={0.5}
      rotateOnHover={true}
      hue={0}
      forceHoverState={false}
    />
      <div style={{
        position: 'absolute',
        top: 0, left: 0,
        width: '100%', height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {/* 카드 */}
        <Card style={{
          width: "100%",
          height: "650px",
          border: "none",
          backgroundColor: 'transparent', // 투명
          position: 'relative',
          zIndex: 1
        }}>
        <Card.Body>
          <Card.Title style={{ fontSize: "4rem", marginTop: "170px", color: 'white' }}>
          <SplitText
          text="Blog"
          className="text-2xl font-semibold text-center"
          delay={100}
          duration={0.6}
          ease="power3.out"
          splitType="chars"
          from={{ opacity: 0, y: 40 }}
          to={{ opacity: 1, y: 0 }}
          threshold={0.1}
          rootMargin="-100px"
          textAlign="center"
          onLetterAnimationComplete={() => console.log("완료!")}
         />
          </Card.Title>
          <Card.Title style={{marginTop: '100px', color: 'white'}}>
              <SplitText
                text="저의 블로그에 오신걸 환영합니다."
                className="text-2xl font-semibold text-center"
                delay={100}
                duration={0.6}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-100px"
                textAlign="center"
                onLetterAnimationComplete={() => console.log("완료!")}
               />
          </Card.Title>
        </Card.Body>
      </Card>
    </div>
  </div>
  );
}

function Card2() {
  const [selectedCategory, setSelectedCategory] = useState('Front'); // 정보 표기. default는 Front.
  useEffect(() => {
    // Flexbox 레이아웃이 적용된 후 ScrollTrigger가 위치를 재계산하도록 약간의 딜레이 후 refresh 실행
    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 100); // 100ms 딜레이

    return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 제거
  }, []); // 마운트 시 한 번만 실행

  return (
    <Card style={{ width: '100%', height: '50px', border: 'none', marginTop: '100px'}}>
      <Card.Body>
        <style>
          {`
            .custom-scroll-text {
              font-size: 1.2rem !important;
              font-weight: 400 !important;
            }
            .custom-scroll-text strong {
              font-weight: 400 !important;
            }
          `}
        </style>
        <div className="d-flex align-items-center" style={{gap: '2rem'}}>
          <Image src={RSpng} rounded style={{flex: 4}}/>
          <Card.Text style={{ flex: 6 }}>
            <ScrollReveal
              baseOpacity={0}
              enableBlur={true}
              baseRotation={5}
              blurStrength={10}
              textClassName="custom-scroll-text"
              wordAnimationEnd="bottom center"
            >
              저의 블로그는 React와 Spring Boot (JPA)를 사용한 풀스택 애플리케이션입니다.
              보안에는 Spring Security가 적용되었고, UI 컴포넌트는 React-Bootstrap, 상태 관리는 Redux로 처리되었습니다.
              데이터베이스는 MySQL을 사용하여 데이터를 관리합니다.
            </ScrollReveal>
          </Card.Text>
        </div>
        <Card.Title style={{ fontSize: '3rem', marginTop: '130px'}}>무슨 기술이 쓰였나요?</Card.Title>
        <div className="d-flex justify-content-center mb-4" style={{ gap: '20rem', marginTop: '35px' }}>
          <Button variant={selectedCategory === 'Front' ? 'primary' : 'outline-primary'} onClick={() => setSelectedCategory('Front')} className="mx-4">Front</Button>
          <Button variant={selectedCategory === 'Back' ? 'primary' : 'outline-primary'} onClick={() => setSelectedCategory('Back')} className="mx-4">Back</Button>
          <Button variant={selectedCategory === 'Database' ? 'primary' : 'outline-primary'} onClick={() => setSelectedCategory('Database')} className="mx-4">Database</Button>
        </div>
        {selectedCategory === 'Front' && (
          <Container>
            <Row style={{marginTop : '100px'}} className="align-items-center">
              <Col md={4} className="d-flex flex-column align-items-start">
                <Row className="w-100 justify-content-start mb-3">
                  <Col xs={6} className="text-center">
                    <Image src="/images/react.png" rounded style={{width: '100px', height: '100px'}}/>
                  </Col>
                  <Col xs={6} className="text-center">
                    <Image src="/images/bootstrap.png" rounded style={{width: '150px', height: '100px'}}/>
                  </Col>
                </Row>
                <Row className="w-100 justify-content-center">
                  <Col xs={6} className="text-center">
                    <Image src="/images/redux.png" rounded style={{width: '200px', height: '100px'}}/>
                  </Col>
                </Row>
              </Col>
              <Col md={8}>
                <p style={{ fontSize: '1.2rem', marginBottom: '8rem' }}>
                  이 블로그의 프론트엔드는 React를 기반으로 구축되었습니다.<br/>
                  사용자 인터페이스는 React-Bootstrap 컴포넌트와 함께 ReactBits 등을 사용하여 개발되었으며,<br/>
                  애플리케이션의 상태 관리는 Redux를 통해 효율적으로 이루어집니다.
                </p>
              </Col>
            </Row>
          </Container>
        )}
        {selectedCategory === 'Back' && (
          <Container>
            <Row style={{marginTop : '100px'}} className="justify-content-center align-items-center">
              <Col xs={6} md={4} className="text-center mb-4">
                <Image src="/images/spring.png" rounded style={{width: '200px', height: '150px'}}/>
              </Col>
              <Col xs={6} md={4} className="text-center mb-4">
                <p style={{fontSize: '1.2rem'}}>
                    이 블로그의 백엔드는 Spring Boot를 기반으로 구축되었습니다.<br />
                    RESTful API를 통해 프론트엔드와 통신하며, Spring Security를 활용하여 사용자 인증 및 권한 부여를 안전하게 처리합니다.
                </p>
              </Col>
              <Col xs={6} md={4} className="text-center mb-4">
                <Image src="/images/security.png" rounded style={{width: '150px', height: '150px'}}/>
              </Col>
            </Row>
          </Container>
        )}
        {selectedCategory === 'Database' && (
          <Container>
            <Row style={{marginTop : '100px'}} className="justify-content-center align-items-center">
              <Col xs={8} md={6} className="text-center mb-4">
                <Image src="/images/mysql.png" rounded style={{width: '150px', height: '150px'}}/>
              </Col>
              <Col xs={4} md={6} className="text-center mb-4">
                <p style={{ fontSize: '1.2rem', marginBottom: '3rem' }}>
                    이 블로그는 MySQL 데이터베이스를 사용하여 모든 데이터를 저장하고 관리합니다. <br />
                    효율적인 데이터 모델링과 쿼리 최적화를 통해 안정적이고 빠른 데이터 접근을 제공합니다.
                </p>
              </Col>
            </Row>
          </Container>
        )}
      </Card.Body>
    </Card>
    )
}

export {Card1, Card2};