import {Container, Col, Image, Row} from 'react-bootstrap';


function Container1() {
    return (
    <Container>
      <Row style={{marginTop : '100px', marginBottom: '100px'}}>
        <Col xs={6} md={4}>
          <Image src="/images/180x180.png" rounded />
        </Col>
        <Col xs={6} md={4}>
          <Image src="/images/180x180.png" roundedCircle />
        </Col>
        <Col xs={6} md={4}>
          <Image src="/images/180x180.png" thumbnail />
        </Col>
      </Row>
    </Container>
    )
}

export default Container1;