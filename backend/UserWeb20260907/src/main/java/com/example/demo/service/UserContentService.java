package com.example.demo.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import com.example.demo.dao.UserContentDao;
import com.example.demo.dao.UserDao;
import com.example.demo.model.User;
import com.example.demo.model.UserContent;
import com.example.demo.repository.UserContentRepository;
import com.example.demo.repository.UserRepository;

@Service
public class UserContentService {

	@Autowired
	@Qualifier("UserContentDaoMyBatis")// UserContentDaoMyBatis / UserContentDaoJpa
	private UserContentDao userContentDao;
	
	@Autowired
	@Qualifier("UserDaoMyBatis")// UserDaoMyBatis / UserDaoJpa
	private UserDao userDao;
	
	public Optional<UserContent> getContent(Integer id){
		return userContentDao.findByUser_Id(id);
	}
	
	public Optional<UserContent> saveContent(
	        Integer userId,
	        Integer age,
	        String email,
	        String address) {

	    Optional<UserContent> result =
	    		userContentDao.findByUser_Id(userId);	    
	    if (result.isPresent()) {
	        // 已經存在 → 修改
	        UserContent content = result.get();
	        //System.out.println("=========success find user=============");
	        content.setAge(age);
	        content.setEmail(email);
	        content.setAddress(address);
	        System.out.println(content.getUser().getId());
	        return Optional.of(userContentDao.update(content));
	    }
	    // 不存在 → 新增
	    User user = userDao.findById(userId)
	                              .orElse(null);
	    if (user == null) {
	        return null;
	    }
	    UserContent content =
	            new UserContent(user, age, email, address);
	    return Optional.of(userContentDao.save(content));
	}
}
