package com.Blog.myBlog.Member;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;

@Component // 이거 넣으면 jpa가 알아서 적절한 위치에 실행해줌. 커스텀 가능.
public class JwtFilter extends OncePerRequestFilter {
    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        // 요청들어올때마다 실행할코드~~
        // "jwt" 이름의 쿠키가 있으면 꺼내서
        // 유효기간, 위조여부 등 확인해보고
        // 문제없으면 auth 변수에 유저정보 넣어줌.

        // 쿠키 꺼내기
        // Cookie[] 는 array 인데. arrayList와의 차이점은 array는 자료가 한정적임.
        Cookie[] cookies = request.getCookies();
        if(cookies == null) {
            filterChain.doFilter(request, response); // 다음 필터 실행해주세요.
            return;
        }

        var jwtCookie = "";
        for(int i = 0; i < cookies.length; i++) {
            if(cookies[i].getName().equals("jwt")) {
                jwtCookie = cookies[i].getValue();
            }
        }
        // System.out.println(jwtCookie);

        Claims claim;
        try{
            claim = JwtUtil.extractToken(jwtCookie);
        } catch (Exception e) {
            filterChain.doFilter(request, response); // 다음 필터 실행해주세요.
            return;
        }
//        claim.get("username").toString(); // jwt가 들어있음.

        String profileImage = claim.get("profileImage") != null
        ? claim.get("profileImage").toString()
        : "/UserProfileImages/default.png";

        var arr = claim.get("authorities").toString().split(",");
        var authorities = Arrays.stream(arr)
                .map(a -> new SimpleGrantedAuthority(a)).toList();

                Long id = ((Number) claim.get("id")).longValue(); // ✅ 안전한 방식

                CustomUser customUser = new CustomUser(
                    claim.get("username").toString(),
                    "none",
                    authorities,
                    claim.get("displayName").toString(),
                    id,
                    profileImage
                );
                
        customUser.setDisplayName(claim.get("displayName").toString());

        var authToken = new UsernamePasswordAuthenticationToken(
                customUser, "",
                authorities
//                claim.get("username").toString()
        );
        authToken.setDetails(new WebAuthenticationDetailsSource()
                .buildDetails(request)
        ); // auth와 비슷하게 만드려고 하면이렇게.
        SecurityContextHolder.getContext().setAuthentication(authToken);

        filterChain.doFilter(request, response);
    }
}
