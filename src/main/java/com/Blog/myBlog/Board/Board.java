package com.Blog.myBlog.Board;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Board {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long Id;

    @Column
    public String title;

    @Column(columnDefinition = "LONGTEXT")
    public String content;

    @Column
    public String creator;

    @CreationTimestamp // 시간 자동 기입
    LocalDateTime created;

    @Column
    public String tag;

    @OneToMany(mappedBy = "board", cascade = CascadeType.ALL)
    private List<BoardFile> files = new ArrayList<>();
    
        // BoardFileDTO 반환을 위한 메소드
    public List<BoardFileDTO> getFilesAsDTO() {
        List<BoardFileDTO> dtos = new ArrayList<>();
        for (BoardFile file : files) {
            BoardFileDTO dto = new BoardFileDTO();
            dto.setFileName(file.getFileName());
            dto.setFilePath(file.getFilePath());
            dtos.add(dto);
        }
        return dtos;
    }
}
