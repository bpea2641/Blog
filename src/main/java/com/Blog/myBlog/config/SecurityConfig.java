    package com.Blog.myBlog.config;

    import org.springframework.context.annotation.Bean;
    import org.springframework.context.annotation.Configuration;
    import org.springframework.security.config.annotation.web.builders.HttpSecurity;
    import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
    import org.springframework.security.config.http.SessionCreationPolicy;
    import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
    import org.springframework.security.crypto.password.PasswordEncoder;
    import org.springframework.security.web.SecurityFilterChain;
    import org.springframework.security.web.access.ExceptionTranslationFilter;

import com.Blog.myBlog.Member.JwtFilter;

    @Configuration
    @EnableWebSecurity
    public class SecurityConfig {

        @Bean
        PasswordEncoder 함수() {
            return new BCryptPasswordEncoder();
        }
    //    @Bean
    //    public CsrfTokenRepository csrfTokenRepository() {
    //        HttpSessionCsrfTokenRepository repository = new HttpSessionCsrfTokenRepository();
    //        repository.setHeaderName("X-XSRF-TOKEN");
    //        return repository;
    //    } // csrf 키기

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable());
        http.sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        http.addFilterBefore(new JwtFilter(), ExceptionTranslationFilter.class);
        http.authorizeHttpRequests(authorize -> authorize.requestMatchers("/**").permitAll());
        http.logout(logout -> logout.logoutUrl("/logout"));
        http.headers(headers -> headers.frameOptions(frameOptions -> frameOptions.disable()));
        http.cors();  // cors 설정 활성화 (disable() 대신)
        return http.build();
    }
    
    }
