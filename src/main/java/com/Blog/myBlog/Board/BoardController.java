package com.Blog.myBlog.Board;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
public class BoardController {
    private final BoardService boardService;
    private final BoardRepository boardRepository;

    @PostMapping(value = "/board/save")
    public ResponseEntity<?> saveBoard(
            @RequestParam("boardData") String boardDataString, 
            @RequestParam(value = "files", required = false) MultipartFile[] files) {
        try {
            // boardDataString을 BoardDTO로 변환
            ObjectMapper mapper = new ObjectMapper();
            BoardDTO boardDTO = mapper.readValue(boardDataString, BoardDTO.class);

            // Board 객체 생성
            Board board = new Board();
            board.setTitle(boardDTO.getTitle());
            board.setContent(boardDTO.getContent());  // content에는 텍스트와 이미지 URL이 포함됨
            board.setCreator(boardDTO.getCreator());

            // 게시글과 파일을 저장하는 서비스 호출
            boardService.saveBoard(board, files);

            return ResponseEntity.ok("게시판 등록 및 파일 업로드 성공");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("게시판 등록 또는 파일 업로드 실패: " + e.getMessage());
        }
    }

    @PostMapping(value = "/board/edit/{id}")
    public ResponseEntity<?> editBoard(
            @PathVariable(name = "id") Long id, 
            @RequestParam("boardData") String boardDataString, 
            @RequestParam(value = "files", required = false) MultipartFile[] files) {
        try {
            // boardDataString을 BoardDTO로 변환
            ObjectMapper mapper = new ObjectMapper();
            BoardDTO boardDTO = mapper.readValue(boardDataString, BoardDTO.class);
    
            // Board 객체를 조회하여 수정할 준비
            Board board = boardRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
            
            // BoardDTO에서 데이터를 가져와 Board 객체 수정
            board.setTitle(boardDTO.getTitle());
            board.setContent(boardDTO.getContent());  // content에는 텍스트와 이미지 URL이 포함됨
            board.setCreator(boardDTO.getCreator());
    
            // 게시글 수정 및 파일 업로드 처리
            boardService.saveBoard(board, files);
    
            return ResponseEntity.ok("게시판 수정 및 파일 업로드 성공");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("게시판 수정 또는 파일 업로드 실패: " + e.getMessage());
        }
    }

    @DeleteMapping("/board/delete/{id}")
    public ResponseEntity<?> deleteBoard(@PathVariable(name = "id") Long id) {
        try {
            boardRepository.deleteById(id);
            return ResponseEntity.ok("게시판 삭제 성공");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("게시판 삭제 실패");
        }
    }


    @GetMapping("/board/list/page/{id}")
    public ResponseEntity<Map<String, Object>> listBoardWithPagination(@PathVariable(name = "id") int id) {
        try {
            // 페이지 크기 설정 (예: 10개씩)
            int pageSize = 10;

            Pageable pageable = PageRequest.of(id, pageSize, Sort.by("id").descending()); // 페이지 번호, 페이지 크기 설정

            // 페이징 처리된 Board 객체 가져오기
            Page<Board> boardPage = boardRepository.findAll(pageable);

            // Board 엔티티 리스트를 BoardDTO 리스트로 변환
            List<BoardDTO> boardDTOs = boardPage.getContent().stream()
                    .map(BoardDTO::new)
                    .collect(Collectors.toList());

            // 응답에 totalPages 포함
            Map<String, Object> response = new HashMap<>();
            response.put("boardList", boardDTOs);
            response.put("totalPages", boardPage.getTotalPages()); // totalPages 추가

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            // 예외 발생 시 빈 리스트 반환
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new HashMap<>());
        }
    }


    @GetMapping("/board/detail/{id}")
    public ResponseEntity<?> detailBoard(@PathVariable(name = "id") Long id) {
        try {
            Board board = boardRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
            
            // BoardDTO로 변환
            BoardDTO boardDTO = BoardDTO.from(board);

            return ResponseEntity.ok(boardDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("게시판 상세정보 불러오기 실패: " + e.getMessage());
        }
    }

}
