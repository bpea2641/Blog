package com.Blog.myBlog.AIProgramConing;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TestCasesRepository extends JpaRepository<TestCases, Integer> {
    List<TestCases> findByProblemId(Integer problemId);
}
