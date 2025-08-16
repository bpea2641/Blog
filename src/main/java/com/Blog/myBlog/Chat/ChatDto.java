package com.Blog.myBlog.Chat;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ChatDto {
    private String sender;
    private String receiver;
    private String content;
    private String fileUrl;
    private String fileType;
    private String type;
}
