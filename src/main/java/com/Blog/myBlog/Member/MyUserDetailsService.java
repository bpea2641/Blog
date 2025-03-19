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

        return new CustomUser(user.getUsername(), user.getPassword(), authorities, user.getDisplayName(), user.getId());
//        DB에서 username을 가진 유저를 찾아와서
//        return new User(유저아이디, 비번, 권한) 해주세요

//        spring security가 로그인할때 DB를 찾기 위한 클래스.
//        UsernameNotFoundException 은 해당 클래스가 위의 implements에서
//        UserDetailsService의 형식을 따르는지 확인하는것.
//        new User(user.getUsername(), user.getPassword(), authorities);
    }
}