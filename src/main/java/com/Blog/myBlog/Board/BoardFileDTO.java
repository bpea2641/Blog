package com.Blog.myBlog.Board;

import lombok.Data;

@Data
public class BoardFileDTO {
    private String fileName;
    private String filePath;
    private String fileType;

    // 매개변수를 받는 생성자
    public BoardFileDTO(String fileName, String filePath, String fileType) {
        this.fileName = fileName;
        this.fileType = fileType;

        // 이미 "/upload/"를 포함하고 있으면 중복 추가 방지
        if (filePath.startsWith("/uploads/")) {
            this.filePath = filePath;
        } else {
            this.filePath = "/uploads/" + fileName;
        }
    }

    // 기본 생성자
    public BoardFileDTO() {
    }
}
