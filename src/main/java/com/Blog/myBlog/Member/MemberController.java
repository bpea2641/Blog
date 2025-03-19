package com.Blog.myBlog.Member;

import java.util.Map;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

import org.springframework.boot.autoconfigure.security.SecurityProperties.User;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;


@Controller
@RequiredArgsConstructor
public class MemberController {
    private final MemberService memberService;
    private final AuthenticationManagerBuilder authenticationManagerBuilder;

    @PostMapping("/signup")
    public ResponseEntity<String> postMethodName(@RequestBody Member member) {
        try {
            memberService.saveMember(member);
            return ResponseEntity.ok("회원가입 성공");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("회원가입 실패");
        }
    }

    @PostMapping("/login/jwt")
    @ResponseBody
    public String loginJWT(@RequestBody Map<String, String> data,
                           HttpServletResponse response) {

        var authToken = new UsernamePasswordAuthenticationToken(
                data.get("username"), data.get("password")
        );
//      authToken에 data로 넘어온 username, password를 넣어줌.
        var auth = authenticationManagerBuilder.getObject().authenticate(authToken);
//      아이디와 비밀번호를 대조해서 로그인 시켜주는 함수, 다르면 에러를 내줌
//      loadUserByUsername이 제대로 세팅되어 있어야 실행가능.

        SecurityContextHolder.getContext().setAuthentication(auth);
//      SecurityContextHolder.getContext().getAuthentication() <- auth와 동일함
//      Authentication auth. jwt에서 로그인할때 auth에 자동으로 로그인 데이터가 들어가지 않기 때문에
//      해당 함수를 사용해서 넣어줘야한다.
//      마지막으로 JWT를 만들어서 보내줘야하는데 길어서 다른 클래스에 작성 후 대체. JwtUtil

        var jwt = JwtUtil.createToken(SecurityContextHolder.getContext().getAuthentication());
//      JwtUiil에서 createToken 함수를 사용해 가장 최신의 정보를 jwt 변수에 넣음.

        System.out.println(jwt);

        var cookie = new Cookie("jwt", jwt);
        cookie.setMaxAge(1000); // 유효기간
        cookie.setHttpOnly(true); // 쿠키를 자바스크립트로 조작하기 어려워짐
        cookie.setPath("/"); // 쿠기가 전송될 url
        response.addCookie(cookie);

        return jwt;
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logoutJwt(HttpServletResponse response) {
        Cookie cookie = new Cookie("jwt", null);
        cookie.setMaxAge(0);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        return ResponseEntity.ok("로그아웃 완료");
    }
    
    @GetMapping("/user")
    public ResponseEntity<?> getUserInfo(Authentication auth) {
        if(auth != null) {
            CustomUser customUser = (CustomUser) auth.getPrincipal();
            return ResponseEntity.ok(customUser);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }
    }
}
