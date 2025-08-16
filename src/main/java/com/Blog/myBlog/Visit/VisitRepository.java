package com.Blog.myBlog.Visit;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface VisitRepository extends JpaRepository<Visit, Long> {
    Optional<Visit> findByDate(LocalDate date);

    @Query("SELECT SUM(v.count) FROM Visit v")
    Long getDateCount();
}
