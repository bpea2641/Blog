package com.Blog.myBlog.Chat;

import java.util.List;

import com.Blog.myBlog.Member.Member;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ChatRepository extends JpaRepository<Chat, Long> {

    List<Chat> findByChatRoomOrderByCreatedAtAsc(ChatRoom room);

    @Modifying
    @Query("UPDATE Chat c SET c.isRead = true WHERE c.chatRoom = :room AND c.sender != :reader AND c.isRead = false")
    void markMessagesAsRead(@Param("room") ChatRoom room, @Param("reader") Member reader);
}
