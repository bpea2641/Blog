package com.Blog.myBlog.Member;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

public interface MemberRepository extends JpaRepository<Member, Long>{

    Optional<Member> findByUsername(String username);

}
