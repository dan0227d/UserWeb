package com.example.demo.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.User;
import com.example.demo.model.UserContent;
import com.example.demo.service.UserContentService;
import com.example.demo.service.UserService;

import jakarta.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/userContent")
@CrossOrigin // 允許跨來源請求
public class UserContentController {

	@Autowired
	private UserContentService userContentService;
	
	@Autowired
	private UserService userService;
	
	@GetMapping
	public Optional<UserContent> getcontent(Authentication authentication){
		String username = authentication.getName();
        User user = userService.getByName(username);
		//System.out.println("=========success get user name=============");
		return userContentService.getContent(user.getId());
	}
	
	@PostMapping
	public Optional<UserContent> saveContent(@RequestBody UserContent usercontent, Authentication authentication){
		//System.out.println("===========");
		String username = authentication.getName();
        User user = userService.getByName(username);
		//System.out.println("=========success get user name=============");
		return userContentService.saveContent(user.getId(), 
											usercontent.getAge(), 
											usercontent.getEmail(), 
											usercontent.getAddress());
	}
	
}
