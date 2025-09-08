package com.Blog.myBlog.AIProgramConing;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class ProblemsDTO {
    private String title;
    private String content;
    private List<TestCaseDTO> testCases;
}