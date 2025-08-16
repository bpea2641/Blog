import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import {
  ChatContainer,
  MessageList,
  Message,
  MessageInput,
  ConversationHeader,
  Avatar,
  MessageInputProps
} from "@chatscope/chat-ui-kit-react";
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import { Paperclip } from "lucide-react";

const ChatRoom = ({ member, stompClient, currentUser }) => {
  const [messageList, setMessageList] = useState([]);
  const [input, setInput] = useState("");
  const fileInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  const [user1, user2] = [currentUser.displayName, member.displayName].sort();
  const roomKey = `${user1}-${user2}`;

  // 메시지 전송
  const sendMessage = (text, fileUrl = null, fileType = null) => {
    if (!stompClient || (!text.trim() && !fileUrl)) return;
    const message = {
      sender: currentUser.displayName,
      receiver: member.displayName,
      content: text.trim(),
      fileUrl,
      fileType,
      type: fileUrl ? "FILE" : "TALK"
    };
    stompClient.publish({
      destination: "/app/chat/private",
      body: JSON.stringify(message),
    });
    setInput("");
  };

  // 파일 업로드 후 메시지 전송
  const handleFilesUpload = async (acceptedFiles) => {
    const formData = new FormData();
    acceptedFiles.forEach(file => formData.append("files", file));

    try {
      const response = await axios.post("/chat/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      response.data.forEach(file => {
        sendMessage("", file.fileUrl, file.fileType);
      });
    } catch (err) {
      console.error("파일 업로드 실패:", err);
    }
  };

  // react-dropzone 세팅
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFilesUpload,
    noClick: true,
    noKeyboard: true
  });

  // 채팅 내역 자동 스크롤
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messageList]);

  // 이전 메시지 불러오기
  useEffect(() => {
    if (!member || !currentUser) return;
    axios.get("/chat/messages", {
      params: {
        sender: currentUser.displayName,
        receiver: member.displayName,
      },
    })
    .then(res => {
        setMessageList(res.data);
        axios.post("/chat/read", {
              sender: member.displayName,
              receiver: currentUser.displayName,
            });
        })
    .catch(err => console.error("메시지 불러오기 오류:", err));
  }, [member]);

  // STOMP 구독
  useEffect(() => {
    if (!stompClient || !member || !currentUser) return;
    const subscription = stompClient.subscribe(`/topic/private/${roomKey}`, (message) => {
      const msg = JSON.parse(message.body);
      setMessageList(prev => [...prev, msg]);
    });
    return () => subscription.unsubscribe();
  }, [stompClient, member, currentUser]);

  // 파일 타입별 메시지 렌더링
  const renderMessage = (msg) => {
    const type = msg.fileType || "";
    if (msg.fileUrl) {
      if (type.startsWith("image/")) {
        return <img src={msg.fileUrl} alt="이미지" style={{ maxWidth: "200px", borderRadius: "8px" }} />;
      } else if (type.startsWith("video/")) {
        return (
          <video controls width="250">
            <source src={msg.fileUrl} type={type} />
          </video>
        );
      } else if (type.startsWith("audio/")) {
        return (
          <audio controls>
            <source src={msg.fileUrl} type={type} />
          </audio>
        );
      } else {
        return (
          <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">
            {decodeURIComponent(msg.fileUrl.split("/").pop())} 다운로드
          </a>
        );
      }
    }
    return msg.content;
  };

  // 클릭 파일 업로드
  const handleFileIconClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileInputChange = (e) => {
    const files = Array.from(e.target.files);
    handleFilesUpload(files);
    e.target.value = ""; // 같은 파일 다시 선택 가능하게
  };

  return (
    <div
      {...getRootProps()}
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        outline: isDragActive ? "2px dashed #007bff" : "none",
        backgroundColor: isDragActive ? "#f0f8ff" : "white"
      }}
    >
      <input {...getInputProps()} />
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        style={{ display: "none" }}
        multiple
      />

      <ChatContainer style={{ height: "100%" }}>
        <ConversationHeader>
          <Avatar src={member.profileImage || "https://via.placeholder.com/40"} />
          <ConversationHeader.Content
            userName={member.displayName}
            info="1:1 채팅 중"
          />
        </ConversationHeader>

        <MessageList typingIndicator={false}>
          {messageList.map((msg, idx) => {
            const isOutgoing = msg.sender === currentUser.displayName;
            return (
              <Message
                key={idx}
                model={{
                  message: msg.fileUrl ? "" : msg.content,
                  sentTime: msg.createdAt || "방금 전",
                  sender: msg.sender,
                  direction: isOutgoing ? "outgoing" : "incoming",
                  position: "normal"
                }}
              >
                {msg.fileUrl && (
                  <Message.CustomContent>
                    {renderMessage(msg)}
                  </Message.CustomContent>
                )}
              </Message>
            );
          })}
          <div ref={messagesEndRef} />
        </MessageList>

        <MessageInput
          placeholder="메시지를 입력하세요..."
          value={input}
          onChange={val => setInput(val)}
          onSend={() => sendMessage(input)}
          attachButton={true}
          onAttachClick={handleFileIconClick}
          attachButtonIcon={<Paperclip size={20} />}
        />
      </ChatContainer>
    </div>
  );
};

export default ChatRoom;
