package com.Blog.myBlog.Chat;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

import com.Blog.myBlog.Member.Member;

@Entity
@Data
public class Chat {
    @Id @GeneratedValue
    public Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    public Member sender;

    public String message;

    public String fileUrl;    // 추가
    public String fileType;   // 추가

    @Column(nullable = false)
    private boolean isRead = false;

    public LocalDateTime createdAt;

    @ManyToOne(fetch = FetchType.LAZY)
    public ChatRoom chatRoom;  // 이 필드가 있으면 채팅방 구분 가능
}
