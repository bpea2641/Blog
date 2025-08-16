package com.Blog.myBlog.Visit;

import java.time.LocalDate;

import org.springframework.stereotype.Service;

import lombok.AllArgsConstructor;

@Service
@AllArgsConstructor
public class VisitService {
    private final VisitRepository visitRepository;

    public void IncreaseDateCount() {
        LocalDate today = LocalDate.now();
        Visit visit = visitRepository.findByDate(today).orElseGet(() -> {
            Visit newVisit = new Visit();
            newVisit.setDate(today);
            newVisit.setCount(0L);
            return newVisit;
        });
        visit.setCount(visit.getCount() + 1);
        visitRepository.save(visit);
    }

    public long getTodayCount() {
        LocalDate today = LocalDate.now();
        return visitRepository.findByDate(today).map(Visit::getCount).orElse(0L);
    }

    public long getTotalCount() {
        return visitRepository.getDateCount();
    }
}
