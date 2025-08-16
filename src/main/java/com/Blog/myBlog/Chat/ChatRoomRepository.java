package com.Blog.myBlog.Chat;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

    @Query("SELECT r FROM ChatRoom r JOIN r.members m1 JOIN r.members m2 " +
    "WHERE m1.id = :id1 AND m2.id = :id2 AND SIZE(r.members) = 2")
    Optional<ChatRoom> findRoomByTwoMembers(@Param("id1") Long id1, @Param("id2") Long id2);

}