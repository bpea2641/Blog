package com.Blog.myBlog.Chat;

import com.Blog.myBlog.Member.Member;
import com.Blog.myBlog.Member.MemberRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final MemberRepository memberRepository;

    public Chat saveChatMessage(ChatMessage message) {
        Member sender = memberRepository.findByDisplayName(message.getSender())
                .orElseThrow(() -> new IllegalArgumentException("보낸 사용자 없음"));

        Member receiver = memberRepository.findByDisplayName(message.getReceiver())
                .orElseThrow(() -> new IllegalArgumentException("받는 사용자 없음"));

        ChatRoom room = findOrCreateRoom(sender, receiver);

        Chat chat = new Chat();
        chat.setSender(sender);
        chat.setMessage(message.getContent());
        chat.setCreatedAt(LocalDateTime.now());
        chat.setChatRoom(room);

        chat.setFileUrl(message.getFileUrl());
        chat.setFileType(message.getFileType());

        return chatRepository.save(chat);
    }

    public ChatRoom findOrCreateRoom(Member m1, Member m2) {
        Optional<ChatRoom> existingRoom = chatRoomRepository.findRoomByTwoMembers(m1.getId(), m2.getId());
        if (existingRoom.isPresent()) {
            return existingRoom.get();
        }
    
        ChatRoom newRoom = new ChatRoom();
        newRoom.setName("Private Chat");
        newRoom.getMembers().add(m1);
        newRoom.getMembers().add(m2);
        return chatRoomRepository.save(newRoom);
    }
    
    

    public ChatRoom findRoom(String senderUsername, String receiverUsername) {
        Member sender = memberRepository.findByUsername(senderUsername)
                .orElseThrow(() -> new IllegalArgumentException("보낸 사용자 없음"));

        Member receiver = memberRepository.findByUsername(receiverUsername)
                .orElseThrow(() -> new IllegalArgumentException("받는 사용자 없음"));

        return findOrCreateRoom(sender, receiver);
    }
    
    public List<Chat> getChatMessages(String senderDisplayName, String receiverDisplayName) {
        Member sender = memberRepository.findByDisplayName(senderDisplayName)
                .orElseThrow(() -> new IllegalArgumentException("보낸 사용자 없음"));
        Member receiver = memberRepository.findByDisplayName(receiverDisplayName)
                .orElseThrow(() -> new IllegalArgumentException("받는 사용자 없음"));
    
        ChatRoom room = findOrCreateRoom(sender, receiver);
    
        return chatRepository.findByChatRoomOrderByCreatedAtAsc(room);
    }

    @Transactional
    public void markAsRead(String senderDisplayName, String receiverDisplayName) {
        Member sender = memberRepository.findByDisplayName(senderDisplayName)
                .orElseThrow(() -> new IllegalArgumentException("보낸 사용자 없음"));
        Member receiver = memberRepository.findByDisplayName(receiverDisplayName)
                .orElseThrow(() -> new IllegalArgumentException("받는 사용자 없음"));

        ChatRoom room = findOrCreateRoom(sender, receiver);

        chatRepository.markMessagesAsRead(room, receiver);
    }
}