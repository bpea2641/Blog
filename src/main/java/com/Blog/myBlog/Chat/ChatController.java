package com.Blog.myBlog.Chat;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatService chatService;

    @MessageMapping("/chat/private")
    public void privateChat(@Payload ChatMessage message) {
        chatService.saveChatMessage(message);
    
        String roomKey = sortedKey(message.getSender(), message.getReceiver());
        
        System.out.println("STOMP 메시지 도착 → sender: " + message.getSender() + ", receiver: " + message.getReceiver());
        System.out.println("roomKey: " + sortedKey(message.getSender(), message.getReceiver()));

        // 해당 방에 있는 두 명에게만 전송
        messagingTemplate.convertAndSend("/topic/private/" + roomKey, message);
    }

    @GetMapping("/chat/messages")
    public List<ChatMessageDto> getChatMessages(
            @RequestParam(name = "sender") String sender,
            @RequestParam(name = "receiver") String receiver
    ) {
        List<Chat> chats = chatService.getChatMessages(sender, receiver);

        return chats.stream().map(chat -> new ChatMessageDto(
                chat.getSender().getDisplayName(),
                chat.getChatRoom().getMembers().stream()
                        .filter(m -> !m.getDisplayName().equals(chat.getSender().getDisplayName()))
                        .findFirst().map(m -> m.getDisplayName()).orElse(""),
                chat.getMessage(),
                chat.getFileUrl() != null ? "FILE" : "TALK",   // type 필드 설정
                chat.getCreatedAt().toString(),
                chat.getFileUrl(),
                chat.getFileType()
        )).toList();
    }

    @PostMapping("/read")
    public ResponseEntity<?> markAsRead(@RequestParam String sender, @RequestParam String receiver) {
        chatService.markAsRead(sender, receiver);
        return ResponseEntity.ok().build();
    }

    private String sortedKey(String user1, String user2) {
        return user1.compareTo(user2) < 0 ? user1 + "-" + user2 : user2 + "-" + user1;
    }
}
