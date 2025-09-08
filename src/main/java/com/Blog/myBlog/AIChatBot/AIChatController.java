package com.Blog.myBlog.AIChatBot;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
public class AIChatController {

    private final ChatGPTService chatGPTService;

    @PostMapping("/AIChat1")
    public Map<String, String> chat(@RequestBody Map<String, String> requestBody) {
        String userMessage = requestBody.get("message");
        String systemMessage = "You are a helpful assistant."; // General purpose role
        String answer = chatGPTService.getGptResponse(userMessage, systemMessage);
        return Map.of("response", answer);
    }
}