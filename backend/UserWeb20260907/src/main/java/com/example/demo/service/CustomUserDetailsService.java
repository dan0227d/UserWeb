package com.example.demo.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.demo.model.User;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserService userService;

    public CustomUserDetailsService(UserService userService) {
        this.userService = userService;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    	
    		System.out.println(
	        "### AUTH ### Thread="
	        + Thread.currentThread().getName()
	        + " | requestUsername=" + username
		);
    	
        User user = userService.getByName(username);
        System.out.println("----------finish-------------");
        if (user == null) {
        	
        		System.out.println(
                "### AUTH FAIL ### username="
                + username
                + " | user=null"
            );
        	
            throw new UsernameNotFoundException(
                    "找不到使用者：" + username
            );
        }
        
        System.out.println(
	        "### AUTH USER ### requestUsername="
	        + username
	        + " | dbUsername=" + user.getUsername()
	        + " | userId=" + user.getId()
        );
        
        return org.springframework.security.core.userdetails.User
                .withUsername(user.getUsername())
                .password(user.getPassword())
                .authorities("USER")
                .build();
    }
}