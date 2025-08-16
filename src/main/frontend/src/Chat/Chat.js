import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from "@stomp/stompjs";
import axios from "axios";
import ChatRoom from "./ChatRoom";
import { useSelector } from "react-redux";

const Chat = () => {
  const [stompClient, setStompClient] = useState(null);
  const [memberList, setMemberList] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const currentUser = useSelector((state) => state.user);

  useEffect(() => {
    axios.get("/memberList")
      .then(res => setMemberList(res.data))
      .catch(err => console.log(err));
  }, []);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws-stomp");
    const client = new Client({ webSocketFactory: () => socket });
    client.activate();
    setStompClient(client);
    return () => client.deactivate();
  }, []);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ width: "250px", borderRight: "1px solid #ccc", padding: "10px", overflowY: "auto" }}>
        <h3>회원 목록</h3>
        {memberList
          .filter((member) => member.displayName !== currentUser.displayName)
          .map((member) => (
            <div
              key={member.id}
              onDoubleClick={() => setSelectedMember(member)}
              style={{
                padding: "5px",
                cursor: "pointer",
                backgroundColor: selectedMember?.id === member.id ? "#eee" : "transparent"
              }}
            >
              {member.displayName}
            </div>
        ))}
      </div>

      <div style={{ flex: 1, padding: "10px" }}>
        {selectedMember ? (
          <ChatRoom
            member={selectedMember}
            stompClient={stompClient}
            currentUser={currentUser}
          />
        ) : (
          <div>대화할 회원을 더블 클릭하세요.</div>
        )}
      </div>
    </div>
  );
};

export default Chat;