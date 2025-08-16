// 위치: com.Blog.myBlog.Chat.dto.ChatMessage.java
package com.Blog.myBlog.Chat;

import lombok.Data;

@Data
public class ChatMessage {
    private String sender;     // 보낸 사람 (username 또는 id)
    private String receiver;   // 받는 사람 (username 또는 id)
    private String content;    // 메시지 내용
    private String fileUrl;    // 추가
    private String fileType;   // 추가
    private String type;       // 메시지 타입: TALK, JOIN, LEAVE 등
}
