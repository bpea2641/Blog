package com.Blog.myBlog.Kakao;

import com.Blog.myBlog.Kakao.dto.KakaoTokenDto;
import com.Blog.myBlog.Kakao.dto.KakaoUserInfoDto;
import com.Blog.myBlog.Member.CustomUser;
import com.Blog.myBlog.Member.JwtUtil;
import com.Blog.myBlog.Member.Member;
import com.Blog.myBlog.Member.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class KakaoService {

    private final MemberRepository memberRepository;
    private final RestTemplate restTemplate;
    private final JwtUtil jwtUtil;

    @Value("${kakao.client.id}")
    private String kakaoClientId;

    @Value("${kakao.redirect.uri}")
    private String kakaoRedirectUri;

    public String kakaoLogin(String code) {
        // 1. "인가 코드"로 "액세스 토큰" 요청
        KakaoTokenDto tokenDto = getAccessToken(code);

        // 2. 토큰으로 카카오 API 호출 ("사용자 정보" 가져오기)
        KakaoUserInfoDto userInfoDto = getKakaoUserInfo(tokenDto.getAccessToken());

        // 3. 카카오ID로 회원가입 처리
        Member member = findOrCreateMember(userInfoDto);

        // 4. 우리 서비스 JWT 생성하여 반환
        return createAndGetJwt(member);
    }

    private KakaoTokenDto getAccessToken(String code) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("grant_type", "authorization_code");
        params.add("client_id", kakaoClientId);
        params.add("redirect_uri", kakaoRedirectUri);
        params.add("code", code);

        HttpEntity<MultiValueMap<String, String>> kakaoTokenRequest = new HttpEntity<>(params, headers);

        ResponseEntity<KakaoTokenDto> response = restTemplate.postForEntity(
                "https://kauth.kakao.com/oauth/token",
                kakaoTokenRequest,
                KakaoTokenDto.class
        );

        return response.getBody();
    }

    private KakaoUserInfoDto getKakaoUserInfo(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "Bearer " + accessToken);
        headers.add("Content-type", "application/x-www-form-urlencoded;charset=utf-8");

        HttpEntity<MultiValueMap<String, String>> kakaoUserInfoRequest = new HttpEntity<>(headers);

        ResponseEntity<KakaoUserInfoDto> response = restTemplate.exchange(
                "https://kapi.kakao.com/v2/user/me",
                HttpMethod.GET,
                kakaoUserInfoRequest,
                KakaoUserInfoDto.class
        );

        return response.getBody();
    }

    private Member findOrCreateMember(KakaoUserInfoDto userInfoDto) {
        return memberRepository.findByKakaoId(userInfoDto.getId())
                .map(member -> {
                    // 기존 회원이면 카카오 정보로 업데이트
                    member.updateKakao(userInfoDto.getProperties().getNickname(), userInfoDto.getProperties().getProfileImage());
                    return memberRepository.save(member);
                })
                .orElseGet(() -> {
                    // 신규 회원이면 새로 생성
                    Member newMember = Member.builder()
                            .kakaoId(userInfoDto.getId())
                            .username(userInfoDto.getProperties().getNickname()) // 임시로 닉네임을 username으로 사용
                            .displayName(userInfoDto.getProperties().getNickname())
                            .profileImage(userInfoDto.getProperties().getProfileImage())
                            .password(null) // 소셜 로그인은 비밀번호가 없음
                            .build();
                    return memberRepository.save(newMember);
                });
    }

    private String createAndGetJwt(Member member) {
        CustomUser customUser = new CustomUser(
                member.getUsername(),
                member.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("일반유저")),
                member.getDisplayName(),
                member.getId(),
                member.getProfileImage()
        );

        Authentication authentication = new UsernamePasswordAuthenticationToken(
                customUser,
                null, // credentials는 필요 없음
                customUser.getAuthorities()
        );

        return JwtUtil.createToken(authentication);
    }
}
