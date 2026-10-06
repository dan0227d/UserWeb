package com.example.demo.dao.impl;

import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import com.example.demo.dao.UserContentDao;
import com.example.demo.mapper.UserContentMyBatisMapper;
import com.example.demo.model.UserContent;

@Repository("UserContentDaoMyBatis")
public class UserContentDaoMyBatisImpl implements UserContentDao{

	@Autowired
	private UserContentMyBatisMapper userContentMyBatisMapper;
	
	@Override
	public Optional<UserContent> findByUser_Id(Integer id) {
		return userContentMyBatisMapper.findByUserId(id);
	}

	@Override
	public UserContent save(UserContent userContent) {
		userContentMyBatisMapper.save(userContent);
		return userContent;
	}
	
	@Override
	public UserContent update(UserContent userContent) {
		userContentMyBatisMapper.update(userContent);
		return userContent;
	}

	@Override
	public void deleteByUser_Id(Integer id) {
		userContentMyBatisMapper.deleteByUserId(id);
		
	}



}
