package com.example.demo.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {
		
	@Bean
	public SecurityFilterChain securityFilterChain(
	        HttpSecurity httpSecurity,
	        JwtFilter jwtFilter) throws Exception {

	    return httpSecurity//CSRF：防止瀏覽器利用自動攜帶的登入憑證，偽造使用者發送未授權的請求。
	            .csrf(csrf -> csrf.disable())
	            .sessionManagement(session ->
	                    session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
	            )
	            .authorizeHttpRequests(requests -> requests
	                    .requestMatchers(
	                            "/api/user/login",
	                            "/api/user/logout",
	                            "/api/user/register",
	                            //"/api/user/upload",
	                            "/api/user/refresh"
	                    )
	                    .permitAll().anyRequest().authenticated()
	            )
	            .addFilterBefore(
	                    jwtFilter,
	                    UsernamePasswordAuthenticationFilter.class
	            )
	            .build();
	}
	
	@Bean
	public AuthenticationManager authenticationManager(
	        AuthenticationConfiguration configuration) throws Exception {
	    return configuration.getAuthenticationManager();
	}

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public JwtUtility jwtUtility(
            //@Value("${jwt.secret-key}") String secretKeyStr,
    			@Value("${jwt.private-key}") String privateKeyStr,
            @Value("${jwt.public-key}") String publicKeyStr,
            @Value("${jwt.access-valid-seconds}") int accessValidSeconds,
            @Value("${jwt.refresh-valid-seconds}") int refreshValidSeconds) 
    			throws Exception{
        return new JwtUtility(
        		//secretKeyStr, 
        		privateKeyStr,
            publicKeyStr,
        		accessValidSeconds, 
        		refreshValidSeconds);
    }

}