package com.Blog.myBlog.Kakao;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequiredArgsConstructor
public class KakaoController {

    private final KakaoService kakaoService;

    @Value("${frontend.url}")
    private String frontendUrl;

    @GetMapping("/login/oauth2/code/kakao")
    public ResponseEntity<?> kakaoLogin(@RequestParam("code") String code, HttpServletResponse response) throws IOException {
        String jwtToken = kakaoService.kakaoLogin(code);
        String redirectUrl = frontendUrl + "/auth/kakao?token=" + jwtToken;

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.LOCATION, redirectUrl);

        return new ResponseEntity<>(headers, HttpStatus.FOUND); // 302 Found
    }
}
