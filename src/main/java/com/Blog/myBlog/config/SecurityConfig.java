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
    import org.springframework.web.cors.CorsConfiguration;
    import org.springframework.web.cors.CorsConfigurationSource;
    import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
    import java.util.Arrays;

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
        http.cors(cors -> cors.configurationSource(SecuritycorsConfigurationSource()));
        return http.build();
    }
    
        @Bean
    public CorsConfigurationSource SecuritycorsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
    
    }
