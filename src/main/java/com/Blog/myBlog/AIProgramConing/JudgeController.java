package com.Blog.myBlog.AIProgramConing;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
public class JudgeController {

    private final JudgeService judgeService;
    private final ProblemsRepository problemsRepository; // Inject repository

    // Endpoint for submitting code
    @PostMapping("/judge")
    public ResponseEntity<Submissions> judgeCode(@RequestBody JudgeService.JudgeRequestDto requestDto) {
        Submissions submissionResult = judgeService.judge(requestDto);
        return ResponseEntity.ok(submissionResult);
    }

    // Endpoint for fetching a problem by ID
    @GetMapping("/problems/{id}")
    public ResponseEntity<Problems> getProblem(@PathVariable Integer id) {
        return problemsRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
