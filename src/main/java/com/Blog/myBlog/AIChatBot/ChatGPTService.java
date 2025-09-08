package com.Blog.myBlog.AIChatBot;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ChatGPTService {

    @Value("${openai.api.key}")
    private String OPENAI_API_KEY;
    private static final String OPENAI_URL = "https://api.openai.com/v1/chat/completions";

    private final RestTemplate restTemplate = new RestTemplate();

    public String getGptResponse(String userPrompt, String systemMessage) {
        Map<String, Object> body = new HashMap<>();
        body.put("model", "gpt-4o-mini");
        body.put("messages", List.of(
                Map.of("role", "system", "content", systemMessage),
                Map.of("role", "user", "content", userPrompt)
        ));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(OPENAI_API_KEY);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            Map response = restTemplate.postForObject(OPENAI_URL, request, Map.class);
            if (response != null && response.containsKey("choices")) {
                List<Map<String, Object>> choices = (List<Map<String, Object>>) response.get("choices");
                if (!choices.isEmpty()) {
                    Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
                    if (message != null && message.containsKey("content")) {
                        return message.get("content").toString();
                    }
                }
            }
            return "AI로부터 유효한 응답을 받지 못했습니다.";
        } catch (Exception e) {
            // Log the exception for debugging
            e.printStackTrace();
            return "AI 서비스와 통신 중 오류가 발생했습니다: " + e.getMessage();
        }
    }
}
