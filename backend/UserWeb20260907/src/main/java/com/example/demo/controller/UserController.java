package com.example.demo.controller;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.config.JwtUtility;
import com.example.demo.model.User;
import com.example.demo.service.UserService;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;

@RestController
@RequestMapping("/api/user")
@CrossOrigin
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtility jwtUtility;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private UserDetailsService userDetailsService;


    // =========================
    // 取得全部使用者
    // =========================
    @GetMapping
    public ResponseEntity<List<User>> getUser(
            Authentication authentication) {

        String username = authentication.getName();
        User user = userService.getByName(username);

        if (user == null) {
            return ResponseEntity.status(401).body(null);
        }
        
        return ResponseEntity.ok(
                userService.getAll()
        );
    }


    // =========================
    // 登入
    // =========================
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> payload) {

        String username = payload.get("username");
        String password = payload.get("password");
        System.out.println("-----------"+username+"------"+password+"--------");

        try {
            Authentication authentication =
                authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                        username,
                        password
                    )
                );
	        // 建立 JWT 所需要的 UserDetails
	        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
	        // 產生 JWT
	        String accessToken = jwtUtility.createAccessToken(userDetails);
	        String refreshToken = jwtUtility.createRefreshToken(userDetails);
	        User user = userService.getByName(username);
	        System.out.println("------------------------------");
	        return ResponseEntity.ok(Map.of("accessToken", accessToken, "refreshToken", refreshToken,"user", user));
        
        } catch (AuthenticationException e) {
        		return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED) 
                    .body(Map.of("message", "帳號或密碼錯誤")
            );
        }
    }
    
    // =========================
    // 更新短token
    // =========================
    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(
            @RequestBody Map<String, String> payload) {
    		
        String refreshToken = payload.get("refreshToken");

        try {
            Claims claims = jwtUtility.parseToken(refreshToken);
            String type = claims.get("type", String.class);
            if (!"refresh".equals(type)) {
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "INVALID_REFRESH_TOKEN"));
            }

            String username = claims.get("username", String.class);
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            String newAccessToken = jwtUtility.createAccessToken(userDetails);

            return ResponseEntity.ok(
                Map.of( "accessToken", newAccessToken)
            );

        } catch (JwtException e) {
            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                        "message",
                        "REFRESH_TOKEN_EXPIRED"
                    ));
        }
    }


    // =========================
    // JWT 測試
    // =========================
//    @GetMapping("/test")
//    public ResponseEntity<String> test(Authentication authentication) {
//        String username = authentication.getName();
//
//        return ResponseEntity.ok("JWT 驗證成功，目前使用者：" + username);
//    }


    // =========================
    // 註冊
    // =========================
    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody User user) {

        User result = userService.register(user);
        if (result == null) {
            return ResponseEntity.badRequest().build();
        }
        
        return ResponseEntity.ok(result);
    }


    // =========================
    // 登出
    // =========================
    @PostMapping("/logout")
    public ResponseEntity<?> logout() {
        return ResponseEntity.ok(Map.of("message", "登出成功"));
    }
    
    // =========================
    // 刪除帳號
    // =========================
    @DeleteMapping("/me")
    public ResponseEntity<?> deleteAccount(Authentication authentication) {

        String username = authentication.getName();

        userService.deleteAccount(username);

        return ResponseEntity.ok(
            Map.of("message", "帳號刪除成功")
        );
    }


    // =========================
    // 目前登入使用者
    // =========================
    @GetMapping("/me")
    public ResponseEntity<?> me(Authentication authentication) {
        String username = authentication.getName();
        User user = userService.getByName(username);

        if (user == null) {
        		System.out.println("---------me 401---------");
            return ResponseEntity.status(401).build();    
        }

        System.out.println("---------me 200---------");
        return ResponseEntity.ok(user);
    }


    // =========================
    // PDF
    // =========================
    @GetMapping("/users")
    public ResponseEntity<byte[]> exportUsers(
            Authentication authentication)
            throws Exception {
        	String username = authentication.getName();
        	User user = userService.getByName(username);

        	if (user == null) {
        		return ResponseEntity.status(401).build();
        	}
        byte[] pdf = userService.createUserReport();
        return ResponseEntity.ok()
                .header(
                    HttpHeaders.CONTENT_DISPOSITION,
                    "attachment; filename=users.pdf"
                )
                .contentType(
                    MediaType.APPLICATION_PDF
                )
                .body(pdf);
    }

    // =========================
    // 搜尋
    // =========================
    @GetMapping("/search")
    public ResponseEntity<List<User>> searchUser(
            @RequestParam String username,
            @RequestParam Integer page,
            @RequestParam Integer size,
            Authentication authentication) {
        String loginUsername = authentication.getName();
        User loginUser = userService.getByName(
                        		loginUsername
                			);

        if (loginUser == null) {
            return ResponseEntity.status(401).build();
        }

        List<User> users =
                userService.searchByUsername(
                        username,
                        page,
                        size
                );
        if (users == null || users.isEmpty()) {
            return ResponseEntity.status(204).build();
        }
        return ResponseEntity.ok(users);
    }


    // =========================
    // 搜尋筆數
    // =========================
    @GetMapping("/count")
    public ResponseEntity<?> count(
            @RequestParam String username,
            Authentication authentication) {

        String loginUsername = authentication.getName();
        User loginUser = userService.getByName(loginUsername);

        if (loginUser == null) {
            return ResponseEntity.status(401).build();
        }

        return ResponseEntity.ok(
        		Map.of(
				"total", userService.countByUsername(username)
			)
        	);
    }
    
    // =========================
    // 上傳註冊資料
    // =========================
    @PostMapping("/upload")
    public ResponseEntity<?> uploadTxt(
            @RequestParam("file") MultipartFile file) {

    		//System.out.println("--------starting upload-----------");
    		
        try {
            String content = new String(
                file.getBytes(),
                StandardCharsets.UTF_8
            );
            
            String[] lines = content.split("\\R");
            List<User> users = new ArrayList<>();

            for (String line : lines) {
                if (line.isBlank()) {
                    continue;
                }
                String[] data = line.split(",");

                if (data.length != 3) {
                    return ResponseEntity
                    		.badRequest()
                         .body(Map.of("message", "資料格式錯誤：" + line));
                }
                
                User user = new User(
                        data[0].trim(),
                        data[1].trim(),
                        data[2].trim()
                );
                
                users.add(user);
            }
            
            userService.registerAll(users);
            
            return ResponseEntity.ok(Map.of("message", "成功新增 " + users.size() + " 筆資料"));
        }catch (IOException e) {
        		System.out.println("------檔案讀取失敗--------");
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", "檔案讀取失敗：" + e.getMessage()));

        } catch (RuntimeException e) {
        	System.out.println("------資料新增失敗--------");
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", "資料新增失敗：" + e.getMessage()));
        }
    }
}