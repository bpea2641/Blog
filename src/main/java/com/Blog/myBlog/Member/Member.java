package com.Blog.myBlog.Member;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Member {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long Id;

    @Column(nullable = false)
    public String username;

    @Column(nullable = true)
    public String password;

    @Column
    public String displayName;

    @Column(nullable = true)
    public String profileImage;

    @Column(unique = true, nullable = true)
    public Long kakaoId;

    @Builder
    public Member(String username, String password, String displayName, String profileImage, Long kakaoId) {
        this.username = username;
        this.password = password;
        this.displayName = displayName;
        this.profileImage = profileImage;
        this.kakaoId = kakaoId;
    }

    // 카카오 정보로 멤버 정보 업데이트
    public Member updateKakao(String displayName, String profileImage) {
        this.displayName = displayName;
        this.profileImage = profileImage;
        return this;
    }
}
