import { useState } from 'react';
import { Offcanvas, Button, Container, Row, Col, ButtonGroup, Form, FormControl, InputGroup } from 'react-bootstrap';
import './BodyCss/OCV.css'
import CircularText from '../Component/CircularText';
import axios from 'axios';

function OCV() {
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState('general'); // 'general' or 'blog'
  const [userInput, setUserInput] = useState([]);
  const [messages, setMessages] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const sendMessage = async () => {
    if(!userInput.trim()) return;

    setMessages(prevMessages => [...prevMessages, { type: 'user', text: userInput }]);

    try {
        const res = await axios.post("/AIChat1", {
            message: userInput, // 백엔드도 "message" key로 받도록
        });

        setMessages(prevMessages => [...prevMessages, { type: 'ai', text: res.data.response }]);

    } catch (err) {
        console.log(err);
        setMessages(prevMessages => [...prevMessages, { type: 'error', text: 'Error: Could not get AI response.' }]);
    }

    setUserInput("");
  }
  return (
    <div style={{ position: 'sticky', bottom: 65, marginLeft: '73rem', zIndex: 300}}>
      <div onClick={handleShow} style={{ position: 'relative', width: '200px', height: '200px', margin: '0 auto' }}>
        <CircularText
          text="GENERAL*BOTS*BLOG*"
          onHover="speedUp"
          spinDuration={20}
          className="custom-class"
        />
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          color: 'blue',
          fontSize: '2rem',
          fontWeight: 'bold',
          zIndex: 10 // Ensure it's above the rotating text
        }}>
          AI
        </div>
      </div>

      <Offcanvas show={show} onHide={handleClose} className="chat-offcanvas">
        <Offcanvas.Body style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Container fluid className="d-flex flex-column h-100">
            <Row className="flex-grow-1">
              {/* Sidebar */}
              <Col sm={3} style={{ borderRight: '1px solid #dee2e6', paddingTop: '1rem' }}>
                <h4 style={{marginBottom: '1rem', textAlign: 'center'}}>AI Chat</h4>
                <ButtonGroup vertical className="w-100">
                  <Button className="mb-4" variant={mode === 'general' ? 'primary' : 'outline-primary'} onClick={() => setMode('general')}>
                    일반 챗
                  </Button>
                  <Button variant={mode === 'blog' ? 'primary' : 'outline-primary'} onClick={() => setMode('blog')}>
                    블로그 챗
                  </Button>
                </ButtonGroup>
              </Col>

              {/* Main Chat Area */}
              <Col sm={9} className="d-flex flex-column">
                {/* Response Area */}
                <Form.Group className="flex-grow-1 d-flex flex-column mt-3">
                  <Form.Label>AI Response</Form.Label>
                    <FormControl
                      as="textarea"
                      readOnly
                      value={messages.map(msg => `${msg.type === 'user' ? '사용자' : 'AI'}: ${msg.text}`).join('\n\n')}
                      style={{ flex: 1, resize: 'none' }}
                    />
                </Form.Group>

                {/* Input Area */}
                <Form className="mt-3">
                  <Form.Label>Content</Form.Label>
                    <InputGroup>
                      <FormControl
                        placeholder="무엇이든 물어보세요"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault(); // Prevent default form submission
                          sendMessage();
                        }
                      }}
                      />
                      <Button variant="outline-secondary" onClick={sendMessage}>
                        Send
                      </Button>
                    </InputGroup>
                </Form>
              </Col>
            </Row>
          </Container>
        </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default OCV;