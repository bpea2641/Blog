package com.Blog.myBlog.Member;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;

    public void saveMember(Member member) {
        if(member.username.length() >= 2 && member.password.length() >= 2) {
            var newPassword = passwordEncoder.encode(member.password);
            member.setPassword(newPassword);
            memberRepository.save(member);
        }
    }
}
