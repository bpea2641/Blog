import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import ChatRoom from "./ChatRoom";
import { useSelector } from "react-redux";
import { Container, Row, Col, ListGroup, Card, Spinner } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';

const Chat = () => {
  const [stompClient, setStompClient] = useState(null);
  const [memberList, setMemberList] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const currentUser = useSelector((state) => state.user);

  useEffect(() => {
    axios.get("/memberList")
      .then(res => {
        setMemberList(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws-stomp");
    const client = new Client({ webSocketFactory: () => socket });
    client.activate();
    setStompClient(client);
    return () => client.deactivate();
  }, []);

  const handleSelectMember = (member) => {
    if (selectedMember?.id !== member.id) {
        setSelectedMember(member);
    }
  };

  return (
    <Container fluid style={{ height: "calc(100vh - 56px)" }}> {/* Assuming a navbar height of 56px */}
      <Row style={{ height: "100%" }}>
        <Col md={3} className="p-0" style={{ borderRight: "1px solid #dee2e6", height: "100%", display: 'flex', flexDirection: 'column' }}>
          <Card className="h-100 border-0 rounded-0">
            <Card.Header className="bg-light border-bottom">
              <h5 className="mb-0">대화 상대</h5>
            </Card.Header>
            {loading ? (
              <div className="d-flex justify-content-center align-items-center h-100">
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              </div>
            ) : (
              <ListGroup variant="flush" style={{ overflowY: "auto" }}>
                {memberList
                  .filter((member) => member.displayName !== currentUser.displayName)
                  .map((member) => (
                    <ListGroup.Item
                      key={member.id}
                      action
                      active={selectedMember?.id === member.id}
                      onClick={() => handleSelectMember(member)}
                      className="d-flex align-items-center"
                    >
                      <img 
                        src={member.profileImage || '/UserProfileImages/default.png'} 
                        alt={member.displayName}
                        className="rounded-circle me-3" 
                        style={{ width: '40px', height: '40px', objectFit: 'cover' }} 
                        onError={(e) => { e.target.onerror = null; e.target.src='/UserProfileImages/default.png'; }}
                      />
                      {member.displayName}
                    </ListGroup.Item>
                  ))}
              </ListGroup>
            )}
          </Card>
        </Col>

        <Col md={9} className="p-0" style={{ height: "100%" }}>
          {selectedMember ? (
            <ChatRoom
              member={selectedMember}
              stompClient={stompClient}
              currentUser={currentUser}
            />
          ) : (
            <div className="d-flex justify-content-center align-items-center h-100 text-muted">
              <h4>대화할 상대를 선택해주세요.</h4>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default Chat;