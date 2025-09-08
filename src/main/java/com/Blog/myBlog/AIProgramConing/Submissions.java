package com.Blog.myBlog.AIProgramConing;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Submissions {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String code;

    @Column
    private String result;

    @Column(columnDefinition = "TEXT")
    private String aiFeedback;

    @ManyToOne
    @JoinColumn(name = "problem_id")
    @JsonBackReference
    private Problems problem;
}
