package com.Blog.myBlog.AIChatBot;

import org.springframework.http.HttpEntity;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import org.springframework.http.HttpHeaders; // ✅ 여기 spring 의 HttpHeaders 로 변경
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class AIChatController {

    private final String OPENAI_APU_KEY = "";
    private final String OPENAI_URL = "https://api.openai.com/v1/chat/completions";

    @PostMapping("/AIChat1")
    public Map<String, String> chat(@RequestBody Map<String, String> requestBody) {
        String userMessage = requestBody.get("message");

        RestTemplate restTemplate = new RestTemplate();

        Map<String, Object> body = new HashMap<>();
        body.put("model", "gpt-4o-mini");
        body.put("messages", List.of(
                Map.of("role", "system", "content", "You are a helpful assistant."),
                Map.of("role", "user", "content", userMessage)
        ));

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(OPENAI_APU_KEY);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        Map response = restTemplate.postForObject(OPENAI_URL, request, Map.class);

        String answer = ((Map)((Map)((List)response.get("choices")).get(0)).get("message")).get("content").toString();

        return Map.of("response", answer);
    }
}
