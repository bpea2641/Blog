package com.Blog.myBlog.Visit;

import java.time.LocalDate;
import java.time.format.TextStyle;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;

@RestController
@AllArgsConstructor
public class VisitController {
    private final VisitService visitService;
    private final VisitRepository visitRepository;

    @PostMapping("/increase")
    public void increaseDateCount() {
        visitService.IncreaseDateCount();
    }

    @GetMapping("/today")
    public long today() {
        return visitService.getTodayCount();
    }

    @GetMapping("/total") 
    public long total() {
        return visitService.getTotalCount();
    }

    @GetMapping("/weekly")
    public Map<String, Long> getWeeklyVisit() {
        LocalDate today = LocalDate.now();
        Map<String, Long> weeklyData = new LinkedHashMap<>();
        for (int i = 6; i >= 0; i--) {
            LocalDate date = today.minusDays(i);
            long count = visitRepository.findByDate(date).map(Visit::getCount).orElse(0L);
            String Week = date.getDayOfWeek().getDisplayName(TextStyle.SHORT, Locale.KOREAN);
            weeklyData.put(Week, count);
        }
        return weeklyData;
    }
}
