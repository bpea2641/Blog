package com.Blog.myBlog.Chat;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ChatMessageDto {
    private String sender;
    private String receiver;
    private String content;
    private String type;
    private String createdAt;

    private String fileUrl;    // 추가
    private String fileType;   // 추가

    public ChatMessageDto(String displayName, String receiver, String message, String talk, String string) {
    }
}
