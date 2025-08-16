package com.Blog.myBlog.Board;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class BoardFile {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    public String fileName;
    public String filePath;
    public String fileType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "boardId")
    @JsonIgnore
    public Board board;
}
