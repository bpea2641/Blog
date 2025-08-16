package com.Blog.myBlog.Chat;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/chat")
public class ChatUploadController {

    @Value("${file.upload-dir}")
    private String uploadDir;

    @PostMapping("/upload")
    public ResponseEntity<List<Map<String, String>>> uploadFiles(@RequestParam(name = "files") MultipartFile[] files) {
        List<Map<String, String>> responseList = new ArrayList<>();

        for (MultipartFile file : files) {
            try {
                String originalFilename = file.getOriginalFilename();
                String uuid = UUID.randomUUID().toString();
                String savedFilename = uuid + "_" + originalFilename;

                Path savePath = Paths.get(uploadDir, savedFilename);
                Files.createDirectories(savePath.getParent());
                file.transferTo(savePath.toFile());

                String fileUrl = "/uploads/" + savedFilename; // WebConfig에서 매핑한 경로 기준
                String fileType = file.getContentType();

                Map<String, String> fileInfo = new HashMap<>();
                fileInfo.put("fileUrl", fileUrl);
                fileInfo.put("fileType", fileType);
                responseList.add(fileInfo);

            } catch (IOException e) {
                e.printStackTrace();
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        }

        return ResponseEntity.ok(responseList);
    }
}

