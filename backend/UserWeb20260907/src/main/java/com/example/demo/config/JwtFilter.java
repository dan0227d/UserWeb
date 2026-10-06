package com.example.demo.config;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class JwtFilter extends OncePerRequestFilter {

    private final JwtUtility jwtUtility;

    public JwtFilter(JwtUtility jwtUtility) {
        this.jwtUtility = jwtUtility;
    }
    
    @Override
    protected boolean shouldNotFilter(
            HttpServletRequest request) {

        String path = request.getServletPath();

        return path.equals("/api/user/login")
                || path.equals("/api/user/register")
                || path.equals("/api/user/refresh");
    }


    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain)
            throws ServletException, IOException {

        // 1. 取得 Authorization Header
        String authorization = request.getHeader("Authorization");

        // 2. 沒有 JWT，就直接往下走
        if (authorization == null || !authorization.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // 3. 移除 "Bearer "
        String jwt = authorization.substring(7);

        try {

            // 4. 解析 + 驗證 JWT
            Claims claims = jwtUtility.parseToken(jwt);

            // 5. 取得 username
            String username = claims.get("username", String.class);
            
            if (request.getRequestURI().equals("/api/user/users")) {
                System.out.println(
                    "=== USERS === "
                    + Thread.currentThread().getName()
                    + " JWT成功 username=" + username
                );
            }

            // 6. 取得 authorities
            List<?> authorityList = claims.get("authorities", List.class);

            List<GrantedAuthority> authorities = new ArrayList<>();

            if (authorityList != null) {

                for (Object item : authorityList) {

                    Map<?, ?> map = (Map<?, ?>) item;

                    String authority = (String) map.get("authority");

                    authorities.add( new SimpleGrantedAuthority(authority));
                }
            }

            // 7. 建立 Spring Security 的 Authentication
            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(
                            username,
                            null,
                            authorities
                    );

            // 8. 告訴 Spring Security：
            // 這個 Request 已經登入
            SecurityContextHolder.getContext().setAuthentication(authentication);
            
            if (request.getRequestURI().equals("/api/user/users")) {
                System.out.println(
                    "=== USERS AUTH === "
                    + Thread.currentThread().getName()
                    + " username="
                    + SecurityContextHolder.getContext()
                        .getAuthentication()
                        .getName()
                );
            }

        } catch (JwtException e) {

            System.out.println(
                "JWT 驗證失敗"
                + " | Thread=" + Thread.currentThread().getName()
                + " | URI=" + request.getRequestURI()
                + " | Type=" + e.getClass().getSimpleName()
                + " | Message=" + e.getMessage()
            );

            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json;charset=UTF-8");
            response.getWriter().write("{\"message\":\"JWT_INVALID\"}");
            return;
        } 

        // 9. 繼續執行後面的 Filter / Controller
        filterChain.doFilter(request, response);
    }
}