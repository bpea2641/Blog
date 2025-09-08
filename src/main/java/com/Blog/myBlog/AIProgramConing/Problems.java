package com.Blog.myBlog.AIProgramConing;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Entity
@Getter
@Setter
public class Problems {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @OneToMany(mappedBy = "problem", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<TestCases> testCases;

    @OneToMany(mappedBy = "problem", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<Submissions> submissions;
}
