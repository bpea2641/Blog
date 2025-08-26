import { useState, useRef, useEffect } from 'react';
import { Offcanvas, Button, Container, Row, Col, ButtonGroup, Form, FormControl, InputGroup } from 'react-bootstrap';
import './BodyCss/OCV.css'
import CircularText from '../Component/CircularText';
import axios from 'axios';

function OCV() {
  const [show, setShow] = useState(false);
  const [mode, setMode] = useState('general'); // 'general' or 'blog'
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if(!userInput.trim()) return;

    const newMessages = [...messages, { type: 'user', text: userInput }];
    setMessages(newMessages);
    const currentInput = userInput;
    setUserInput("");

    try {
        const res = await axios.post("/AIChat1", {
            message: currentInput,
        });

        setMessages(prev => [...prev, { type: 'ai', text: res.data.response }]);

    } catch (err) {
        console.log(err);
        setMessages(prev => [...prev, { type: 'error', text: 'Error: Could not get AI response.' }]);
    }
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
          zIndex: 10
        }}>
          AI
        </div>
      </div>

      <Offcanvas show={show} onHide={handleClose} className="chat-offcanvas">
        <Offcanvas.Body style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Container fluid className="d-flex flex-column h-100">
            <Row className="flex-grow-1">
              <Col sm={2} style={{ borderRight: '1px solid #dee2e6', paddingTop: '1rem' }}>
                <h4 style={{marginBottom: '1rem', textAlign: 'center'}}>블로그 AI 채팅</h4>
                <ButtonGroup vertical className="w-100" style={{marginTop: '1rem'}}>
                  <Button className="mb-4" variant={mode === 'general' ? 'primary' : 'outline-primary'} onClick={() => setMode('general')}>
                    일반 챗
                  </Button>
                  <Button variant={mode === 'blog' ? 'primary' : 'outline-primary'} onClick={() => setMode('blog')}>
                    블로그 챗
                  </Button>
                </ButtonGroup>
              </Col>

              <Col sm={9} className="d-flex flex-column">
                <div className="message-area flex-grow-1 mt-3">
                  {messages.map((msg, index) => (
                    <div key={index} className={`message-bubble ${msg.type === 'user' ? 'user-message' : 'ai-message'}`}>
                      <div className="message-sender">{msg.type === 'user' ? '나' : 'AI'}</div>
                      <div className="message-text">{msg.text}</div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <Form className="mt-3">
                  <Form.Label>입력</Form.Label>
                    <InputGroup>
                      <FormControl
                        as="textarea"
                        placeholder="무엇이든 물어보세요"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendMessage();
                        }
                      }}
                      style={{ resize: 'none', height: '80px' }}
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
