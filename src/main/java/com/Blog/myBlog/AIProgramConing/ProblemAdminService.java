package com.Blog.myBlog.AIProgramConing;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProblemAdminService {

    private final ProblemsRepository problemsRepository;
    private final TestCasesRepository testCasesRepository;

    @Transactional
    public Problems createProblem(ProblemsDTO problemsDTO) {
        // 1. Create and save the Problem entity
        Problems newProblem = new Problems();
        newProblem.setTitle(problemsDTO.getTitle());
        newProblem.setContent(problemsDTO.getContent());

        // Set empty lists to avoid null pointer exceptions later
        newProblem.setTestCases(new ArrayList<>());
        newProblem.setSubmissions(new ArrayList<>());

        // 2. If there are test cases in the DTO, create and save them
        if (problemsDTO.getTestCases() != null && !problemsDTO.getTestCases().isEmpty()) {
            List<TestCases> testCasesList = new ArrayList<>();
            for (TestCaseDTO testCaseDTO : problemsDTO.getTestCases()) {
                TestCases testCase = new TestCases();
                testCase.setInputValue(testCaseDTO.getInputValue());
                testCase.setOutputValue(testCaseDTO.getOutputValue());
                testCase.setProblem(newProblem); // Associate with the new problem
                testCasesList.add(testCase);
            }
            newProblem.setTestCases(testCasesList);
        }

        // 3. Save the problem along with its cascaded test cases
        return problemsRepository.save(newProblem);
    }
}