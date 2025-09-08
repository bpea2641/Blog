package com.Blog.myBlog.AIProgramConing;

import com.Blog.myBlog.AIChatBot.ChatGPTService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.BufferedWriter;
import java.io.OutputStreamWriter;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class JudgeService {

    private final ProblemsRepository problemsRepository;
    private final SubmissionsRepository submissionsRepository;
    private final TestCasesRepository testCasesRepository;
    private final ChatGPTService chatGPTService; // Inject ChatGPTService

    public record JudgeRequestDto(Integer problemId, String code) {}
    public record JudgeResultDto(boolean correct, String result, String output) {}

    @Transactional
    public Submissions judge(JudgeRequestDto requestDto) {
        Problems problem = problemsRepository.findById(requestDto.problemId())
                .orElseThrow(() -> new IllegalArgumentException("문제를 찾을 수 없습니다."));

        Submissions submission = new Submissions();
        submission.setProblem(problem);
        submission.setCode(requestDto.code());
        submission.setResult("처리중");
        submissionsRepository.save(submission);

        List<TestCases> testCases = testCasesRepository.findByProblemId(problem.getId());

        for (TestCases testCase : testCases) {
            try {
                JudgeResultDto resultDto = executeCode(submission.getCode(), testCase.getInputValue());

                if (!resultDto.correct() || !resultDto.output().trim().equals(testCase.getOutputValue().trim())) {
                    submission.setResult("오답");
                    String prompt = String.format(
                        "A user's Java code produced the wrong answer for a problem. Please provide a helpful tip in Korean. Don't give the full answer, just a hint.\n\n" +
                        "Problem Title: %s\n"
                        + "Problem Input: %s\n"
                        + "Expected Output: %s\n"
                        + "Actual Output: %s\n\n"
                        + "User's Code:\n%s",
                        problem.getTitle(), testCase.getInputValue(), testCase.getOutputValue(), resultDto.output(), submission.getCode()
                    );
                    String systemMessage = "You are a helpful assistant providing feedback on programming code.";
                    String feedback = chatGPTService.getGptResponse(prompt, systemMessage);
                    submission.setAiFeedback(feedback);
                    return submissionsRepository.save(submission);
                }
            } catch (Exception e) {
                String errorType = e.getMessage().startsWith("컴파일 에러:") ? "컴파일 에러" : "런타임 에러";
                submission.setResult(errorType);
                String prompt = String.format(
                    "A user's Java code failed with an error. Please provide a helpful tip in Korean based on the error message. Don't give the full answer, just a hint.\n\n" +
                    "Error Type: %s\n"
                    + "Error Message: %s\n\n"
                    + "User's Code:\n%s",
                    errorType, e.getMessage(), submission.getCode()
                );
                String systemMessage = "You are a helpful assistant providing feedback on programming code.";
                String feedback = chatGPTService.getGptResponse(prompt, systemMessage);
                submission.setAiFeedback(feedback);
                return submissionsRepository.save(submission);
            }
        }

        submission.setResult("정답!");
        submission.setAiFeedback("축하해요! 모든 케이스를 통과하셨습니다.");
        return submissionsRepository.save(submission);
    }

    private JudgeResultDto executeCode(String code, String input) throws Exception {
        Path tempDir = null;
        try {
            tempDir = Files.createTempDirectory("judge-");
            Path sourceFile = tempDir.resolve("Main.java");
            Files.write(sourceFile, code.getBytes());

            ProcessBuilder compileBuilder = new ProcessBuilder("javac", sourceFile.toString());
            compileBuilder.directory(tempDir.toFile());
            Process compileProcess = compileBuilder.start();

            if (!compileProcess.waitFor(5, TimeUnit.SECONDS)) {
                compileProcess.destroy();
                throw new Exception("컴파일 타임 아웃");
            }

            if (compileProcess.exitValue() != 0) {
                String errorOutput = new String(compileProcess.getErrorStream().readAllBytes());
                throw new Exception("컴파일 에러: " + errorOutput);
            }

            ProcessBuilder executeBuilder = new ProcessBuilder("java", "Main");
            executeBuilder.directory(tempDir.toFile());
            Process executeProcess = executeBuilder.start();

            try (BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(executeProcess.getOutputStream()))) {
                writer.write(input);
            }

            if (!executeProcess.waitFor(10, TimeUnit.SECONDS)) {
                executeProcess.destroy();
                throw new Exception("계산 타임 아웃");
            }

            String output = new String(executeProcess.getInputStream().readAllBytes());
            String error = new String(executeProcess.getErrorStream().readAllBytes());

            if (executeProcess.exitValue() != 0) {
                throw new Exception("런타임 에러: " + error);
            }

            return new JudgeResultDto(true, "성공", output);

        } finally {
            if (tempDir != null) {
                try {
                    Files.walk(tempDir)
                         .sorted((a, b) -> b.compareTo(a))
                         .forEach(p -> {
                             try { Files.delete(p); } catch (Exception e) { /* ignore */ }
                         });
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        }
    }
}