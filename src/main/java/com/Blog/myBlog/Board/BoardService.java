package com.Blog.myBlog.Board;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BoardService {
    private final BoardRepository boardRepository;
    private final BoardFileRepsotiry boardFileRepository;

    private final String UPLOAD_DIR = "C:\\uploads";  // 파일이 저장될 경로

    public void saveBoard(Board board, MultipartFile[] files) {
        // 사용자 인증 정보 가져오기
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && ((org.springframework.security.core.Authentication) auth).isAuthenticated()) {
            String username = auth.getName();
            board.setCreator(username);  // 게시글 작성자 정보 설정
        }
    
        // 게시판 저장
        boardRepository.save(board);
    
        // 파일 업로드 처리
        if (files != null && files.length > 0) {
            uploadFiles(board, files);  // 파일 업로드 후, 이미지 URL을 board의 content에 추가하지 않음
        }
    }
    
    private void uploadFiles(Board board, MultipartFile[] files) {
        List<BoardFile> boardFiles = new ArrayList<>();
        String content = board.getContent();  // 기존 content 가져오기
    
        for (MultipartFile file : files) {
            if (!file.isEmpty()) {
                try {
                    String mimeType = file.getContentType();
                    if (mimeType != null && mimeType.startsWith("image/")) {
                        // 파일명 생성
                        String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
                        Path path = Paths.get(UPLOAD_DIR, fileName);
                        Files.write(path, file.getBytes());
    
                        // BoardFile 객체 생성
                        BoardFile boardFile = new BoardFile();
                        boardFile.setFileName(fileName);
                        boardFile.setFilePath(path.toString());  // 파일 경로 저장
                        boardFile.setFileType(mimeType);
                        boardFile.setBoard(board);  // Board와 연관 지음
    
                        // BoardFile 객체를 리스트에 추가
                        boardFiles.add(boardFile);
    
                        // BoardFile 저장
                        boardFileRepository.save(boardFile);
    
                        // 업로드된 파일 경로를 content에 추가
                        String uploadedFileUrl = "/uploads/" + fileName;
                        content += "<img src='" + uploadedFileUrl + "' alt='uploaded-image' />";
                    } else {
                        throw new RuntimeException("지원되지 않는 파일 형식입니다.");
                    }
                } catch (Exception e) {
                    throw new RuntimeException("파일 업로드 실패", e);
                }
            }
        }
    
        // BoardFile 저장 후, Board에 해당 파일들 추가
        if (!boardFiles.isEmpty()) {
            board.setFiles(boardFiles);  // Board와 BoardFile 연결
        }
    
        // content에는 텍스트만 추가
        board.setContent(content);  // content에 업로드된 이미지 URL을 포함시킴
    
        // Board 저장
        boardRepository.save(board);
    }    
}