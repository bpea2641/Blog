package com.Blog.myBlog.Board;

import java.util.List;
import java.util.stream.Collectors;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class BoardDTO {
    private Long id;
    private String title;
    private String content; // 텍스트만 포함된 content
    private String creator;
    private String tag;
    private List<BoardFileDTO> files; // 이미지 URL 정보는 BoardFileDTO로 관리

    private List<BoardDTO> boardList;
    private int totalPages;

    // 기본 생성자 추가
    public BoardDTO() {
    }

    public BoardDTO(Board board) {
        this.id = board.getId();
        this.title = board.getTitle();
        this.content = board.getContent();  // 텍스트만 저장
        this.creator = board.getCreator();
        this.tag = board.getTag();
        this.files = board.getFiles().stream()
                .map(file -> new BoardFileDTO(file.getFileName(), file.getFilePath(), file.getFileType()))
                .collect(Collectors.toList());  // 파일 관련 정보 포함
    }

    public static BoardDTO from(Board board) {
        BoardDTO dto = new BoardDTO();
        dto.setId(board.getId());
        dto.setTitle(board.getTitle());
        dto.setContent(board.getContent());  // 텍스트만 저장
        dto.setCreator(board.getCreator());
        dto.setTag(board.getTag());
        dto.setFiles(board.getFiles().stream()
                .map(file -> new BoardFileDTO(file.getFileName(), file.getFilePath(), file.getFileType()))
                .collect(Collectors.toList()));  // 파일 관련 정보 포함
        return dto;
    }
}