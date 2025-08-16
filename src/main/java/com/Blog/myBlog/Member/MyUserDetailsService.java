package com.Blog.myBlog.Member;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MyUserDetailsService implements UserDetailsService {

    private final MemberRepository memberRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        var result = memberRepository.findByUsername(username);
        if(result.isEmpty()) {
            throw new UsernameNotFoundException("그런아이디 없음");
        }
        var user = result.get();
        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("일반유저"));

        System.out.println("[" + username + "] 유저 권한 목록:");
        for (GrantedAuthority authority : authorities) {
            System.out.println("권한: " + authority.getAuthority());
        }

        return new CustomUser(user.getUsername(), user.getPassword(), authorities, user.getDisplayName(), user.getId(), user.getProfileImage());
    }
}