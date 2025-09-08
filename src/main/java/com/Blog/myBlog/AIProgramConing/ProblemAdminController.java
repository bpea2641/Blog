package com.Blog.myBlog.AIProgramConing;


import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class ProblemAdminController {

    private final ProblemAdminService problemAdminService;

    @PostMapping("/problems")
    public ResponseEntity<?> saveProblem(@RequestBody ProblemsDTO problemsDTO) {
        try {
            Problems createdProblem = problemAdminService.createProblem(problemsDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdProblem);
        } catch(Exception e) {
            // Log the exception for debugging purposes
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("문제 등록에 실패하셨습니다 : " + e.getMessage());
        }
    }
}
