package com.Blog.myBlog.Board;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@RequestMapping("/uploads")
public class FileController {

    private final String UPLOAD_DIR = "C:/uploads";

    @GetMapping("/{filename}")
    public ResponseEntity<Resource> getFile(@PathVariable String filename) throws MalformedURLException {
        Path filePath = Paths.get(UPLOAD_DIR).resolve(filename);
        Resource resource = new UrlResource(filePath.toUri());

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_TYPE, "image/png") // MIME 타입 설정 (필요 시 동적으로 변경 가능)
                .body(resource);
    }
}
