package com.Blog.myBlog.Member;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.stream.Collectors;

@Component
public class JwtUtil {

    static final SecretKey key =
            Keys.hmacShaKeyFor(Decoders.BASE64.decode(
                    "jwtpassword123jwtpassword123jwtpassword123jwtpassword123jwtpassword"
            )); // key 비밀번호 형식

    // JWT 만들어주는 함수
    // static는 계산기용, 변환기용 함수에만 붙이는게 좋다.
    public static String createToken(Authentication auth) {
        var user = (CustomUser) auth.getPrincipal();
        var authorities = auth.getAuthorities().stream().map(a-> a.getAuthority())
                .collect(Collectors.joining(","));
//      auth의 권한List를 가져와서 map으로 문자열로 바꾼다음 collect로 문자열의 , 제거.

        String jwt = Jwts.builder()
                .claim("username", user.getUsername()) // 해당 claim에 함수에 데이터 넣는 것
                .claim("displayName", user.getDisplayName()) // 해당 데이터는 누구나 볼 수 있기 때문에 민감한 정보는 제외
                .claim("authorities", authorities) // 권한은 List로 되어있기 때문에 위에서처럼 문자열로 처리한다음에 넣는다.
                .issuedAt(new Date(System.currentTimeMillis())) // jwt를 언제 발행했는지.
                .expiration(new Date(System.currentTimeMillis() + 3600000)) //유효기간 10초, ms단위.
                .signWith(key)
                .compact();
        return jwt;
    }

    // JWT 까주는 함수
    public static Claims extractToken(String token) {
        Claims claims = Jwts.parser().verifyWith(key).build()
                .parseSignedClaims(token).getPayload();
        return claims;
    }
}
