package com.Blog.myBlog.AIProgramConing;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class TestCases {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(columnDefinition = "TEXT")
    private String inputValue;

    @Column(columnDefinition = "TEXT")
    private String outputValue;

    @ManyToOne
    @JoinColumn(name = "problem_id")
    @JsonBackReference
    private Problems problem;
}
